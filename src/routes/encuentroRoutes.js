// src/routes/encuentroRoutes.js
const express = require("express");
const router = express.Router();
const encuentroController = require("../controllers/encuentroController");

// CRUD
router.get("/", encuentroController.getAllEncuentros);
router.get("/:id", encuentroController.getEncuentroById);
router.post("/", encuentroController.createEncuentro);
router.put("/:id", encuentroController.updateEncuentro);
router.delete("/:id", encuentroController.deleteEncuentro);

module.exports = router;