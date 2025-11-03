// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
//const {autenticarToken,isJuegoteka} = require("../middlewares/authMiddleware");
const { isNotAdmin, isJugador, isJuegoteka } = require("../middlewares/usuariosMiddleware");
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware")

  
// CRUD
router.get("/", autenticarToken,validarPermisoRuta,usuarioController.getAllUsuarios);
router.get("/getPerfil",autenticarToken,validarPermisoRuta, usuarioController.getPerfil);
router.get("/getId/:id",autenticarToken,validarPermisoRuta, usuarioController.getUsuarioById);
router.get("/getUsername/:userName",autenticarToken,validarPermisoRuta, usuarioController.getUsuarioByUsername);
router.get("/getJuegotekas",autenticarToken,validarPermisoRuta, usuarioController.getAllJuegotekas);
router.get("/getJugadores",autenticarToken,validarPermisoRuta, usuarioController.getAllJugadores);

router.post("/registrar",usuarioController.registrar);
router.post("/login", usuarioController.login);
router.put("/edit",autenticarToken,validarPermisoRuta, usuarioController.updateUsuario);
router.put("/cambiarPassword",autenticarToken,validarPermisoRuta, usuarioController.updatePassword);
//router.delete("/:id",autenticarToken, usuarioController.deleteUsuario);
//misJuegos
router.get("/misJuegos",autenticarToken,validarPermisoRuta, usuarioController.getMisJuegos);
router.put("/misJuegos/:idJuego",autenticarToken,validarPermisoRuta, usuarioController.agregarMisJuegos);
router.delete("/misJuegos/:idJuego",autenticarToken,validarPermisoRuta, usuarioController.eliminarJuegoDeMisJuegos);


module.exports = router;
