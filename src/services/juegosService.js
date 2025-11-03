const { showErrorMessage } = require("../errorHandler");
const Juego = require("../models/juegoModel");
const { getAll } = require("./encuentroService");

const verificarExistenciaJuego = async (id) => {
    try {
        const juego = await Juego.findById(id);
        return juego;
    } catch (err) {
        showErrorMessage(500, "Error al buscar juego");
    }
}

const getAllJuegos = async () => {
    const juego = await Juego.find();
    return juego;
}

const getJuegoById = async (id) => {
  const juego = await Juego.findById(id);
  return juego;
};

const getJuegoPorNombre = async (nombre) => {
  const juego = await Juego.findOne({titulo: nombre});
  return juego;
};

const getJuegosParaXJugadores = async (cantidadJugadores) => {
  const juegos = await Juego.find({
    cantJugadoresMin: { $lte: cantidadJugadores },
    cantJugadoresMax: { $gte: cantidadJugadores }, 
    estado: "activo"
  });
  return juegos;
};

const getJuegosParaExactamenteXJugadores = async (cantidadJugadores) => {
  const juegos = await Juego.find({
    cantJugadoresMin: cantidadJugadores,
    cantJugadoresMax: cantidadJugadores
  });
  return juegos;
};

const getJuegosMenorDuracion = async (tiempoMax) => {
  const juegos = await Juego.find({ tiempoEstimado: { $lte: tiempoMax }});
  return juegos;
};

const getJuegosMayorDuracion = async (tiempoMin) => {
  const juegos = await Juego.find({ tiempoEstimado: { $gte: tiempoMin }});
  return juegos;
};

const createJuego = async (data) => {
  const juego = new Juego(data);
  await juego.save();
  return juego;
};

const updateJuegoById = async (id, data) => {
  const juego = await Juego.findByIdAndUpdate(id, data, { new: true });
  return juego;
};

const deleteJuegoById = async (id) => {
  const juego = await Juego.findByIdAndUpdate(id,{estado: "eliminado"}, {new: true});
  return juego;
};

const hardDeleteJuegoById = async (id) => {
  const juego = await Juego.findByIdAndDelete(id);
  return juego;
};

//necesito una funcion que me diga si el campo "estado" del juego es "activo" o "eliminado"

module.exports = {
    verificarExistenciaJuego,
    getAllJuegos,
    getJuegoById, 
    getJuegoPorNombre,
    createJuego,
    updateJuegoById,
    deleteJuegoById,
    hardDeleteJuegoById,
    getJuegosParaXJugadores,
    getJuegosParaExactamenteXJugadores,
    getJuegosMenorDuracion,
    getJuegosMayorDuracion
};