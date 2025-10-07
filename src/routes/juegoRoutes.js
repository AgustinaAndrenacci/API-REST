// src/routes/juegoRoutes.js
const express = require("express");
const router = express.Router();
const juegoController = require("../controllers/juegoController");
const {autenticarToken, isJuegoteka} = require("../middlewares/authMiddleware")

// CRUD
router.get("/", juegoController.getAllJuegos);
router.get("/:id", juegoController.getJuegoById);
router.post("/", isJuegoteka, juegoController.createJuego);
router.put("/:id", isJuegoteka, juegoController.updateJuego);
router.delete("/:id", isJuegoteka, juegoController.deleteJuego);

//Nuevos Endpoints
router.get("/nombre/:nombre", juegoController.getJuegoPorNombre);
router.get("/jugadores/:cantidadJugadores", juegoController.getJuegosParaXJugadores);
router.get("/jugadores/eq/:cantidadJugadores", juegoController.getJuegosParaExactamenteXJugadores);
router.get("/duracion/Max/:tiempoMax", juegoController.getJuegosMenorADuracion);
router.get("/duracion/Min/:tiempoMin", juegoController.getJuegosMayorADuracion);

module.exports = router;