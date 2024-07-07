const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb+srv://danielpetrov222:Wed21May@cluster0.ky4bxei.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const database = client.db('realEstate');

module.exports = database
