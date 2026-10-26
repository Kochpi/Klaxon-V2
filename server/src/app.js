const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');

const app = express();

// En-têtes HTTP de sécurité
app.use(helmet());

// Seul le front de l'application peut appeler l'API depuis un navigateur
app.use(cors({ origin: process.env.CLIENT_URL }));

// Corps JSON limité en taille
app.use(express.json({ limit: '10kb' }));

app.use('/api/health', healthRoutes);

// Route inconnue
app.use((req, res) => {
  res.status(404).json({ message: 'Ressource introuvable' });
});

// Gestion d'erreur centrale : jamais de stack trace envoyée au client
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

module.exports = app;
