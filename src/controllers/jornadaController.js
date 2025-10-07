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
    const { nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles } = req.body;
    if (!nombre || !fechaHora || !precioInscripcion || !capacidad || !Juegoteka || !juegosDisponibles) {
      return res.status(400).json({ error: "Faltan campos obligatorios" }); //false
    }
    const nuevaJornada = new Jornada({ nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles});
    await nuevaJornada.save();
    res.status(201).json({ id: nuevaJornada.id, nuevaJornada }); //true
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

exports.updateJornadaEncuentros = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { encuentros } = req.body;
    if (!encuentros) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{//push: actualiza y no pisa
      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { $push: { encuentros } }, { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

exports.updateJornadaJugadores = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { jugadoresInscriptos } = req.body;
    if (!jugadoresInscriptos) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{//push: actualiza y no pisa
      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { $push: { jugadoresInscriptos } }, { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

exports.updateJornadaJuegos = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { juegosDisponibles } = req.body;
    if (!juegosDisponibles) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{//push: actualiza y no pisa
      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { $push: { juegosDisponibles } }, { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};
//este no va
exports.updateJornadaEstado = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { estado } = req.body;
    if (!estado) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{
      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { estado } , { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

exports.deleteJornada = async (req, res) => {
  try {
    const jornadaEliminada = await Jornada.findByIdAndDelete(req.params.id);
    jornadaEliminada
      ? res.json({ message: "Jornada eliminada", jornadaEliminada }) //true
      : res.status(404).json({ error: "Jornada no encontrada" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar jornada" });
  }
};