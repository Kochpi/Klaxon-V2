const Trajet = require('../models/trajet.model');
const Reservation = require('../models/reservation.model');

// GET /api/reservations : mes réservations
async function mine(req, res) {
  const reservations = await Reservation.findByUser(req.user.id);
  res.json({ reservations });
}

// POST /api/reservations  { "trajet_id": 3 }  -> réserve 1 place
async function create(req, res) {
  const trajetId = req.body.trajet_id;
  if (!Number.isInteger(trajetId)) {
    return res.status(400).json({ message: 'Trajet invalide' });
  }

  const trajet = await Trajet.findById(trajetId);
  if (!trajet) {
    return res.status(404).json({ message: 'Trajet introuvable' });
  }
  if (trajet.user_id === req.user.id) {
    return res.status(400).json({ message: 'Vous ne pouvez pas réserver votre propre trajet' });
  }
  if (new Date(trajet.date_depart) <= new Date()) {
    return res.status(400).json({ message: 'Ce trajet est déjà parti' });
  }
  if (trajet.places_dispo < 1) {
    return res.status(409).json({ message: 'Ce trajet est complet' });
  }
  if (await Reservation.exists(trajetId, req.user.id)) {
    return res.status(409).json({ message: 'Vous avez déjà réservé ce trajet' });
  }

  await Reservation.create(trajetId, req.user.id);
  await Trajet.changerPlaces(trajetId, -1);
  res.status(201).json({ message: 'Réservation confirmée' });
}

// DELETE /api/reservations/:trajetId : annule MA réservation de ce trajet
async function remove(req, res) {
  const trajetId = Number(req.params.trajetId);
  if (!Number.isInteger(trajetId)) {
    return res.status(400).json({ message: 'Trajet invalide' });
  }

  // "user_id" vient de la connexion : on ne peut annuler que ses propres réservations
  const supprimee = await Reservation.remove(trajetId, req.user.id);
  if (!supprimee) {
    return res.status(404).json({ message: 'Réservation introuvable' });
  }
  await Trajet.changerPlaces(trajetId, 1);
  res.status(204).end();
}

module.exports = { mine, create, remove };
