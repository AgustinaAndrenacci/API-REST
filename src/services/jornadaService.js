//codigo que verifique si dada una jornada, y un body:
    //en el body recibe capacidad, que la misma no sea menor a los jugadores inscriptos
    //que en el return devuelva la jornada como deberia quedar
//creame la funcion completa del service:

// src/services/jornadaService.js
const Jornada = require("../models/jornadaModel");

const validarJornada = (jornadaExistente, body) => {

  const nuevaCapacidad = body.capacidad;

  // Solo valida si la capacidad está presente en el body
  if (nuevaCapacidad !== undefined) {
    const jugadoresActuales = jornadaExistente.jugadoresInscriptos.length;

    if (jugadoresActuales > nuevaCapacidad) {
      // Usar un Error de JavaScript estándar para indicar el fallo
      const errorMessage = `La capacidad (${nuevaCapacidad}) no puede ser menor a los ${jugadoresActuales} jugadores ya inscriptos.`;
      throw new Error(errorMessage);
    }
  }
  return body;
};

//getAll
const getAllJornadas = async () => {
  try {
    const jornadas = await Jornada.find();
    return jornadas;
  } catch (error) {
    throw new Error("Error al obtener todas las jornadas");
  }
};

//getByID
const getJornadaById = async (id) => {
  try {
    const jornada = await Jornada.findById(id);
    return jornada;
  } catch (error) {
    throw new Error("Error al obtener jornada");
  }
};

//update
const updateJornada = async (id, data) => {
  try {
    const jornadaActualizada = await Jornada.findByIdAndUpdate(id, data, { new: true });
    return jornadaActualizada;
  } catch (error) {
    throw new Error("Error al actualizar jornada");
  }
};

//borrarEncuentroDeJornada
const borrarEncuentroDeJornada = async (idJornada, idEncuentro) => {
  try {
    const jornadaActualizada = await jornadaService.findByIdAndUpdate(
      idJornada,
      { $pull: { encuentros: { id: idEncuentro } } },
      { new: true }
    );
    return jornadaActualizada;
  } catch (error) {
    throw new Error("Error al borrar encuentro de jornada");
  }
};

//create
const createJornada = async (data) => {
  try {
    const nuevaJornada = new Jornada(data);
    await nuevaJornada.save();
    return nuevaJornada;
  } catch (error) {
    throw new Error("Error al crear jornada");
  }
};

const estadosValidos = async (estado) => {
  try {
    const estadosValidos = Jornada.schema.paths.estado.options.enum;
    return (estadosValidos.includes(estado));
    //includes: verifica si el estado recibido está en la lista de estados válidos
  } catch (error) {
    throw new Error("Error al validar estados");
  }
};
/*
exports.validarJugadoresInscriptos = async (jugadoresInscriptos) => {
  try {
    logConsole("Validando jugadores inscriptos:");
    const jugadoresExistentes = await Usuario.find({ userName: { $in: jugadoresInscriptos } });
    const jugadoresNoExistentes = jugadoresInscriptos.filter(userName => !jugadoresExistentes.some(usuario => usuario.userName === userName));
    return jugadoresNoExistentes;
  } catch (err) {
    console.error(err);
  }
};*/

module.exports = {
  validarJornada,
  getAllJornadas,
  getJornadaById,
  updateJornada,
  createJornada,
  estadosValidos,
};
