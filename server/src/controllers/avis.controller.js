const Avis = require('../models/avis.model');
const Trajet = require('../models/trajet.model');
const Reservation = require('../models/reservation.model');

// POST /api/avis  { "trajet_id": 3, "note": 4, "commentaire": "Très sympa" }
async function create(req, res) {
  const { trajet_id, note, commentaire } = req.body;

  if (!Number.isInteger(trajet_id)) {
    return res.status(400).json({ message: 'Trajet invalide' });
  }
  if (!Number.isInteger(note) || note < 1 || note > 5) {
    return res.status(400).json({ message: 'La note doit être un nombre entier entre 1 et 5' });
  }
  if (commentaire !== undefined && (typeof commentaire !== 'string' || commentaire.length > 500)) {
    return res.status(400).json({ message: 'Commentaire invalide (500 caractères maximum)' });
  }

  const trajet = await Trajet.findById(trajet_id);
  if (!trajet) {
    return res.status(404).json({ message: 'Trajet introuvable' });
  }

  // Seuls les passagers ayant réservé ce trajet peuvent donner un avis
  if (!(await Reservation.exists(trajet_id, req.user.id))) {
    return res.status(403).json({ message: 'Seuls les passagers de ce trajet peuvent donner un avis' });
  }

  try {
    await Avis.create({
      trajetId: trajet_id,
      conducteurId: trajet.user_id, // pris dans la base, jamais dans la requête
      auteurId: req.user.id, // l'utilisateur connecté
      auteurPrenom: req.user.prenom,
      note,
      commentaire: commentaire ? commentaire.trim() : '',
      createdAt: new Date(),
    });
  } catch (err) {
    // 11000 = l'index unique de MongoDB refuse un deuxième avis du même passager sur ce trajet
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Vous avez déjà donné votre avis sur ce trajet' });
    }
    throw err;
  }

  res.status(201).json({ message: 'Avis enregistré' });
}

// GET /api/avis/conducteur/:id  -> note moyenne + liste des avis d'un conducteur
async function conducteur(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Conducteur invalide' });
  }

  const stats = await Avis.statsConducteur(id);
  const avis = await Avis.findByConducteur(id);

  res.json({
    conducteurId: id,
    moyenne: stats ? Math.round(stats.moyenne * 10) / 10 : null, // arrondie à 1 décimale
    nombre: stats ? stats.nombre : 0,
    avis,
  });
}

module.exports = { create, conducteur };
