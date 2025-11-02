
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

export const isRemitenteOrDestinatario = async(req, res, next) => {
  try {
    const userId = req.user.id; // desde tu auth middleware
    const mensajeId = req.params.id;

    if (!mensajeId) {
      return res.status(400).json({ error: "ID de mensaje requerido." });
    }

    const mensaje = await Mensaje.findById(mensajeId)
      .select("remitente destinatario")
      .lean();

    if (!mensaje) {
      return res.status(404).json({ error: "Mensaje no encontrado." });
    }

    // Comprobamos si el usuario actual es remitente o destinatario
    const esRemitente = mensaje.remitente.toString() === userId;
    const esDestinatario = mensaje.destinatario.toString() === userId;

    if (!esRemitente && !esDestinatario) {
      return res.status(403).json({ error: "No autorizado para eliminar este mensaje." });
    }

    next(); // autorizado
  } catch (err) {
    console.error("Error en isRemitenteOrDestinatario:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}