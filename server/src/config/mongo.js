const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

// Ouvre la connexion à MongoDB
async function connectMongo() {
  await client.connect();
}

// Donne accès à la base MongoDB (à utiliser après connectMongo)
function getMongoDb() {
  return client.db(process.env.MONGODB_DB);
}

module.exports = { connectMongo, getMongoDb };
