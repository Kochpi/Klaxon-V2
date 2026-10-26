const pool = require('../config/mysql');

// On liste les colonnes une par une pour ne jamais renvoyer le mot de passe par erreur
const COLONNES = 'id, nom, prenom, telephone, email, role';

async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${COLONNES} FROM users WHERE id = ?`, [id]);
  return rows[0];
}

// Seule requête qui renvoie le mot de passe haché (pour la connexion)
async function findByEmail(email) {
  const [rows] = await pool.execute(`SELECT ${COLONNES}, password FROM users WHERE email = ?`, [email]);
  return rows[0];
}

async function create(nom, prenom, telephone, email, passwordHash) {
  const [result] = await pool.execute(
    "INSERT INTO users (nom, prenom, telephone, email, password, role) VALUES (?, ?, ?, ?, ?, 'user')",
    [nom, prenom, telephone, email, passwordHash]
  );
  return result.insertId;
}

module.exports = { findById, findByEmail, create };
