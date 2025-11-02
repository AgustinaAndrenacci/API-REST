
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
  */

const encuentroService = require("../services/encuentroService");
const { showErrorMessage } = require("../errorHandler");

// GET / (o rutas /torneo, /desafio)
exports.getAllEncuentros = async (req, res) => {
  try {
    const route = req.path || "";
    const filtro = {};
    if (route.includes("torneo")) filtro.tipo = "torneo";
    if (route.includes("desafio")) filtro.tipo = "desafio";
    // agregar paginación: req.query.page, limit, etc.
    const data = await encuentroService.getAll(filtro);
    return res.json(data);
  } catch (err) {
    /*
    const status = mapErrorToStatus(err) || 500;
    return res.status(status).json({ error: err.message });
    */
   showErrorMessage(res, err, "Error al obtener encuentros");
  
  }
};

exports.getEncuentroById = async (req, res) => {
  try {
    const id = req.params.id;
    const encuentro = await encuentroService.getById(id);
    return res.json(encuentro);
  } catch (err) {
    
 showErrorMessage(res, 404, err.message || "encuentro no encontrado");

    }
};

exports.getEncuentrosByEstado = async (req, res) => {
  try {
    const estado = req.params.estado || req.query.estado || req.body.estado;
    if (!estado) showErrorMessage(res, 400, "Parámetro 'estado' requerido.");//return res.status(400).json({ error: "Parámetro 'estado' requerido." });
    const data = await encuentroService.getByEstado(estado);
    return res.json(data);
  } catch (err) {
       showErrorMessage(res, err, "Error al obtener encuentros por estoado");
  
  }
};

exports.getByCreador = async (req, res) => {
  try {
    const idCreador = req.params.id || req.query.id || req.body.id;
    if (!idCreador) showErrorMessage(res, 400, "creadorId requerido.");//return res.status(400).json({ error: "creadorId requerido." });
    const data = await encuentroService.getByCreador(idCreador);
    return res.json(data);
  } catch (err) {
     showErrorMessage(res, err, "Error al obtener encuentros por Creador");
  }
};

exports.getByGanador = async (req, res) => {
  try {
    const idGanador = req.params.id || req.query.id || req.body.id;
    if (!idGanador) showErrorMessage(res, err, "ganadorId requerido.");//return res.status(400).json({ error: "ganadorId requerido." });
    const data = await encuentroService.getByGanador(idGanador);
    return res.json(data);
  } catch (err) {
    showErrorMessage(res, err, "Error al obtener encuentros por ganador");
  
  }
};

exports.getByJuego = async (req, res) => {
    try {
    const idJuego = req.params.juegoId || req.query.juegoId || req.body.juegoId;
    if (!idJuego)  showErrorMessage(res, 400, "juegoId requerido.");//return res.status(400).json({ error: "juegoId requerido." });
   
    const data = await encuentroService.getByJuego(idJuego);
     
    return res.json(data);
  } catch (err) {

   showErrorMessage(res, 404, "Error al obtener encuentros por juego");
    }
};

exports.getByJugador = async (req, res) => {
  try {
    const idJugador = req.params.id || req.query.id || req.body.id;
    if (!idJugador)   showErrorMessage(res, 400, "jugadorId requerido.");//return res.status(400).json({ error: "jugadorId requerido." });
    const data = await encuentroService.getByJugador(idJugador);
    return res.json(data);
  } catch (err) {
    //const status = mapErrorToStatus(err);
    //return res.status(status).json({ error: err.message });
     showErrorMessage(res, err, "Error al obtener encuentros por jugador");
  
  }
};

// POST /encuentro --> el CREATE desde aqui no se utiliza!
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
        
       return showErrorMessage(res, 500, err.message || "Error al actualizar Encuentro");
  }
};

exports.updateJugadoresEncuentro = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updated = await encuentroService.updateJugadores(id, updates);
    return res.json(updated);
  } catch (err) {
    return showErrorMessage(res, 500, err.message || "Error al actualizar los jugadores del encuentro");
  }
};

// DELETE /encuentros/:id
exports.deleteEncuentro = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await encuentroService.deleteById(id);
    return res.json(result);
  } catch (err) {
   
   showErrorMessage(res, err, "Error al eliminar el encuentro");
  
  }
};



