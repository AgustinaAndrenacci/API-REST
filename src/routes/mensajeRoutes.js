const express = require("express");
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware")
const {isRemitente, isDestinatario,isRemitenteOrDestinatario} = require("../middlewares/mensajeMiddleware.js")

const {
  getAllMensajes,
  getMensajesPorRemitente,
  getMensajesPorDestinatario,
  crearMensaje,
  actualizarMensaje,
  eliminarMensaje,
} = require("../controllers/mensajeController");


const router = express.Router();
/*
La función getAllMensajes, como las otras, se le pasa como argumento a router.get() sin ser invocada (sin paréntesis). 
Express recibe la función como un valor, la almacena internamente 
y la ejecutará posteriormente cuando llegue una petición HTTP GET a la ruta "/". 
Este comportamiento demuestra que en JavaScript las funciones son ciudadanos de primera clase: 
pueden ser asignadas a variables, pasadas como argumentos y retornadas desde otras funciones.
*/

router.get("/", getAllMensajes);//--------------------------ejemplos de FUNCIONES DE PRIMERA CLASE, Las funciones de primera clase son aquellas que pueden ser tratadas como cualquier otro valor en el lenguaje, 
router.get("/remitente/:id", autenticarToken,getMensajesPorRemitente);
router.get("/destinatario/:id",autenticarToken,getMensajesPorDestinatario);
router.post("/create", autenticarToken,crearMensaje);
router.put("/update/:id", autenticarToken, isRemitenteOrDestinatario,actualizarMensaje);
router.delete("/delete/:id", autenticarToken, isRemitenteOrDestinatario, eliminarMensaje);

module.exports = router;
