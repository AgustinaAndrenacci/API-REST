// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const jornadaController = require("../controllers/jornadaController");

// CRUD
router.get("/", jornadaController.getAllJornadas);
router.get("/:id", jornadaController.getJornadaById);
router.post("/", jornadaController.createJornada);
router.put("/:id", jornadaController.updateJornada);
router.delete("/:id", jornadaController.deleteJornada);

module.exports = router;
