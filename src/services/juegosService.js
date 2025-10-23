const { showErrorMessage } = require("../errorHandler");

//verificar si existe 1 juego enviado por parametro (ID)
exports.verificarExistenciaJuego = async (req, res) => {
    const { id } = req.params;
    try {
        const juego = await Juego.findById(id);
        juego
            ? res.json(juego)
            : showErrorMessage(404, "Juego no encontrado, ingrese un ID valido");
    } catch (err) {
        showErrorMessage(500, "Error al buscar juego");
    }
}

module.exports = {verificarExistenciaJuego}
//incorporar logicas de busqueda (por ejemplo Juego.findById()) en el service para usarse en el controller