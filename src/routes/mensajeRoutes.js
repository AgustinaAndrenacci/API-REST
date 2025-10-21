const express = require("express");
const {
  getAllMensajes,
  getMensajesPorRemitente,
  getMensajesPorDestinatario,
  crearMensaje,
  actualizarMensaje,
  eliminarMensaje,
} = require("../controllers/mensajeController");

const router = express.Router();

router.get("/", getAllMensajes);
router.get("/remitente/:id", getMensajesPorRemitente);
router.get("/destinatario/:id", getMensajesPorDestinatario);
router.post("/", crearMensaje);
router.put("/:id", actualizarMensaje);
router.delete("/:id", eliminarMensaje);

module.exports = router;
