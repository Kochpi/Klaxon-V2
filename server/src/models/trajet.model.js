const pool = require('../config/mysql');

// Partie commune des requêtes : le trajet avec le nom des villes et du conducteur
const SELECT_TRAJET = `
  SELECT t.id, t.date_depart, t.date_arrivee, t.places_total, t.places_dispo,
         t.ville_depart_id, vd.nom AS ville_depart, vd.departement AS departement_depart,
         t.ville_arrivee_id, va.nom AS ville_arrivee, va.departement AS departement_arrivee,
         t.user_id, u.prenom AS conducteur_prenom, u.nom AS conducteur_nom
  FROM trajets t
  JOIN villes vd ON vd.id = t.ville_depart_id
  JOIN villes va ON va.id = t.ville_arrivee_id
  JOIN users u ON u.id = t.user_id`;

// Trajets à venir, avec des filtres facultatifs (depart, arrivee, date)
async function findAll(filtres) {
  let sql = SELECT_TRAJET + ' WHERE t.date_depart > NOW()';
  const valeurs = [];

  if (filtres.depart) {
    sql += ' AND t.ville_depart_id = ?';
    valeurs.push(filtres.depart);
  }
  if (filtres.arrivee) {
    sql += ' AND t.ville_arrivee_id = ?';
    valeurs.push(filtres.arrivee);
  }
  if (filtres.date) {
    sql += ' AND DATE(t.date_depart) = ?';
    valeurs.push(filtres.date);
  }

  sql += ' ORDER BY t.date_depart';
  const [rows] = await pool.execute(sql, valeurs);
  return rows;
}

// Un trajet avec en plus les coordonnées du conducteur
async function findById(id) {
  const [rows] = await pool.execute(
    SELECT_TRAJET.replace('u.prenom AS', 'u.email AS conducteur_email, u.telephone AS conducteur_telephone, u.prenom AS') +
      ' WHERE t.id = ?',
    [id]
  );
  return rows[0];
}

// Les trajets proposés par un utilisateur
async function findByUser(userId) {
  const [rows] = await pool.execute(
    SELECT_TRAJET + ' WHERE t.user_id = ? ORDER BY t.date_depart DESC',
    [userId]
  );
  return rows;
}

// places_dispo = places_total au départ : personne n'a encore réservé
async function create(villeDepart, villeArrivee, dateDepart, dateArrivee, places, userId) {
  const [result] = await pool.execute(
    `INSERT INTO trajets
       (ville_depart_id, ville_arrivee_id, date_depart, date_arrivee, places_total, places_dispo, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [villeDepart, villeArrivee, dateDepart, dateArrivee, places, places, userId]
  );
  return result.insertId;
}

// "AND user_id = ?" : on ne peut supprimer que ses propres trajets
// Renvoie true si un trajet a bien été supprimé
async function remove(id, userId) {
  const [result] = await pool.execute('DELETE FROM trajets WHERE id = ? AND user_id = ?', [id, userId]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, findByUser, create, remove };
