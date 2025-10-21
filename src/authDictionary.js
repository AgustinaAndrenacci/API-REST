diccionarioRutasYPermisos = {
    //RUTAS DE juegoRoutes.js
    "/juegos/create": "juegoteka",
    "/juegos/update/:id": "juegoteka",
    "/juegos/delete/:id": "juegoteka",

    // RUTAS DE usuarioRoutes.js
    "/usuarios": "",
    "/usuarios/": "",
    "/usuarios/registrar": "",
    "/usuarios/login": "",
    "/usuarios/getPerfil": "",
    "/usuarios/getId/:id": "",
    "/usuarios/getUsername/:userName": "",
    "/usuarios/cambiarPassword": "",
    "/usuarios/update/:id": "",
    "/usuarios/:id": "",

    // RUTAS DE jornadaRoutes.js
    "/jornadas": "",
    "/jornadas/": "",
    "/jornadas/:id": "",
    "/jornadas/countJugadoresEnJornada/:id": "",
    "/jornadas/updateEncuentros/:id": "",
    "/jornadas/updateJuegos/:id": "",
    "/jornadas/inscripcion/:id": "",
    "/jornadas/updateEstado/:id": "",

  // RUTAS DE encuentroRoutes.js
    "/encuentros": "",
    "/encuentros/": "",
    "/encuentros/torneo": "",
    "/encuentros/desafio": "",
    "/encuentros/:id": "",
    "/encuentros/:tipo/estado/:estado": "",
    "/encuentros/:tipo/ganador/:id_jugador": "",
    "/encuentros/:tipo/participante/:id_jugador": "",
    "/encuentros/:tipo/organizador/:id_jugador": "",
    "/encuentros/torneo/:id": "",
    "/encuentros/desafio/:id": ""
};

diccionarioRolesYTipos = {
    //TIPOS DE PERMISOS
    "juegoteka": "torneo",
    "jugador": "desafio"
};

module.exports = diccionarioRutasYPermisos, diccionarioRolesYTipos;