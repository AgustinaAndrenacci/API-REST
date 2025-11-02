
const Mensaje = require("../models/mensajeModel");
const Usuario =require("../models/usuarioModel");


 const crearMensaje = async (data) => {
  const remitenteId = data.remitente.toString();
  //const usuarioLogueadoId = req.user._id.toString();

 // if (remitenteId !== usuarioLogueadoId) {
   // throw new Error("No puedes enviar un mensaje en nombre de otro usuario.");
  //}

  const destinatario = await Usuario.findById(data.destinatario);
  if (!destinatario) {
    throw new Error("El destinatario no existe.");
  }
  
  const nuevoMensaje = new Mensaje(data);
  return await nuevoMensaje.save();
};


const getMensajes = async () => {
  return await Mensaje.find().populate("remitente destinatario", "nombre email");
};

//////////////////////
//  getMensajesPorRemitente es un EJEMPLO DE COMPOSICION DE FUNCIONES
//
//Mongoose usa method chaining (composición de funciones). 
// Cada método (find, skip, limit, sort, lean) transforma el resultado del anterior:
//find() → crea query
//skip() → salta documentos
//limit() → limita resultados
//sort() → ordena
//lean() → convierte a objetos planos
//
//Es composición porque: lean(sort(limit(skip(find(data)))))
//////////////////////////////////////////////////////////////////////////////////////////
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

  const [mensajes, total] = await Promise.all([       //promise all es una FUNCION DE ORDEN SUPERIOR,  recibe un array de funciones (promesas)
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
    totalPages: Math.ceil(total / limit),  //-------------------------------------math.ceil es un EJEMPLO DE FUNCION PURA: Siempre devuelve el mismo resultado para los mismos inputs, No modifica variables externas ,No tiene efectos colaterales (no hace I/O, no muta objetos)----------------------------------------------
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
