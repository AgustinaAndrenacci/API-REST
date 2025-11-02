// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const jornadaController = require("../controllers/jornadaController");
const {autenticarToken} = require("../middlewares/authMiddleware");
const { isNotAdmin, isJugador, isJuegoteka } = require("../middlewares/usuariosMiddleware");


// CRUD
router.get("/", jornadaController.getAllJornadas);
router.get("/:id", jornadaController.getJornadaById);
//router.get("/countJugadoresEnJornada/:id", jornadaController.countJugadoresEnJornada);
router.post("/create",autenticarToken, isJuegoteka, jornadaController.createJornada);
router.put("/edit/:id",autenticarToken, jornadaController.updateJornada);
router.put("/updateEncuentros/:id",autenticarToken, isNotAdmin,jornadaController.updateJornadaEncuentros);
//router.put("/updateJuegos/:id",autenticarToken, jornadaController.updateJornadaJuegos);
router.put("/inscripcion/:id",autenticarToken,isJugador, jornadaController.updateJornadaJugador);
router.put("/updateEstado/:id",autenticarToken, jornadaController.updateJornadaEstado);
//router.delete("/:id",autenticarToken, jornadaController.deleteJornada);

module.exports = router;
