require('dotenv').config();

const app = require('./app');
const pool = require('./config/mysql');
const { connectMongo } = require('./config/mongo');

const REQUIRED_ENV = [
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_DATABASE',
  'MONGODB_URI',
  'MONGODB_DB',
  'CLIENT_URL',
];

async function start() {
  // On refuse de démarrer si la configuration est incomplète
  const missing = REQUIRED_ENV.filter((name) => process.env[name] === undefined);
  if (missing.length > 0) {
    throw new Error(`Variables manquantes dans .env : ${missing.join(', ')}`);
  }

  await pool.query('SELECT 1');
  console.log('MySQL : connecté');

  await connectMongo();
  console.log('MongoDB : connecté');

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Échec du démarrage :', err.message);
  process.exit(1);
});
