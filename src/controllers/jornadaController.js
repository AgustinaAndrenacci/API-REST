// src/controllers/usuarioController.js

//CAMBIAR LO DE LOS ERRORES!!!!

/*
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

*/

const Jornada = require("../models/jornadaModel");

exports.getAllJornadas = async (req, res) => {
  try {
    const jornadas = await Jornada.find();
    res.json(jornadas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener jornadas" });
  }
};

exports.getJornadaById = async (req, res) => {
  try {
    const jornada = await Jornada.findById(req.params.id);
    jornada
      ? res.json(jornada) //true
      : res.status(404).json({ error: "Jornada no encontrada" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al buscar jornada" });
  }
};

exports.createJornada = async (req, res) => {
  try {
    const { nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles, jugadoresInscriptos, encuentros } = req.body;
    if (!nombre || !fechaHora || !precioInscripcion || !capacidad || !Juegoteka || !juegosDisponibles) {
      return res.status(400).json({ error: "Faltan campos obligatorios" }); //false
    }
    const nuevaJornada = new Jornada({ nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles, jugadoresInscriptos, encuentros });
    await nuevaJornada.save();
    res.status(201).json(nuevaJornada); //true
  } catch (err) {
    res.status(500).json({ error: "Error al crear jornada" });
  }
};

exports.updateJornada = async (req, res) => {
  try {
    const jornadaActualizada = await Jornada.findByIdAndUpdate(req.params.id, req.body, { new: true });
    jornadaActualizada
      ? res.json(jornadaActualizada) //true
      : res.status(404).json({ error: "Jornada no encontrada" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

exports.deleteJornada = async (req, res) => {
  try {
    const jornadaEliminada = await Jornada.findByIdAndDelete(req.params.id);
    jornadaEliminada
      ? res.json({ message: "Jornada eliminada" }) //true
      : res.status(404).json({ error: "Jornada no encontrada" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar jornada" });
  }
};