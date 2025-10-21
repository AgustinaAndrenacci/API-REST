// src/controllers/juegoController.js

const { showErrorMessage } = require("../errorHandler");
const Juego = require("../models/juegoModel");

exports.getAllJuegos = async (req, res) => {
  try {
    const juegos = await Juego.find();
    res.json(juegos);
  } catch (err){
    showErrorMessage(500, "No se obtuvo la lista de juegos");
  }
};

exports.getJuegoById = async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id); //lo trae del modelo
    juego //ternario IF
    ? res.json(juego) //true
    : showErrorMessage(404, "Juego no encontrado"); //false
  } catch (err){
    showErrorMessage(500, "Error al obtener juego");
  }
};

exports.createJuego = async (req, res) => {
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
};

exports.updateJuego = async (req, res) => {
  try {
    const juegoActualizado = await Juego.findByIdAndUpdate(req.params.id, req.body, { new: true }); //traer el body p/updatear
    juegoActualizado //ternario IF
    ? res.json(juegoActualizado) //true
    : res.status(404).json({ error: "Juego no encontrado" }); //false
  } catch (err){
    res.status(500).json({ error: "Error al actualizar juego" });
  }
};

exports.deleteJuego = async (req, res) => {
  try {
    const juegoBorrado = await Juego.findByIdAndDelete(req.params.id); //lo trae del modelo
    juegoBorrado //ternario IF
    ? res.json(juegoBorrado) //true
    : showErrorMessage(res, 404, "Juego no encontrado, que triste no?");
  } catch (err){
    showErrorMessage(res, 500, "Error al borrar juego");
  }
};

exports.getJuegoPorNombre = async (req, res) => {
  try {
    const juegoBuscado = await Juego.findOne({ titulo: req.params.nombre}); //lo trae del modelo
    juegoBuscado //ternario IF
    ? res.json(juegoBuscado) //true
    : showErrorMessage(res, 404, "Juego no encontrado, que triste no?");
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juego");
  }
}

exports.getJuegosParaXJugadores = async (req, res) => {
  try {
    const cantidad = parseInt(req.params.cantidadJugadores); //lo trae del modelo
    const juegos = await Juego.find({
      cantJugadoresMin: { $lte: cantidad },
      cantJugadoresMax: { $gte: cantidad }
    });
    juegos.length > 0 //ternario IF
    ? res.json(juegos) //true
    : showErrorMessage(res, 404, `No existen juegos para ${cantidad} jugadores`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}

exports.getJuegosParaExactamenteXJugadores = async (req, res) => {
  try {
    const cantidad = parseInt(req.params.cantidadJugadores); //lo trae del modelo
    const juegos = await Juego.find({
      cantJugadoresMin: cantidad,
      cantJugadoresMax: cantidad
    });
    juegos.length > 0 //ternario IF
    ? res.json(juegos) //true
    : res.status(404).json({ error: `No existen juegos para exactamente ${cantidad} jugadores`});
  } catch (err){
    res.status(500).json({ error: "Error al buscar juegos"});
  }
}

exports.getJuegosMenorADuracion = async (req, res) => {
  try {
    const juegos = await Juego.find({ tiempoEstimado: { $lte: req.params.tiempoMax}}); //lo trae del modelo
    juegos.length > 0 //ternario IF
    ? res.json(juegos) //true
    : res.status(404).json({ error: `No existen juegos menores a ${req.params.tiempoMax} minutos`});
  } catch (err){
    res.status(500).json({ error: "Error al buscar juegos"});
  }
}

exports.getJuegosMayorADuracion = async (req, res) => {
  try {
    const juegos = await Juego.find({ tiempoEstimado: { $gte: req.params.tiempoMin}}); //lo trae del modelo
    juegos.length > 0 //ternario IF
    ? res.json(juegos) //true
    : res.status(404).json({ error: `No existen juegos mayores a ${req.params.tiempoMin} minutos`});
  } catch (err){
    res.status(500).json({ error: "Error al buscar juegos"});
  }
}
