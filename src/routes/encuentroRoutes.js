//////////////////////////////////////
//
//   EncuentroRoutes para moongose
//
/////////////////////////////////////

const express = require("express");
const router = express.Router();
const encuentroController = require("../controllers/encuentroController");
const {autenticarToken, validarPermisoRuta} = require("../middlewares/authMiddleware");
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


/////
router.get("/:tipo/ganador/:id", encuentroController.getByGanador);
router.get("/:tipo/participante/:id", encuentroController.getByJugador);
router.get("/:tipo/organizador/:id", encuentroController.getByCreador);
router.get("/:tipo/estado/:estado", encuentroController.getEncuentrosByEstado);
router.get("/:tipo/juego/:juegoId", encuentroController.getByJuego);
////

// U - Update, Actualizar un encuentro existente
router.put("/:id", autenticarToken,isCreator, encuentroController.updateEncuentro);
router.put("/updatejugadores/:id",autenticarToken,encuentroController.updateJugadoresEncuentro); //!!!!!

// D - delete
router.delete("/:id",autenticarToken,isCreator, encuentroController.deleteEncuentro);



module.exports = router;

