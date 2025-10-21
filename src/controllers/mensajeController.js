
const mensajeService = require("../services/mensajeService");

const getAllMensajes = async (req, res) => {
  try {
    const mensajes = await mensajeService.obtenerMensajes();
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

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