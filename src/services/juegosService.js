const { showErrorMessage } = require("../errorHandler");

//verificar si existe 1 juego enviado por parametro (ID)
//Agus lo comentó
/*const verificarExistenciaJuego = async (req, res) => {
    const { id } = req.params;
    try {
        const juego = await Juego.findById(id);
        juego
            ? res.json(juego)
            : showErrorMessage(404, "Juego no encontrado, ingrese un ID valido");
    } catch (err) {
        showErrorMessage(500, "Error al buscar juego");
    }
}*/

const Juego = require("../models/juegoModel");

const verificarExistenciaJuego = async (id) => {
    try {
        const juego = await Juego.findById(id);
        return juego;
    } catch (err) {
        showErrorMessage(500, "Error al buscar juego");
    }
}

//necesito una funcion que me diga si el campo "estado" del juego es "activo" o "eliminado"

module.exports = {
    verificarExistenciaJuego
};
//incorporar logicas de busqueda (por ejemplo Juego.findById()) en el service para usarse en el controller

/* hay que agregar:
    
*/