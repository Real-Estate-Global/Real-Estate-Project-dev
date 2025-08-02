const MongoDB = require("./db");
const { v4: uuidv4 } = require("uuid");
const { getFromS3, uploadToS3, deleteFromS3 } = require("./aws");

const getPublicOffers = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('offers');
        const query = req.query || {};
        const properties = await propertiesCollection.find(query).toArray();

        const propertiesWithUrls = await Promise.all(properties.map(async (property) => {
            const imagesWithUrls = await Promise.all(property.images.map(async (image) => {
                console.log("Processing image:", image);
                if (image.key) {
                    console.log("Image key found:", image.key);
                    const url = await getFromS3(image.key);
                    console.log("Image URL:", url);
                    return { ...image, url };
                }
                return image;
            }));
            return { ...property, images: imagesWithUrls };
        }));

        res.status(200).json(propertiesWithUrls);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong while fetching the properties' });
    }
}
const getPublicOfferById = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('offers');
        const query = { _id: req.params.id };
        const propertyById = await propertiesCollection.findOne(query);

        await propertiesCollection.updateOne(query, {
            $set: {
                visited: propertyById.visited + 1
            }
        });

        res.status(200).json({
            ...propertyById,
            visited: propertyById.visited + 1
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong while fetching the properties' });
    }
}
const getOffersForUser = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('offers');
        const query = { ownerId: req.userId };
        const properties = await propertiesCollection.find(query).toArray();

        const propertiesWithUrls = await Promise.all(properties.map(async (property) => {
            const imagesWithUrls = await Promise.all(property.images.map(async (image) => {
                console.log("Processing image:", image);
                if (image.key) {
                    console.log("Image key found:", image.key);
                    const url = await getFromS3(image.key);
                    console.log("Image URL:", url);
                    return { ...image, url };
                }
                return image;
            }));
            return { ...property, images: imagesWithUrls };
        }));
        res.status(200).json(propertiesWithUrls);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong while fetching the properties' });
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
        res.status(500).json({ error: 'Something went wrong while editing the property' });
    }
}
const deleteOfferById = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('offers');
        const query = { _id: req.params.id };
        await propertiesCollection.deleteOne(query);

        res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong while deleting the property' });
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
