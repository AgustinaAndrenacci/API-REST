// src/controllers/juegoController.js

const { showErrorMessage } = require("../errorHandler");
const Juego = require("../models/juegoModel");

exports.getAllJuegos = async (req, res) => {
  try {
    const juegos = await Juego.find({estado : "activo"});
    res.json(juegos);
  } catch (err){
    showErrorMessage(res, 500, "No se obtuvo la lista de juegos");
  }
};

exports.getJuegoById = async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id); //lo trae del modelo
    juego //ternario IF
    ? juego.estado === "activo" ? res.json(juego) : showErrorMessage(res, 410, "Juego eliminado, no existe mas :(") //false
    : showErrorMessage(res, 404, "Juego no encontrado"); //false
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
      const juegoCreado = await Juego.create({ titulo, imagen, descripcion, reglamento, cantJugadoresMax, cantJugadoresMin, tiempoEstimado, estado: "activo" });
      res.json(juegoCreado)
    }
  } catch (err){
    showErrorMessage(res, 500, "Error al crear juego");
  }
};

exports.updateJuego = async (req, res) => {
  try {
    const juegoActualizado = await Juego.findByIdAndUpdate(req.params.id, req.body, { new: true }); //traer el body p/updatear
    juegoActualizado //ternario IF
    ? res.json(juegoActualizado) //true
    : showErrorMessage(res, 500, "Juego no encontrado"); //false
  } catch (err){
    showErrorMessage(res, 500, "Error al actualizar juego");
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
      const juegoActualizado = await Juego.findByIdAndUpdate( req.params.id, req.body, { new: true });
      res.json(juegoActualizado);
    }
  } catch (err) {
    showErrorMessage(res, 500, "Error al actualizar juego");
  }
};

exports.deleteJuego = async (req, res) => {
  try {
    const juegoBorrado = await Juego.findByIdAndUpdate(req.params.id,{estado: "eliminado"}, {new: true}); //el new:true trae el documento ya actualizado.
    juegoBorrado //ternario IF
    ? res.json(juegoBorrado) //true
    : showErrorMessage(res, 404, "Juego no encontrado, que triste no?");
  } catch (err){
    showErrorMessage(res, 500, "Error al borrar juego");
  }
};

exports.deleteJuegoHARD = async (req, res) => {
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
    const juegoBuscado = await Juego.findOne({ titulo: req.params.nombre, estado:"activo"}); //lo trae del modelo
    juegoBuscado //ternario IF
    ? juegoBuscado.estado === "activo" ? res.json(juegoBuscado) : showErrorMessage(res, 404, "Juego eliminado, no existe mas :(")
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
      cantJugadoresMax: { $gte: cantidad }, 
      estado: "activo"
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
    : showErrorMessage(res, 404, `No existen juegos para exactamente ${cantidad} jugadores`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}

exports.getJuegosMenorADuracion = async (req, res) => {
  try {
    const juegos = await Juego.find({ tiempoEstimado: { $lte: req.params.tiempoMax}}); //lo trae del modelo
    juegos.length > 0 //ternario IF
    ? res.json(juegos) //true
    : showErrorMessage(res, 404, `No existen juegos menores a ${req.params.tiempoMax} minutos`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}

exports.getJuegosMayorADuracion = async (req, res) => {
  try {
    const juegos = await Juego.find({ tiempoEstimado: { $gte: req.params.tiempoMin}}); //lo trae del modelo
    juegos.length > 0 //ternario IF
    ? res.json(juegos) //true
    : showErrorMessage(res, 404, `No existen juegos mayores a ${req.params.tiempoMax} minutos`);
  } catch (err){
    showErrorMessage(res, 500, "Error al buscar juegos");
  }
}
