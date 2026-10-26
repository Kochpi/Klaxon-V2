require('dotenv').config(); // charge le fichier .env

const app = require('./app');
const pool = require('./config/mysql');
const { connectMongo } = require('./config/mongo');

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET manquant dans le fichier .env');
  }

  await pool.query('SELECT 1');
  console.log('MySQL : connecté');

  await connectMongo();
  console.log('MongoDB : connecté');

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Échec du démarrage :', err.message);
  process.exit(1);
});
