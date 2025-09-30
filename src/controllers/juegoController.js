// src/controllers/juegoController.js

const Juego = require("../models/juegoModel");

exports.getAllJuegos = (req, res) => {
  res.json(Juego.getAll());
};

exports.getJuegoById = (req, res) => {
  const id = parseInt(req.params.id);
  const juego = Juego.getById(id); //lo trae del modelo
  juego //ternario IF
    ? res.json(juego) //true
    : res.status(404).json({ error: "Juego no encontrado" }); //false
};

exports.createJuego = (req, res) => {
  const { titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado } = req.body;
    !titulo || !imagen || !descripcion || !reglamento || !cantJugadoresMax || !cantJugadoresMin || !tiempoEstimado
      ? res.status(400).json({ error: "Faltan campos obligatorios" }) //false
      : res.status(201).json(Juego.create({ titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado })); //true
};

exports.updateJuego = (req, res) => {
  const id = parseInt(req.params.id);
  const actualizada = Juego.update(id, req.body);
  actualizada
    ? res.json(actualizada) //true
    : res.status(404).json({ error: "Juego no encontrado" }); //false
};

exports.deleteJuego = (req, res) => {
  const id = parseInt(req.params.id);
  const eliminada = Juego.remove(id);
  eliminada
    ? res.json({ message: "Juego eliminado" }) //true
    : res.status(404).json({ error: "Juego no encontrado" }); //false
};