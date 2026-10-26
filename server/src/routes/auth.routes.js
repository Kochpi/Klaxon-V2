const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Anti force brute : 5 échecs de connexion maximum toutes les 15 minutes par adresse IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' },
});

router.post('/register', controller.register);
router.post('/login', loginLimiter, controller.login);
router.post('/logout', controller.logout);
router.get('/me', requireAuth, controller.me);

module.exports = router;
