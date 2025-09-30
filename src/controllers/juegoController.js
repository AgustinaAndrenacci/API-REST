// src/controllers/juegoController.js

const Juego = require("../models/juegoModel");

exports.getAllJuegos = async (req, res) => {
  try {
    const juegos = await Juego.find();
    res.json(juegos);
  } catch (err){
    res.status(500).json({ error: "Error al obtener lista de juegos" });
  }
};

exports.getJuegoById = async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id); //lo trae del modelo
    juego //ternario IF
    ? res.json(juego) //true
    : res.status(404).json({ error: "Juego no encontrado" }); //false
  } catch (err){
    res.status(500).json({ error: "Error al obtener juego" });
  }
};

exports.createJuego = async (req, res) => { //ESTE NO PERMITE MANDAR UN ARRAY DE JUEGOS
try {
  const { titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado } = req.body;
  if (!titulo || !imagen || !descripcion || !reglamento || !cantJugadoresMax || !cantJugadoresMin || !tiempoEstimado){
    res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  const juegoCreado = await Juego.create({ titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado });
  res.json(juegoCreado)
} catch (err){
  res.status(500).json({ error: "Error al crear juego" });
}
/*
  const { titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado } = req.body;
    !titulo || !imagen || !descripcion || !reglamento || !cantJugadoresMax || !cantJugadoresMin || !tiempoEstimado
      ? res.status(400).json({ error: "Faltan campos obligatorios" }) //false
      : res.status(201).json(Juego.create({ titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado })); //true
*/
      };

exports.updateJuego = async (req, res) => { //ESTE NO TOMA UN ID
  try {
    const juegoActualizado = await Juego.findByIdAndUpdate(req.params.id, req.body, { new: true }); //traer el body p/updatear
    juegoActualizado //ternario IF
    ? res.json(juegoActualizado) //true
    : res.status(404).json({ error: "Juego no encontrado" }); //false
  } catch (err){
    res.status(500).json({ error: "Error al actualizar juego" });
  }
};

exports.deleteJuego = async (req, res) => { //ESTE NO TOMA UN ID
  try {
    const juegoBorrado = await Juego.findByIdAndDelete(req.params.id); //lo trae del modelo
    juegoBorrado //ternario IF
    ? res.json(juegoBorrado) //true
    : res.status(404).json({ error: "Juego no encontrado" }); //false
  } catch (err){
    res.status(500).json({ error: "Error al borrar juego" });
  }
};