// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const jornadaController = require("../controllers/jornadaController");
const {autenticarToken} = require("../middlewares/authMiddleware");


// CRUD
router.get("/", jornadaController.getAllJornadas);
router.get("/:id", jornadaController.getJornadaById);
router.get("/countJugadoresEnJornada/:id", jornadaController.countJugadoresEnJornada);
router.post("/",autenticarToken, jornadaController.createJornada);
router.put("/:id",autenticarToken, jornadaController.updateJornada);
router.put("/updateEncuentros/:id",autenticarToken, jornadaController.updateJornadaEncuentros);
router.put("/updateJuegos/:id",autenticarToken, jornadaController.updateJornadaJuegos);
router.put("/inscripcion/:id",autenticarToken, jornadaController.updateJornadaJugador);
router.put("/updateEstado/:id",autenticarToken, jornadaController.updateJornadaEstado);
router.delete("/:id",autenticarToken, jornadaController.deleteJornada);


module.exports = router;
