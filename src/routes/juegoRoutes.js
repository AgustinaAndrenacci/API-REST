// src/routes/juegoRoutes.js
const express = require("express");
const router = express.Router();
const juegoController = require("../controllers/juegoController");

// CRUD
router.get("/", juegoController.getAllJuegos);
router.get("/:id", juegoController.getJuegoById);
router.post("/", juegoController.createJuego);
router.put("/:id", juegoController.updateJuego);
router.delete("/:id", juegoController.deleteJuego);

module.exports = router;