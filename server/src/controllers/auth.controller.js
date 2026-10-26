const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Options du cookie qui contient le jeton de connexion
const cookieOptions = {
  httpOnly: true, // le JavaScript du navigateur ne peut pas le lire (protège du vol par XSS)
  sameSite: 'strict', // jamais envoyé depuis un autre site (protège du CSRF)
  secure: process.env.NODE_ENV === 'production', // HTTPS obligatoire en production
  maxAge: 2 * 60 * 60 * 1000, // 2 heures
};

// Crée le jeton (JWT) et le place dans le cookie
function connecter(res, user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.cookie('klaxon_token', token, cookieOptions);
}

async function register(req, res) {
  const { nom, prenom, telephone, email, password } = req.body;

  // Tous les champs doivent être du texte (évite les objets envoyés par un pirate)
  const champs = [nom, prenom, telephone, email, password];
  if (!champs.every((c) => typeof c === 'string' && c.trim() !== '')) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }
  const emailPropre = email.trim().toLowerCase(); // sans espaces, en minuscules
  if (!/^\S+@\S+\.\S+$/.test(emailPropre)) {
    return res.status(400).json({ message: 'Email invalide' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Le mot de passe doit faire au moins 8 caractères' });
  }

  if (await User.findByEmail(emailPropre)) {
    return res.status(409).json({ message: 'Cet email est déjà utilisé' });
  }

  // On ne stocke jamais le mot de passe en clair : seulement son hash
  const hash = await bcrypt.hash(password, 10);
  // Le rôle n'est jamais lu dans la requête : tout nouveau compte est "user"
  const id = await User.create(nom.trim(), prenom.trim(), telephone.trim(), emailPropre, hash);

  const user = await User.findById(id);
  connecter(res, user);
  res.status(201).json({ user });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
  }

  const user = await User.findByEmail(email.trim().toLowerCase());

  // Les hash du jeu de données (créés avec PHP) commencent par $2y$ ; bcrypt de Node attend $2b$
  const hash = user ? user.password.replace('$2y$', '$2b$') : '';
  const ok = user && (await bcrypt.compare(password, hash));

  // Même message si l'email n'existe pas ou si le mot de passe est faux
  if (!ok) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  delete user.password; // on ne renvoie jamais le hash
  connecter(res, user);
  res.json({ user });
}

function logout(req, res) {
  res.clearCookie('klaxon_token', cookieOptions);
  res.status(204).end();
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, logout, me };
