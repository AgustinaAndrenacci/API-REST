const Encuentro = require("../models/encuentroModel");
const { showErrorMessage } = require("../errorHandler");

const isCreator = async (req, res, next) => {
  try {
    const usuario = req.user;
    const idEncuentro = req.params.id;


    const encuentro = await Encuentro.findById(idEncuentro);
//console.log(encuentro)

    let codigo = 200;
    let respuesta = {};

    if (!encuentro) {
      codigo = 404;
      respuesta = "Encuentro no encontrado";
      //showErrorMessage(res, 404, "Encuentro no encontrado");
    } else if (!usuario || usuario.id !== encuentro.createdBy[0].id_usuario) {
    console.log(usuario.id);
    console.log(encuentro.createdBy[0].id_usuario)
      codigo = 403;
      respuesta =  "Error. Funcion reservada al creador" ;
      //showErrorMessage(res, 403, err.message||"Error. Funcion reservada al creador");
      
    }

    if (codigo !== 200) {
      showErrorMessage(res, codigo, respuesta);
    } else {
      next();
    }
  } catch (err) {
    //res.status(500).json({ error: "Error verifying creator", detail: err.message });
    showErrorMessage(res, 500, "Error al verificar el creador");
  }
};

module.exports = {isCreator};
