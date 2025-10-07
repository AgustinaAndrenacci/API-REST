//////////////////////////////////////
//
//   EncuentroRoutes para moongose
//
/////////////////////////////////////

const express = require("express");
const router = express.Router();
const encuentroController = require("../controllers/encuentroController");
//middlewares
const {auth} = require("../middlewares/authMiddleware");
const {esJdor} = require("../middlewares/esUsuarioMiddleware");
const {esJtca} = require("../middlewares/esJuegotecaMiddleware");
const {isCreator} = require("../middlewares/isCreator");


//  Torneo
// C - Crear un nuevo encuentro
router.post("/torneo/", auth, esJtca, encuentroController.createEncuentro);
// R  -Leer un documento, Read
//      get all 
router.get("/torneo/", encuentroController.getAllEncuentros);
//      get byID

/////
router.get("/torneo/estado/:estado", encuentroController.getEncuentrosByEstado);
router.get("/torneo/ganador/:id_jugador", encuentroController.getEncuentrosByGanador);
router.get("/torneo/participante/:id_jugador", encuentroController.getEncuentrosByParticipante);
router.get("/torneo/organizador/:id_jugador", encuentroController.getEncuentrosByOrganizador);

////
router.get("/torneo/:id", encuentroController.getEncuentroById);
// U - Update, Actualizar un encuentro existente
router.put("/torneo/:id", auth, esJtca,isCreator, encuentroController.updateEncuentro);
router.delete("/torneo/:id",auth, esJtca,isCreator, encuentroController.deleteEncuentro);
// :)


// Desafio
// C - Crear un nuevo encuentro
router.post("/desafio/",auth,esJdor, encuentroController.createEncuentro);
// R  -Leer un documento, Read
//      get all 
router.get("/desafio/", encuentroController.getAllEncuentros);
//      get byID

/////
router.get("/desafio/estado/:estado", encuentroController.getEncuentrosByEstado);
router.get("/desafio/ganador/:id_jugador", encuentroController.getEncuentrosByGanador);
router.get("/desafio/participante/:id_jugador", encuentroController.getEncuentrosByParticipante);
router.get("/desafio/organizador/:id_jugador", encuentroController.getEncuentrosByOrganizador);
/////
router.get("/desafio/:id", encuentroController.getEncuentroById);
// U - Update, Actualizar un encuentro existente
router.put("/desafio/:id",auth,esJdor, encuentroController.updateEncuentro); //FALTA ES AUTOR??
// D - Eliminar un encuentro
router.delete("/desafio/:id",auth,esJdor, encuentroController.deleteEncuentro); //FALTA ES AUTOR??

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