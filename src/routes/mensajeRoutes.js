const express = require("express");
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware")
const {isRemitente, isDestinatario} = require("../middlewares/mensajeMiddleware.js")

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
router.get("/remitente/:id", autenticarToken,isRemitente, getMensajesPorRemitente);
router.get("/destinatario/:id",autenticarToken,isDestinatario, getMensajesPorDestinatario);
router.post("/", autenticarToken,crearMensaje);
router.put("/:id", autenticarToken,actualizarMensaje);

//agregar middleware isRemitente o isDestinatario
router.delete("/:id", autenticarToken,eliminarMensaje);

module.exports = router;
