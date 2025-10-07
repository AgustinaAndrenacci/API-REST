// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const {autenticarToken} = require("../middlewares/authMiddleware");


 
// CRUD
router.get("/",autenticarToken,usuarioController.getAllUsuarios);
router.get("/getId/:id", usuarioController.getUsuarioById);
router.get("/getUsername/:userName", usuarioController.getUsuarioByUsername);
router.post("/registrar", usuarioController.registrar);
router.post("/login", usuarioController.login);
router.put("/:id", usuarioController.updateUsuario);
router.put("/cambiarPassword", usuarioController.updatePassword);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;
