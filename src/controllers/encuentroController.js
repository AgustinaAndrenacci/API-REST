//
//    encuentoController.js para mongoose
//

const Encuentro = require("../models/encuentroModel");

// GET all
exports.getAllEncuentros = async (req, res) => {
  const data = await Encuentro.find();
  res.json(data);
};

// GET by ID
exports.getEncuentroById = async (req, res) => {
  const enc = await Encuentro.findById(req.params.id);
  if (!enc) return res.status(404).json({ error: "No encontrado" });
  res.json(enc);
};

//GET BY ...  


exports.getEncuentrosByEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const encuentros = await Encuentro.find({ estado });
    let respuesta = {};
    let codigo = 200;

    if (encuentros.length === 0) {
      codigo = 404;
      respuesta = { message: "No se encontraron encuentros con ese estado" };
    } else {
      respuesta = encuentros;
    }

    res.status(codigo).json(respuesta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET by GANADOR
exports.getEncuentrosByGanador = async (req, res) => {
  try {
    const { id_jugador } = req.params;
    const encuentros = await Encuentro.find({ "ganador.id_jugador": id_jugador });
    let respuesta = {};
    let codigo = 200;

    if (encuentros.length === 0) {
      codigo = 404;
      respuesta = { message: "No se encontraron encuentros con ese ganador" };
    } else {
      respuesta = encuentros;
    }

    res.status(codigo).json(respuesta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET by PARTICIPANTE
exports.getEncuentrosByParticipante = async (req, res) => {
  try {
    const { id_jugador } = req.params;
    const encuentros = await Encuentro.find({ "jugadores.id_jugador": id_jugador });
    let respuesta = {};
    let codigo = 200;

    if (encuentros.length === 0) {
      codigo = 404;
      respuesta = { message: "No se encontraron encuentros con ese participante" };
    } else {
      respuesta = encuentros;
    }

    res.status(codigo).json(respuesta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET by ORGANIZADOR
exports.getEncuentrosByOrganizador = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const encuentros = await Encuentro.find({ "createdBy.id_usuario": id_usuario});
    let respuesta = {};
    let codigo = 200;

    if (encuentros.length === 0) {
      codigo = 404;
      respuesta = { message: "No se encontraron encuentros de ese organizador" };
    } else {
      respuesta = encuentros;
    }

    res.status(codigo).json(respuesta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


////////////////////

// CREATE
exports.createEncuentro = async (req, res) => {
  try {
    const nuevo = new Encuentro(req.body);
    const saved = await nuevo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
exports.updateEncuentro = async (req, res) => {
  try {
    const updated = await Encuentro.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "No encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteEncuentro = async (req, res) => {
  const deleted = await Encuentro.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "No encontrado" });
  res.json({ message: "Eliminado" });
};




////////////////////////////////////////////
///
///  Version funcionando para data local (sin persistencia)
///                             29.9.25  ...(?
/////////////////////////////////////////////

/*const Encuentro = require("../models/encuentroModel");

exports.getAllEncuentros = (req, res) => {
  res.json(Encuentro.getAll());
};

exports.getEncuentroById = (req, res) => {
  const id = parseInt(req.params.id);
  const encuentro = Encuentro.getById(id);
  if (!encuentro) return res.status(404).json({ error: "encuentro no encontrado (No pun Intneded)" });
  res.json(encuentro);
};

exports.createEncuentro = (req, res) => {
  const { tipo,capacidad,juego} = req.body;
  if (!tipo || !capacidad ||!juego) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  const nueva = Encuentro.create({ tipo,capacidad, juego });
  res.status(201).json(nueva);
};

exports.updateEncuentro = (req, res) => {
  const id = parseInt(req.params.id);
  const actualizada = Encuentro.update(id, req.body);
  if (!actualizada) return res.status(404).json({ error: "encuentro no encontrado" });
  res.json(actualizada);
};

exports.deleteEncuentro = (req, res) => {
  const id = parseInt(req.params.id);
  const eliminada = Encuentro.remove(id);
  if (!eliminada) return res.status(404).json({ error: "encuentro no encontrado" });
  res.json({ message: "encuentro eliminado" });
};*/