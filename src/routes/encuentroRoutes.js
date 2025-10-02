//////////////////////////////////////
//
//   EncuentroRoutes para moongose
//
/////////////////////////////////////

const express = require("express");
const router = express.Router();
const encuentroController = require("../controllers/encuentroController");

// C - Crear un nuevo encuentro
router.post("/", encuentroController.createEncuentro);
// R  -Leer un documento, Read
//      get all 
router.get("/", encuentroController.getAllEncuentros);
//      get byID
router.get("/:id", encuentroController.getEncuentroById);
// U - Update, Actualizar un encuentro existente
router.put("/:id", encuentroController.updateEncuentro);
// D - Eliminar un encuentro
router.delete("/:id", encuentroController.deleteEncuentro);
// :)
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