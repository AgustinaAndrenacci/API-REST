// src/routes/juegoRoutes.js
const express = require("express");
const router = express.Router();
const juegoController = require("../controllers/juegoController");
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware")

// CRUD
router.get("/", juegoController.getAllJuegos);
router.get("/:id", juegoController.getJuegoById);
router.post("/create", autenticarToken, validarPermisoRuta, juegoController.createJuego);
router.put("/update/:id", autenticarToken, validarPermisoRuta, juegoController.updateJuego);
router.delete("/delete/:id", autenticarToken, validarPermisoRuta, juegoController.deleteJuego);

//Nuevos Endpoints
router.get("/nombre/:nombre", juegoController.getJuegoPorNombre);
router.get("/jugadores/:cantidadJugadores", juegoController.getJuegosParaXJugadores);
router.get("/jugadores/eq/:cantidadJugadores", juegoController.getJuegosParaExactamenteXJugadores);
router.get("/duracion/Max/:tiempoMax", juegoController.getJuegosMenorADuracion);
router.get("/duracion/Min/:tiempoMin", juegoController.getJuegosMayorADuracion);

module.exports = router;