//////////////////////////////////////
//
//   EncuentroRoutes para moongose
//
/////////////////////////////////////

const express = require("express");
const router = express.Router();
const encuentroController = require("../controllers/encuentroController");
//middlewares
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware");
//const {esJdor} = require("../middlewares/esUsuarioMiddleware");
const {isCreator} = require("../middlewares/isCreatorMiddleware");


//Rutas Generales

router.get ("/", autenticarToken,encuentroController.getAllEncuentros);
 

// C - Crear un nuevo encuentro--> ojo, solo desde UPDATE Jornada
//router.post("/torneo", encuentroController.createEncuentro);
//router.post("/desafio", encuentroController.createEncuentro);

// R  -Leer un encuentro, Read
//      get all 
router.get("/torneo",autenticarToken, encuentroController.getAllEncuentros);
router.get("/desafio",autenticarToken, encuentroController.getAllEncuentros);

//      get byID
router.get ("/:id",autenticarToken, encuentroController.getEncuentroById);
//router.get("/torneo/:id", encuentroController.getEncuentroById);
//router.get("/desafio/:id", encuentroController.getEncuentroById);

/////
router.get("/:tipo/estado/:estado", encuentroController.getEncuentrosByEstado);
router.get("/:tipo/ganador/:id", encuentroController.getByGanador);
router.get("/:tipo/participante/:id", encuentroController.getByJugador);
router.get("/:tipo/organizador/:id", encuentroController.getByCreador);
////

// U - Update, Actualizar un encuentro existente
router.put("/:id", autenticarToken,isCreator, encuentroController.updateEncuentro);

//crear nueva ruta de Update solo para updetear parricipantes , no necesita ser creador.


// D - delete
router.delete("/torneo/:id",autenticarToken,isCreator, encuentroController.deleteEncuentro);
router.delete("/desafio/:id",autenticarToken, encuentroController.deleteEncuentro); 

// :)



/////



module.exports = router;


//router.get("/torneo", encuentroController.getAllEncuentros);
//router.get("/desafio", encuentroController.getAllEncuentros);

/////////////////////////////////////////
//  Version funcionando en local Data
////////////////////////////////////////

/*
// src/routes/encuentroRoutes.js
const express = require("express");
const router = express.Router();
const encuentroController = require("../controllers/encuentroController");

// CRUD
router.get("/", encuentroController.getAllEncuentros);
router.get("/:id", encuentroController.getEncuentroById);
router.post("/", encuentroController.createEncuentro);
router.put("/:id", encuentroController.updateEncuentro);
router.delete("/:id", encuentroController.deleteEncuentro);

module.exports = router;
*/