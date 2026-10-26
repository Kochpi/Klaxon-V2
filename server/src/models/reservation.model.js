const pool = require("../config/mysql");

// Les réservations d'un utilisateur, avec les infos du trajet
async function findByUser(userId) {
  const [rows] = await pool.execute(
    `SELECT r.id, r.created_at,
            t.id AS trajet_id, t.date_depart, t.date_arrivee,
            vd.nom AS ville_depart, va.nom AS ville_arrivee,
            u.prenom AS conducteur_prenom, u.nom AS conducteur_nom
     FROM reservations r
     JOIN trajets t ON t.id = r.trajet_id
     JOIN villes vd ON vd.id = t.ville_depart_id
     JOIN villes va ON va.id = t.ville_arrivee_id
     JOIN users u ON u.id = t.user_id
     WHERE r.user_id = ?
     ORDER BY t.date_depart`,
    [userId],
  );
  return rows;
}

// Est-ce que cet utilisateur a déjà réservé ce trajet ?
async function exists(trajetId, userId) {
  const [rows] = await pool.execute(
    "SELECT id FROM reservations WHERE trajet_id = ? AND user_id = ?",
    [trajetId, userId],
  );
  return rows.length > 0;
}

async function create(trajetId, userId) {
  await pool.execute(
    "INSERT INTO reservations (trajet_id, user_id) VALUES (?, ?)",
    [trajetId, userId],
  );
}

// Renvoie true si une réservation a bien été supprimée
async function remove(trajetId, userId) {
  const [result] = await pool.execute(
    "DELETE FROM reservations WHERE trajet_id = ? AND user_id = ?",
    [trajetId, userId],
  );
  return result.affectedRows > 0;
}

module.exports = { findByUser, exists, create, remove };
