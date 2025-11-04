// src/controllers/juegoController.js

const { showErrorMessage } = require("../errorHandler");
const Juego = require("../models/juegoModel");
const juegosService = require("../services/juegosService");

exports.getAllJuegos = async (req, res) => {
  try {
    const juegos = await juegosService.getAllJuegos();
    res.json(juegos);
  } catch (err){
    showErrorMessage(res, 500, "No se obtuvo la lista de juegos");
  }
};

exports.getJuegoById = async (req, res) => {
  try {
    const juego = await juegosService.getJuegoById(req.params.id);
    juego
    ? juego.estado === "activo" ? res.json(juego) : showErrorMessage(res, 410, "Juego eliminado, no existe mas :(")
    : showErrorMessage(res, 404, "Juego no encontrado");
  } catch (err){
    showErrorMessage(res, 500, "Error al obtener juego");
  }
};

exports.createJuego = async (req, res) => {
  try {
    const { titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado } = req.body;
    if (!titulo || !imagen || !descripcion || !reglamento || !cantJugadoresMax || !cantJugadoresMin || !tiempoEstimado){
      showErrorMessage(res, 400, "Faltan campos obligatorios");
    } else {
      const juegoCreado = new Juego({ titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado, estado: "activo" });
      const nuevoJuego = await juegosService.createJuego(juegoCreado);
      res.json({mensaje: "Juego creado con éxito!", nuevoJuego});
    }
  } catch (err){
    showErrorMessage(res, 500, "Error al crear juego");
  }
};

exports.updateJuego = async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) {
      showErrorMessage(res, 404, "Juego no encontrado");
    }
    if (juego.estado !== "activo") {
      showErrorMessage(res, 400, "No se puede actualizar un juego eliminado");
    } else {
      const juegoActualizado = await juegosService.updateJuegoById( req.params.id, req.body, { new: true });
      res.json(juegoActualizado);
    }
  } catch (err) {
    showErrorMessage(res, 500, "Error al actualizar juego");
  }
};

exports.deleteJuego = async (req, res) => {
  try {
    const juegoBorrado = await juegosService.deleteJuegoById(req.params.id,{estado: "eliminado"}, {new: true}); //el new:true trae el documento ya actualizado.
    juegoBorrado
    ? res.json(juegoBorrado)
    : showErrorMessage(res, 404, "Juego no encontrado, que triste no?");
  } catch (err){
    showErrorMessage(res, 500, "Error al borrar juego");
  }
};

exports.deleteJuegoHARD = async (req, res) => {
  try {
    const juegoBorrado = await juegosService.hardDeleteJuegoById(req.params.id);
    juegoBorrado
    ? res.json(juegoBorrado)
    : showErrorMessage(res, 404, "Juego no encontrado, que triste no?");
  } catch (err){
    showErrorMessage(res, 500, "Error al borrar juego");
  }
};

exports.getJuegoPorNombre = async (req, res) => {
  try {
    const juegoBuscado = await juegosService.getJuegoPorNombre(req.params.nombre);
    juegoBuscado
    ? juegoBuscado.estado === "activo" ? res.json(juegoBuscado) : showErrorMessage(res, 410, "Juego eliminado, no existe mas :(")
    : showErrorMessage(res, 404, "Juego no encontrado, que triste no?");
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juego");
  }
}

exports.getJuegosParaXJugadores = async (req, res) => {
  try {
    const cantidad = parseInt(req.params.cantidadJugadores);
    const juegos = await juegosService.getJuegosParaXJugadores(cantidad);
    juegos.length > 0
    ? res.json(juegos) 
    : showErrorMessage(res, 200, `No existen juegos para ${cantidad} jugadores`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}

exports.getJuegosParaExactamenteXJugadores = async (req, res) => {
  try {
    const cantidad = parseInt(req.params.cantidadJugadores);
    const juegos = await juegosService.getJuegosParaExactamenteXJugadores(cantidad);
    juegos.length > 0
    ? res.json(juegos)
    : showErrorMessage(res, 200, `No existen juegos para exactamente ${cantidad} jugadores`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}

exports.getJuegosMenorADuracion = async (req, res) => {
  try {
    const juegos = await juegosService.getJuegosMenorDuracion(req.params.tiempoMax);
    juegos.length > 0
    ? res.json(juegos)
    : showErrorMessage(res, 200, `No existen juegos menores a ${req.params.tiempoMax} minutos`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}

exports.getJuegosMayorADuracion = async (req, res) => {
  try {
    const juegos = await juegosService.getJuegosMayorDuracion(req.params.tiempoMin);
    juegos.length > 0 
    ? res.json(juegos) 
    : showErrorMessage(res, 200, `No existen juegos mayores a ${req.params.tiempoMin} minutos`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}
