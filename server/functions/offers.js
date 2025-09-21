const MongoDB = require("./db");
const { v4: uuidv4 } = require("uuid");
const { getFromS3, uploadToS3, deleteFromS3 } = require("./aws");
// TODO: delete
const getPropertyWithAwsImages = async (property) => {
    const imagesWithUrls = await Promise.all(property.images.map(async (image) => {
        if (image.key) {
            const url = await getFromS3(image.key);
            return { ...image, url };
        }
        return image;
    }));
    return { ...property, images: imagesWithUrls };
}
const getPropertiesWithAwImages = async (properties) => {
    const propertiesWithUrls = await Promise.all(properties.map(async (property) => {
        return await getPropertyWithAwsImages(property)
    }));

    return propertiesWithUrls
}
const getPublicOffers = async (req, res) => {
    try {
        // TODO: add pagination 0-100?
        // TODO: fix filters?
        const propertiesCollection = MongoDB.collection('offers');
        const filters = req.query || {};
        const mongoQuery = {};

        // PropertyType, City, District - direct match
        if (filters.propertyType) {
            mongoQuery.propertyType = filters.propertyType;
        }
        if (filters.city) {
            mongoQuery.city = filters.city;
        }
        if (filters.district) {
            mongoQuery.district = filters.district;
        }
        // BudgetLowest, BudgetHighest
        if (filters.budgetLowest || filters.budgetHighest) {
            mongoQuery.price = {};
            if (filters.budgetLowest) {
                mongoQuery.price.$gte = Number(filters.budgetLowest);
            }
            if (filters.budgetHighest) {
                mongoQuery.price.$lte = Number(filters.budgetHighest);
            }
        }
        // AreaLowest, AreaHighest
        if (filters.areaLowest || filters.areaHighest) {
            mongoQuery.area = {};
            if (filters.areaLowest) {
                mongoQuery.area.$gte = Number(filters.areaLowest);
            }
            if (filters.areaHighest) {
                mongoQuery.area.$lte = Number(filters.areaHighest);
            }
        }
        // FloorLowest, FloorHighest
        if (filters.floorLowest || filters.floorHighest) {
            mongoQuery.floor = {};
            if (filters.floorLowest) {
                mongoQuery.floor.$gte = Number(filters.floorLowest);
            }
            if (filters.floorHighest) {
                mongoQuery.floor.$lte = Number(filters.floorHighest);
            }
        }
        // YearOfBuildingLowest, YearOfBuildingHighest
        if (filters.yearOfBuildingLowest || filters.yearOfBuildingHighest) {
            mongoQuery.yearOfBuilding = {};
            if (filters.yearOfBuildingLowest) {
                mongoQuery.yearOfBuilding.$gte = Number(filters.yearOfBuildingLowest);
            }
            if (filters.yearOfBuildingHighest) {
                mongoQuery.yearOfBuilding.$lte = Number(filters.yearOfBuildingHighest);
            }
        }

        const properties = await propertiesCollection.find(mongoQuery).toArray();
        const propertiesWithUrls = await getPropertiesWithAwImages(properties);
        res.status(200).json(propertiesWithUrls);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong while fetching the properties' });
    }
}
const getPublicOfferById = async (req, res) => {
    try {
        // TODO: get only one from mongoDB by id.
        const propertiesCollection = MongoDB.collection('offers');
        const query = { _id: req.params.id };
        const propertyById = await propertiesCollection.findOne(query);
        const propertyWithUrls = await getPropertyWithAwsImages(propertyById);

        await propertiesCollection.updateOne(query, {
            $set: {
                visited: propertyById.visited + 1
            }
        });

        res.status(200).json({
            ...propertyWithUrls,
            visited: propertyById.visited + 1
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong while fetching the properties' });
    }
}
const getOffersForUser = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('offers');
        const query = { ownerId: req.userId };
        const properties = await propertiesCollection.find(query).toArray();
        const propertiesWithUrls = getPropertiesWithAwImages(properties);

        res.status(200).json(propertiesWithUrls);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong while fetching the properties' });
    }
}
const createOffer = async (req, res) => {
    try {
        const images = req.body.images || [];
        const awsImages = []
        for (const image of images) {
            if (!image.key) {
                // Assuming you have AWS SDK configured and s3 instance available
                const { key, url } = await uploadToS3(image)

                awsImages.push({ ...image, key, url });
            } else {
                awsImages.push(image);
            }
        }
        const propertiesCollection = MongoDB.collection('offers');
        const newProperty = await propertiesCollection.insertOne({
            ...req.body,
            images: awsImages,
            ownerId: req.userId,
            _id: uuidv4(),
            visited: 0
        })
        res.status(200).json(newProperty);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong while creating the property' });
    }
}
const getOfferById = async (req, res) => {
    await getPublicOfferById(req, res)
}
const editOfferById = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('offers');
        const query = { _id: req.params.id };

        const result = await propertiesCollection.updateOne(query, {
            $set: {
                area: req.body.area,
                currency: req.body.currency,
                description: req.body.description,
                district: req.body.district,
                floor: req.body.floor,
                location: req.body.location,
                price: req.body.price,
                propertyType: req.body.propertyType,
                rooms: req.body.rooms,
                yearOfBuilding: req.body.yearOfBuilding,
                images: req.body.images,
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong while editing the property' });
    }
}
const deleteOfferById = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('offers');
        const query = { _id: req.params.id };
        await propertiesCollection.deleteOne(query);

        res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong while deleting the property' });
    }
}

module.exports = {
    getPublicOffers,
    getPublicOfferById,
    getOffersForUser,
    createOffer,
    getOfferById,
    editOfferById,
    deleteOfferById,
}
