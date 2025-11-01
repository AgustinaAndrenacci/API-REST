const { showErrorMessage } = require("../errorHandler"); 


const isNotAdmin = (req, res, next) => {
    if (req.user.rol !== 'administrador') {
        next();
    } else {
        showErrorMessage(res, 403, 'El usuario no tiene permisos');
    }
}

const isJugador = (req, res, next) => {
    if (req.user.rol == 'jugador') {
        next();
    } else {
        showErrorMessage(res, 403, 'El usuario no tiene permisos');
    }
}

const isJuegoteka = (req, res, next) => {
    if (req.user.rol == 'juegoteka') {
        next();
    } else {
        showErrorMessage(res, 403, 'El usuario no tiene permisos');
    }
}

module.exports = { isNotAdmin, isJugador, isJuegoteka };