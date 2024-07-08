const MongoDB = require("./db");
const {v4: uuidv4} = require("uuid");

const getPublicOffers = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('properties');
        const query = req.query
        const properties = await propertiesCollection.find(query).toArray();

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong while fetching the properties'});
    }
}
const getPublicOfferById = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('properties');
        const query = {_id: req.params.id};
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
        res.status(500).json({error: 'Something went wrong while fetching the properties'});
    }
}
const getOffersForUser = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('properties');
        const query = {ownerId: req.userId};
        const properties = await propertiesCollection.find(query).toArray();

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong while fetching the properties'});
    }
}
const createOffer = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('properties');
        const newProperty = await propertiesCollection.insertOne({
            ...req.body,
            ownerId: req.userId,
            _id: uuidv4(),
            visited: 0
        })

        res.status(200).json(newProperty);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong while deleting the property'});
    }
}
const getOfferById = async (req, res) => {
    await getPublicOfferById(req, res)
}
const editOfferById = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('properties');
        const query = {_id: req.params.id};

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
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong while editing the property'});
    }
}
const deleteOfferById = async (req, res) => {
    try {
        const propertiesCollection = MongoDB.collection('properties');
        const query = {_id: req.params.id};
        await propertiesCollection.deleteOne(query);

        res.status(200).json({message: 'Successfully deleted'});
    } catch (error) {
        res.status(500).json({error: 'Something went wrong while deleting the property'});
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
