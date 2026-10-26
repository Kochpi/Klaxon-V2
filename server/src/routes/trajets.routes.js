const express = require("express");
const controller = require("../controllers/trajets.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", controller.list); // public
router.get("/mes-trajets", requireAuth, controller.mine); // avant "/:id" sinon "mes-trajets" serait pris pour un id
router.get("/:id", requireAuth, controller.one);
router.post("/", requireAuth, controller.create);
router.delete("/:id", requireAuth, controller.remove);

module.exports = router;
