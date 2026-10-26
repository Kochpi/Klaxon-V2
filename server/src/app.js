const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const villesRoutes = require("./routes/villes.routes");
const trajetsRoutes = require("./routes/trajets.routes");
const reservationsRoutes = require("./routes/reservations.routes");
const avisRoutes = require("./routes/avis.routes");

const app = express();

app.use(helmet()); // ajoute des en-têtes HTTP de sécurité
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // seul notre front peut appeler l'API
app.use(express.json()); // lit le JSON envoyé par le client
app.use(cookieParser()); // permet de lire les cookies

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/villes", villesRoutes);
app.use("/api/trajets", trajetsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/avis", avisRoutes);

// Route qui n'existe pas
app.use((req, res) => {
  res.status(404).json({ message: "Page introuvable" });
});

// Gestion des erreurs : on n'envoie jamais le détail technique au client
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res
    .status(status)
    .json({
      message: status === 500 ? "Erreur du serveur" : "Requête invalide",
    });
});

module.exports = app;
