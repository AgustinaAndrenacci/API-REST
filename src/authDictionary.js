diccionarioRutasYPermisos = {
    //RUTAS DE juegoRoutes.js
    "/juegos/create": "juegoteka",
    "/juegos/update/:id": "juegoteka",
    "/juegos/delete/:id": "juegoteka"
};

diccionarioRolesYTipos = {
    //TIPOS DE PERMISOS
    "juegoteka": "torneo",
    "jugador": "desafio"
};

module.exports = diccionarioRutasYPermisos, diccionarioRolesYTipos;