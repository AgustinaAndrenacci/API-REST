
import Mensaje from "../models/mensajeModel.js";

// Verifica si el usuario logueado es el remitente del mensaje
export const isRemitente = async (req, res, next) => {
  try {
    const mensaje = await Mensaje.findById(req.params.id);
    if (!mensaje) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    if (mensaje.remitente.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No autorizado: no eres el remitente" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Error en la verificación de remitente" });
  }
};

// Verifica si el usuario logueado es el destinatario del mensaje
export const isDestinatario = async (req, res, next) => {
  try {
    const mensaje = await Mensaje.findById(req.params.id);
    if (!mensaje) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    if (mensaje.destinatario.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "No autorizado: no eres el destinatario" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Error en la verificación de destinatario" });
  }
};
