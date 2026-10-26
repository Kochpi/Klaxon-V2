const Ville = require('../models/ville.model');

// GET /api/villes?q=bor  -> les villes qui commencent par "bor"
async function list(req, res) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const villes = await Ville.search(q);
  res.json({ villes });
}

module.exports = { list };
