//utilizados en middlewares/authMiddleware.js para validar si un usuario puede acceder a un endpoint o no. 
//Si el array es vacío [], acceso publico. Si no, debe incluir el rol del usuario en la lista

diccionarioRutasYPermisos = {
    //RUTAS DE juegoRoutes.js
    "/juegos/create": ["juegoteka", "administrador"],
    "/juegos/update/:id": ["juegoteka", "administrador"],
    "/juegos/delete/:id": ["administrador"],
    "/juegos/delete/hard/:id": ["administrador"],

    // RUTAS DE usuarioRoutes.js
    "/usuarios/": [], //todos
    "/usuarios/edit": [], //todos
    "/usuarios/registrar": [], //todos
    "/usuarios/login": [], //todos
    "/usuarios/getPerfil": [], //todos
    "/usuarios/getId/:id": [], //todos
    "/usuarios/getUsername/:userName": [], //todos
    "/usuarios/cambiarPassword": [], //todos
    "/usuarios/getJuegotekas": [], //todos
    "/usuarios/getJugadores": [], //todos
   //Tienen los dos siguientes: isNotAdmin 
    "/usuarios/misJuegos": ["juegoteka", "jugador"], //juegoteka,jugador
    "/usuarios/misJuegos/:idJuego": ["juegoteka", "jugador"], //juegoteka,jugador

    // RUTAS DE jornadaRoutes.js
    "/jornadas/": [], //todos
    "/jornadas/:id": [], //todos
    "/jornadas/create": ["juegoteka"], //juegoteka NO ADMIN
    "/jornadas/edit/:id": ["juegoteka", "administrador"], //juegoteka - ADMIN
    "/jornadas/updateEncuentros/:id": ["jugador", "juegoteka"], //jugador, juegoteka NO ADMIN
    "/jornadas/inscripcion/:id": ["jugador"], //jugador NO ADMIN
    "/jornadas/updateEstado/:id": ["juegoteka", "administrador"], //juegoteka - ADMIN

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