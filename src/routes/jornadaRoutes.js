// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const jornadaController = require("../controllers/jornadaController");

// CRUD
router.get("/", jornadaController.getAllJornadas);
router.get("/:id", jornadaController.getJornadaById);
router.post("/", jornadaController.createJornada);
router.put("/:id", jornadaController.updateJornada);
router.put("/updateEncuentros/:id", jornadaController.updateJornadaEncuentros);
router.put("/updateJugadores/:id", jornadaController.updateJornadaJugadores);
router.put("/updateJuegos/:id", jornadaController.updateJornadaJuegos);
router.put("/updateEstado/:id", jornadaController.updateJornadaEstado);
router.delete("/:id", jornadaController.deleteJornada);

module.exports = router;
