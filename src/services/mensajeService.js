
const Mensaje = require("../models/mensajeModel");

 const crearMensaje = async (data) => {
  const nuevoMensaje = new Mensaje(data);
  return await nuevoMensaje.save();
};

const obtenerMensajes = async () => {
  return await Mensaje.find().populate("remitente destinatario", "nombre email");
};

const obtenerMensajesPorRemitente = async (idRemitente) => {
  return await Mensaje.find({ remitente: idRemitente })
    .populate("destinatario", "nombre email")
    .sort({ createdAt: -1 });
};

const obtenerMensajesPorDestinatario = async (idDestinatario) => {
  return await Mensaje.find({ destinatario: idDestinatario })
    .populate("remitente", "nombre email")
    .sort({ createdAt: -1 });
};

const actualizarMensaje = async (id, data) => {
  return await Mensaje.findByIdAndUpdate(id, data, { new: true });
};

 const eliminarMensaje = async (id) => {
  return await Mensaje.findByIdAndDelete(id);
};

module.exports = {
  crearMensaje,
  obtenerMensajes,
  obtenerMensajesPorRemitente,
  obtenerMensajesPorDestinatario,
  actualizarMensaje,
  eliminarMensaje,
};
