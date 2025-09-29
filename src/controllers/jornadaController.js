// src/controllers/usuarioController.js

//CAMBIAR LO DE LOS ERRORES!!!!

const Jornada = require("../models/jornadaModel");

exports.getAllJornadas = (req, res) => {
  res.json(Jornada.getAll());
};

exports.getJornadaById = (req, res) => {
  const id = parseInt(req.params.id);
  const jornada = Jornada.getById(id); //lo trae del modelo
  jornada //ternario IF
    ? res.json(jornada) //true
    : res.status(404).json({ error: "Jornada no encontrada" }); //false
};

exports.createJornada = (req, res) => {
  const { nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles } = req.body;
  !nombre || !fechaHora || !precioInscripcion || !capacidad || !Juegoteka || !juegosDisponibles
    ? res.status(400).json({ error: "Faltan campos obligatorios" }) //false
    : res.status(201).json(Jornada.create({ nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles })); //true
};

exports.updateJornada = (req, res) => {
  const id = parseInt(req.params.id);
  const actualizada = Jornada.update(id, req.body);
  actualizada
    ? res.json(actualizada) //true
    : res.status(404).json({ error: "Jornada no encontrada" }); //false
};

exports.deleteJornada = (req, res) => {
  const id = parseInt(req.params.id);
  const eliminada = Jornada.remove(id);
  eliminada
    ? res.json({ message: "Jornada eliminada" }) //true
    : res.status(404).json({ error: "Jornada no encontrada" }); //false
};
