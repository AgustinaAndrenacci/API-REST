//
//    encuentoController.js para mongoose
//

const Encuentro = require("../models/encuentroModel");

// GET all
exports.getAllEncuentros = async (req, res) => {
  try {
    const route = req.path; 

    const filtro = {};
    if (route.includes("torneo")) filtro.tipo = 'torneo';
    if (route.includes("desafio")) filtro.tipo = 'desafio'; //if redundante, tomar de regex el filtro directo

    const data = await Encuentro.find(filtro);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching encuentros", detail: err.message });
  }
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
    const {tipo,estado} = req.params;
     

    const encuentros = await Encuentro.find({ 
      "tipo": tipo,
      "estado": estado
     });
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
    const {tipo, id_jugador} = req.params;
  
    const encuentros = await Encuentro.find({ 
      tipo:tipo,
      "ganador.id_jugador": id_jugador 
    });
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
    const {tipo, id_jugador} = req.params;

    const encuentros = await Encuentro.find({ 
      "tipo":tipo,
      "jugadores.id_jugador": id_jugador 
    });
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
    const {tipo, id_usuario  } = req.params.tipo;
  
    const encuentros = await Encuentro.find({ 
      tipo:tipo,
      "createdBy.id_usuario": id_usuario
    });
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
    const route = req.path; 
    if (route.includes("torneo")) nuevo.tipo = 'torneo';
    if (route.includes("desafio")) nuevo.tipo = 'desafio';  //If redundante, tomar de regex
    const saved = await nuevo.save();

    //res.status(201).json(saved);
    res.status(201).json({ message: "Encuentro Creado",
        Encuentro:{
          id: saved._id,
          tipo: saved.tipo,
          estado: saved.estado
          }});
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