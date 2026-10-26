const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Bloque la requête si l'utilisateur n'est pas connecté.
// Sinon, il met l'utilisateur dans req.user pour la suite.
async function requireAuth(req, res, next) {
  const token = req.cookies.klaxon_token;
  if (!token) {
    return res.status(401).json({ message: "Vous devez être connecté" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Session invalide" });
    }
    req.user = user;
    next();
  } catch (err) {
    // jeton falsifié ou expiré
    res.status(401).json({ message: "Session invalide ou expirée" });
  }
}

module.exports = { requireAuth };
