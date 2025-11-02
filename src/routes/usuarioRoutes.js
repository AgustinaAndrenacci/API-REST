// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
//const {autenticarToken,isJuegoteka} = require("../middlewares/authMiddleware");
const { isNotAdmin, isJugador, isJuegoteka } = require("../middlewares/usuariosMiddleware");
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware")

  
// CRUD
router.get("/", autenticarToken,usuarioController.getAllUsuarios);
router.get("/getPerfil",autenticarToken, usuarioController.getPerfil);
router.get("/getId/:id",autenticarToken, usuarioController.getUsuarioById);
router.get("/getUsername/:userName",autenticarToken, usuarioController.getUsuarioByUsername);
router.get("/getJuegotekas",autenticarToken, usuarioController.getAllJuegotekas);
router.get("/getJugadores",autenticarToken, usuarioController.getAllJugadores);

router.post("/registrar",usuarioController.registrar);
router.post("/login", usuarioController.login);
router.put("/edit",autenticarToken, usuarioController.updateUsuario);
router.put("/cambiarPassword",autenticarToken, usuarioController.updatePassword);
//router.delete("/:id",autenticarToken, usuarioController.deleteUsuario);
//misJuegos
router.get("/misJuegos",autenticarToken,isNotAdmin, usuarioController.getMisJuegos);
router.put("/misJuegos/:idJuego",autenticarToken,isNotAdmin, usuarioController.agregarMisJuegos);
router.delete("/misJuegos/:idJuego",autenticarToken,isNotAdmin, usuarioController.eliminarJuegoDeMisJuegos);


module.exports = router;
