const { MongoClient } = require('mongodb');

let client = null;
let db = null;

/** Ouvre la connexion MongoDB (une seule fois). */
async function connectMongo() {
  if (db) return db;
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(process.env.MONGODB_DB);
  return db;
}

/** Renvoie la base MongoDB déjà connectée. */
function getMongoDb() {
  if (!db) {
    throw new Error("MongoDB n'est pas connecté : appeler connectMongo() d'abord.");
  }
  return db;
}

async function closeMongo() {
  if (client) await client.close();
  client = null;
  db = null;
}

module.exports = { connectMongo, getMongoDb, closeMongo };
