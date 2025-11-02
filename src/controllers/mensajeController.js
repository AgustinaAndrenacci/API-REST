
const mensajeService = require("../services/mensajeService");

const getAllMensajes = async (req, res) => {
  try {
    const mensajes = await mensajeService.getMensajes();
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

/*
version transformando ASYNC/AWAIT x .THEN/CHATCH

const getAllMensajes = (req, res) => {
  mensajeService.getMensajes()
    .then(mensajes => {
      res.json(mensajes);
    })
    .catch(error => {
      res.status(500).json({ error: "Error al obtener los mensajes" });
    });
};
*/ 

// mensajes paginados 

const getMensajesPorRemitente = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const mensajes = await mensajeService.getMensajesPorRemitente(id, page, limit);
    res.json(mensajes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMensajesPorDestinatario = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const mensajes = await mensajeService.getMensajesPorDestinatario(id, page, limit);
    res.json(mensajes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/*
 const getMensajesPorRemitente = async (req, res) => {
  try {
    const mensajes = await mensajeService.obtenerMensajesPorRemitente(req.params.id);
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes del remitente" });
  }
};

 const getMensajesPorDestinatario = async (req, res) => {
  try {
    const mensajes = await mensajeService.obtenerMensajesPorDestinatario(req.params.id);
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes del destinatario" });
  }
};

*/


 const crearMensaje = async (req, res) => {
  try {
    const mensaje = await mensajeService.crearMensaje(req.body);
    res.status(201).json(mensaje);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el mensaje" });
  }
};

 const actualizarMensaje = async (req, res) => {
  try {
    const mensaje = await mensajeService.actualizarMensaje(req.params.id, req.body);
    res.json(mensaje);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el mensaje" });
  }
};

const eliminarMensaje = async (req, res) => {
  try {
    await mensajeService.eliminarMensaje(req.params.id);
    res.json({ mensaje: "Mensaje eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
};

module.exports = {
  getAllMensajes,
  getMensajesPorRemitente,
  getMensajesPorDestinatario,
  crearMensaje,
  actualizarMensaje,
  eliminarMensaje,
};