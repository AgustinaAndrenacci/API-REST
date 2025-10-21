// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const {autenticarToken,isJuegoteka} = require("../middlewares/authMiddleware");
const {isAdmin} = require("../middlewares/isAdmin");
const {isJugadorMiddleware} = require("../middlewares/isJugadorMiddleware");
const {isMe} = require("../middlewares/isMeMiddleware");

  
// CRUD
router.get("/", autenticarToken,usuarioController.getAllUsuarios);
router.get("/getPerfil",autenticarToken, usuarioController.getPerfil);
router.get("/getId/:id",autenticarToken, usuarioController.getUsuarioById);
router.get("/getUsername/:userName",autenticarToken, usuarioController.getUsuarioByUsername);
router.post("/registrar",usuarioController.registrar);
router.post("/login", usuarioController.login);
router.put("/",autenticarToken, usuarioController.updateUsuario);
router.put("/cambiarPassword",autenticarToken, usuarioController.updatePassword);
//router.delete("/:id",autenticarToken, usuarioController.deleteUsuario);
//misJuegos
router.get("/misJuegos",autenticarToken, usuarioController.getMisJuegos);
router.put("/misJuegos/:idJuego",autenticarToken, usuarioController.agregarMisJuegos);
router.delete("/misJuegos/:idJuego",autenticarToken, usuarioController.eliminarJuegoDeMisJuegos);


module.exports = router;
