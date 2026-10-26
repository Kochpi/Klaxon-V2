const express = require('express');
const pool = require('../config/mysql');
const { getMongoDb } = require('../config/mongo');

const router = express.Router();

/** GET /api/health : vérifie que l'API et les deux bases répondent. */
router.get('/', async (req, res) => {
  const status = { api: 'ok', mysql: 'ko', mongodb: 'ko' };

  try {
    await pool.query('SELECT 1');
    status.mysql = 'ok';
  } catch {
    // on n'expose pas le détail de l'erreur au client
  }

  try {
    await getMongoDb().command({ ping: 1 });
    status.mongodb = 'ok';
  } catch {
    // idem
  }

  const allOk = status.mysql === 'ok' && status.mongodb === 'ok';
  res.status(allOk ? 200 : 503).json(status);
});

module.exports = router;
