const Trajet = require('../models/trajet.model');

// Une date doit ressembler à 2026-11-05T08:30 (ou avec un espace à la place du T)
const FORMAT_DATE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/;

function estDateValide(texte) {
  return typeof texte === 'string' && FORMAT_DATE.test(texte) && !isNaN(new Date(texte));
}

// GET /api/trajets?depart=1&arrivee=2&date=2026-11-05  (les 3 filtres sont facultatifs)
async function list(req, res) {
  const filtres = {};

  for (const nom of ['depart', 'arrivee']) {
    if (req.query[nom]) {
      const valeur = Number(req.query[nom]);
      if (!Number.isInteger(valeur)) {
        return res.status(400).json({ message: `Filtre "${nom}" invalide` });
      }
      filtres[nom] = valeur;
    }
  }
  if (req.query.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.query.date)) {
      return res.status(400).json({ message: 'Filtre "date" invalide (format AAAA-MM-JJ)' });
    }
    filtres.date = req.query.date;
  }

  const trajets = await Trajet.findAll(filtres);
  res.json({ trajets });
}

// GET /api/trajets/mes-trajets
async function mine(req, res) {
  const trajets = await Trajet.findByUser(req.user.id);
  res.json({ trajets });
}

// GET /api/trajets/:id  (connecté : on voit aussi l'email et le téléphone du conducteur)
async function one(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Identifiant invalide' });
  }

  const trajet = await Trajet.findById(id);
  if (!trajet) {
    return res.status(404).json({ message: 'Trajet introuvable' });
  }
  res.json({ trajet });
}

// POST /api/trajets
async function create(req, res) {
  const { ville_depart_id, ville_arrivee_id, date_depart, date_arrivee, places_total } = req.body;

  if (!Number.isInteger(ville_depart_id) || !Number.isInteger(ville_arrivee_id)) {
    return res.status(400).json({ message: 'Les villes sont obligatoires' });
  }
  if (ville_depart_id === ville_arrivee_id) {
    return res.status(400).json({ message: 'Le départ et l\'arrivée doivent être différents' });
  }
  if (!estDateValide(date_depart) || !estDateValide(date_arrivee)) {
    return res.status(400).json({ message: 'Dates invalides (exemple : 2026-11-05T08:30)' });
  }
  if (new Date(date_depart) <= new Date()) {
    return res.status(400).json({ message: 'Le départ doit être dans le futur' });
  }
  if (new Date(date_arrivee) <= new Date(date_depart)) {
    return res.status(400).json({ message: 'L\'arrivée doit être après le départ' });
  }
  if (!Number.isInteger(places_total) || places_total < 1 || places_total > 9) {
    return res.status(400).json({ message: 'Le nombre de places doit être entre 1 et 9' });
  }

  let id;
  try {
    // Le conducteur est l'utilisateur connecté : on ne lit jamais user_id dans la requête
    id = await Trajet.create(
      ville_depart_id,
      ville_arrivee_id,
      date_depart.replace('T', ' '),
      date_arrivee.replace('T', ' '),
      places_total,
      req.user.id
    );
  } catch (err) {
    // La ville n'existe pas dans la base
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Ville inconnue' });
    }
    throw err;
  }

  const trajet = await Trajet.findById(id);
  res.status(201).json({ trajet });
}

// DELETE /api/trajets/:id
async function remove(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Identifiant invalide' });
  }

  const supprime = await Trajet.remove(id, req.user.id);
  if (!supprime) {
    // Trajet inexistant OU qui appartient à quelqu'un d'autre : même réponse
    return res.status(404).json({ message: 'Trajet introuvable' });
  }
  res.status(204).end();
}

module.exports = { list, mine, one, create, remove };
