const Encuentro = require("../models/encuentroModel");

const isCreator = async (req, res, next) => {
  try {
    const usuario = req.user;
    const idEncuentro = req.params.id;

    const encuentro = await Encuentro.findById(idEncuentro);

    let codigo = 200;
    let respuesta = {};

    if (!encuentro) {
      codigo = 404;
      respuesta = { error: "Encounter not found" };
    } else if (!usuario || usuario.id_usuario !== encuentro.createdBy.id_usuario) {
      codigo = 403;
      respuesta = { error: "Forbidden: only the creator can perform this action" };
    }

    if (codigo !== 200) {
      res.status(codigo).json(respuesta);
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ error: "Error verifying creator", detail: err.message });
  }
};

module.exports = isCreator;
