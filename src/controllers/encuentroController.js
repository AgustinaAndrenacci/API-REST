
/**
 * controllers/encuentroController.js
 *
 * Controller refactorizado: delega la lógica al servicio (encuentroService).
 * Mantiene la firma (req, res) para que las rutas no requieran cambios.
 *
 * Manejo de errores:
 *  - Errores de validación del service devuelven 400 (Bad Request)
 *  - Errores por recurso no encontrado devuelven 404
 *  - Errores inesperados devuelven 500
 *
 * Nota: si querés otro esquema de códigos HTTP (ej: 422 para validaciones), lo adapto.
 */

const encuentroService = require("../services/encuentroService");
const { showErrorMessage } = require("../errorHandler");

/*// Helper para mapear errores a códigos HTTP
function mapErrorToStatus(err) {
  const msg = (err && err.message) || "";
  // reglas simples: si mensaje contiene 'no encontrado' o 'no existe' -> 404
  if (/no encontrado|no existe|not found/i.test(msg)) return 404;
  // si mensaje contiene 'invalid|inválid|id inválido' -> 400
  if (/inválid|invalid|requerido|obligatorio|no encontrado/i.test(msg)) return 400;
  // default 400 para errores de validación y 500 para otros
  return 400;
}*/

// GET / (o rutas /torneo, /desafio)
exports.getAllEncuentros = async (req, res) => {
  try {
    const route = req.path || "";
    const filtro = {};
    if (route.includes("torneo")) filtro.tipo = "torneo";
    if (route.includes("desafio")) filtro.tipo = "desafio";
    // Podés agregar paginación: req.query.page, limit, etc.
    const data = await encuentroService.getAll(filtro);
    return res.json(data);
  } catch (err) {
    /*
    const status = mapErrorToStatus(err) || 500;
    return res.status(status).json({ error: err.message });
    */
   return handleControllerError(res, err, "Error al obtener encuentros");
  
  }
};

exports.getEncuentroById = async (req, res) => {
  try {
    const id = req.params.id;
    const encuentro = await encuentroService.getById(id);
    return res.json(encuentro);
  } catch (err) {
    const msg = err.message || "";
   // if (/no encontrado|not found/i.test(msg)) return res.status(404).json({ error: msg });
  // return res.status(400).json({ error: msg });
    return handleControllerError(res, err, "Error al obtener encuentros por ID");
    }
};

exports.getEncuentrosByEstado = async (req, res) => {
  try {
    const estado = req.params.estado || req.query.estado || req.body.estado;
    if (!estado) return res.status(400).json({ error: "Parámetro 'estado' requerido." });
    const data = await encuentroService.getByEstado(estado);
    return res.json(data);
  } catch (err) {
    //const status = mapErrorToStatus(err);
    //return res.status(status).json({ error: err.message });
    return handleControllerError(res, err, "Error al obtener encuentros por estoado");
  
  }
};

exports.getByCreador = async (req, res) => {
  try {
    const idCreador = req.params.id || req.query.id || req.body.id;
    if (!idCreador) return res.status(400).json({ error: "creadorId requerido." });
    const data = await encuentroService.getByCreador(idCreador);
    return res.json(data);
  } catch (err) {
    const status = mapErrorToStatus(err);
    return res.status(status).json({ error: err.message });
  }
};

exports.getByGanador = async (req, res) => {
  try {
    const idGanador = req.params.id || req.query.id || req.body.id;
    if (!idGanador) return res.status(400).json({ error: "ganadorId requerido." });
    const data = await encuentroService.getByGanador(idGanador);
    return res.json(data);
  } catch (err) {
    //const status = mapErrorToStatus(err);
    //return res.status(status).json({ error: err.message });
    return handleControllerError(res, err, "Error al obtener encuentros por ganador");
  
  }
};

exports.getByJuego = async (req, res) => {
  try {
    const idJuego = req.params.juegoId || req.query.juegoId || req.body.juegoId;
    if (!idJuego) return res.status(400).json({ error: "juegoId requerido." });
    const data = await encuentroService.getByJuego(idJuego);
    return res.json(data);
  } catch (err) {
   // const status = mapErrorToStatus(err);
  //return res.status(status).json({ error: err.message });
  return handleControllerError(res, err, "Error al obtener encuentros por juego");
    }
};

exports.getByJugador = async (req, res) => {
  try {
    const idJugador = req.params.id || req.query.id || req.body.id;
    if (!idJugador) return res.status(400).json({ error: "jugadorId requerido." });
    const data = await encuentroService.getByJugador(idJugador);
    return res.json(data);
  } catch (err) {
    //const status = mapErrorToStatus(err);
    //return res.status(status).json({ error: err.message });
    return handleControllerError(res, err, "Error al obtener encuentros por Jugador");
  
  }
};

// POST /encuentro
/*
exports.createEncuentro = async (req, res) => {
  try {
    const payload = {... req.body};
    const route = req.path;
    if (route.includes("torneo")) payload.tipo = "torneo";
    if (route.includes("desafio")) payload.tipo = "desafio";
    
    const created = await encuentroService.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    // si es validación, 400; si no, 500
    const msg = err.message || "";
    if (/no encontrado|no existe|no encontrado/i.test(msg)) return res.status(404).json({ error: msg });
    return res.status(400).json({ error: msg });
  }
};*/

// PUT /encuentros/:id
exports.updateEncuentro = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updated = await encuentroService.update(id, updates);
    return res.json(updated);
  } catch (err) {
   // const msg = err.message || "";
    //if (/no encontrado|not found/i.test(msg)) return res.status(404).json({ error: msg });
    //return res.status(400).json({ error: msg });
    return handleControllerError(res, err, "Error al actualizar Encuentro");
  
  }
};

// DELETE /encuentros/:id
exports.deleteEncuentro = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await encuentroService.deleteById(id);
    return res.json(result);
  } catch (err) {
    const msg = err.message || "";
    //if (/no encontrado|not found/i.test(msg)) return res.status(404).json({ error: msg });
    //return res.status(400).json({ error: msg });
    return handleControllerError(res, err, "Error al borrar encuentro");
  
  }
};



/*
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


*/

//////////////////////////////////////////////////////////////////////////////////////////////////

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