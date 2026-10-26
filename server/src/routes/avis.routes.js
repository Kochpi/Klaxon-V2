const express = require('express');
const controller = require('../controllers/avis.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', requireAuth, controller.create);
router.get('/conducteur/:id', controller.conducteur); // public

module.exports = router;
