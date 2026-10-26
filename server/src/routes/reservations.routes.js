const express = require("express");
const controller = require("../controllers/reservations.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

// Toutes les routes de réservation demandent d'être connecté
router.use(requireAuth);

router.get("/", controller.mine);
router.post("/", controller.create);
router.delete("/:trajetId", controller.remove);

module.exports = router;
