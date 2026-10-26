const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

// Donne accès à la base MongoDB (à utiliser après connectMongo)
function getMongoDb() {
  return client.db(process.env.MONGODB_DB);
}

// Ouvre la connexion à MongoDB et prépare la collection des avis
async function connectMongo() {
  await client.connect();

  // Index unique : un passager ne peut donner qu'un seul avis par trajet (garanti par la base)
  await getMongoDb().collection('avis').createIndex({ trajetId: 1, auteurId: 1 }, { unique: true });
  // Index pour retrouver vite les avis d'un conducteur
  await getMongoDb().collection('avis').createIndex({ conducteurId: 1 });
}

module.exports = { connectMongo, getMongoDb };
