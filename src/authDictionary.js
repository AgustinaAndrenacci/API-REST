diccionarioRutasYPermisos = { //es para discriminar entre si sos "juegoteka" o "jugador". Si puede cualquiera de los 2, no incluir dicha ruta
    //RUTAS DE juegoRoutes.js
    "/juegos/create": ["juegoteka", "administrador"],
    "/juegos/update/:id": "juegoteka",
    "/juegos/delete/:id": "juegoteka",
    "/juegos/delete/hard/:id": "juegoteka",

    // RUTAS DE usuarioRoutes.js
    //"/usuarios/": "", //todos
    //"/usuarios/edit": "", //todos
   // "/usuarios/registrar": "", //todos
    //"/usuarios/login": "", //todos
   // "/usuarios/getPerfil": "", //todos
   // "/usuarios/getId/:id": "", //todos
    //"/usuarios/getUsername/:userName": "", //todos
   // "/usuarios/cambiarPassword": "", //todos
   // "/usuarios/getJuegotekas": "", //todos
   // "/usuarios/getJugadores": "", //todos
   //Tienen los dos siguientes: isNotAdmin 
   //"/usuarios/misJuegos": "", //juegoteka,jugador
   // "/usuarios/misJuegos/:idJuego": "", //juegoteka,jugador



    // RUTAS DE jornadaRoutes.js
    //"/jornadas/": "", //todos
    //"/jornadas/:id": "", //todos
    //"/jornadas/create": "", //juegoteka NO ADMIN
    "/jornadas/edit/:id": "juegoteka", //juegoteka - ADMIN
   // "/jornadas/updateEncuentros/:id": "", //jugador, juegoteka NO ADMIN
    //"/jornadas/inscripcion/:id": "", //jugador NO ADMIN
    "/jornadas/updateEstado/:id": "juegoteka", //juegoteka - ADMIN

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