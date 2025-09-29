// src/controllers/usuarioController.js

//CAMBIAR LO DE LOS ERRORES!!!!

const Usuario = require("../models/usuarioModel");

exports.getAllUsuarios = (req, res) => {
  res.json(Usuario.getAll());
};

exports.getUsuarioById = (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = Usuario.getById(id); //lo trae del modelo
  usuario //ternario IF
    ? res.json(usuario) //true
    : res.status(404).json({ error: "Usuario no encontrado" }); //false
};

exports.createUsuario = (req, res) => {
  const { userName, pass, rol } = req.body;
  !userName || !pass || !rol
    ? res.status(400).json({ error: "Faltan campos obligatorios" }) //false
    : res.status(201).json(Usuario.create({ userName, pass, rol })); //true
};

exports.updateUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const actualizada = Usuario.update(id, req.body);
  actualizada
    ? res.json(actualizada) //true
    : res.status(404).json({ error: "Usuario no encontrado" }); //false
};

exports.deleteUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const eliminada = Usuario.remove(id);
  eliminada
    ? res.json({ message: "Usuario eliminado" }) //true
    : res.status(404).json({ error: "Usuario no encontrado" }); //false
};
