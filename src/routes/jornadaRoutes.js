// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const jornadaController = require("../controllers/jornadaController");
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware")
const { isNotAdmin, isJugador, isJuegoteka } = require("../middlewares/usuariosMiddleware");


// CRUD
router.get("/", jornadaController.getAllJornadas);
router.get("/:id", jornadaController.getJornadaById);
//router.get("/countJugadoresEnJornada/:id", jornadaController.countJugadoresEnJornada);
router.post("/create",autenticarToken, validarPermisoRuta, jornadaController.createJornada);
router.put("/edit/:id",autenticarToken, validarPermisoRuta, jornadaController.updateJornada);
router.put("/updateEncuentros/:id",autenticarToken, validarPermisoRuta, jornadaController.updateJornadaEncuentros);
//router.put("/updateJuegos/:id",autenticarToken, jornadaController.updateJornadaJuegos);
router.put("/inscripcion/:id",autenticarToken, validarPermisoRuta, jornadaController.updateJornadaJugador);
router.put("/updateEstado/:id",autenticarToken, validarPermisoRuta, jornadaController.updateJornadaEstado);
//router.delete("/:id",autenticarToken, jornadaController.deleteJornada);

module.exports = router;
