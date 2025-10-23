
const Mensaje = require("../models/mensajeModel");


//VALIDAR: REMITENTE=USR LOgUEADO_ sacar del token (esta en usr_controler)
//         destinatario= que exista

 const crearMensaje = async (data) => {
  const nuevoMensaje = new Mensaje(data);
  return await nuevoMensaje.save();
};

const getMensajes = async () => {
  return await Mensaje.find().populate("remitente destinatario", "nombre email");
};


// mensajes paginados -max 10 por pag
async function getMensajesPorRemitente(remitenteId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [mensajes, total] = await Promise.all([
    Mensaje.find({ remitente: remitenteId })
      .skip(skip)
      .limit(limit)
      .sort({ fecha: -1 }) // opcional
      .lean(),
    Mensaje.countDocuments({ remitente: remitenteId }),
  ]);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    mensajes,
  };
}

async function getMensajesPorDestinatario(destinatarioId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [mensajes, total] = await Promise.all([
    Mensaje.find({ destinatario: destinatarioId })
      .skip(skip)
      .limit(limit)
      .sort({ fecha: -1 })
      .lean(),
    Mensaje.countDocuments({ destinatario: destinatarioId }),
  ]);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    mensajes,
  };
}

/*
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
*/

const actualizarMensaje = async (id, data) => {
  return await Mensaje.findByIdAndUpdate(id, data, { new: true });
};

 const eliminarMensaje = async (id) => {
  return await Mensaje.findByIdAndDelete(id);
};

module.exports = {
  crearMensaje,
  getMensajes,
  getMensajesPorRemitente,
  getMensajesPorDestinatario,
  actualizarMensaje,
  eliminarMensaje,
};
