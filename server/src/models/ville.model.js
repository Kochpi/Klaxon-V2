const pool = require('../config/mysql');

// Renvoie les villes dont le nom commence par "debut" (toutes les villes si debut est vide)
async function search(debut) {
  const [rows] = await pool.execute(
    'SELECT id, nom, departement FROM villes WHERE nom LIKE ? ORDER BY nom',
    [debut + '%']
  );
  return rows;
}

module.exports = { search };
