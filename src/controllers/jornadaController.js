const Jornada = require("../models/jornadaModel");
const Usuario = require('../models/usuarioModel');
const jornadaService = require("../services/jornadaService");
const encuentro = require("./encuentroController");
const usuario = require("./usuarioController");
const encuentroService = require('../services/encuentroService');
const usuarioService = require('../services/usuarioService');
const { showErrorMessage } = require("../errorHandler"); //F:agrego require para mostrar errores por showErrMsj


exports.getAllJornadas = async (req, res) => {
  try {
    const jornadas = await jornadaService.getAllJornadas();
    res.json(jornadas);
  } catch (err) {
    showErrorMessage(res, 500, "Error al obtener jornadas");
  }
};

exports.getJornadaById = async (req, res) => {
  try {
    const jornada = await jornadaService.getJornadaByIdAndEncuentrosCompletos(req.params.id);
    //const jornada = await jornadaService.getJornadaById(req.params.id);
    jornada
      ? res.json(jornada) //true
      : showErrorMessage(res, 404, "Jornada no encontrada"); //false
  } catch (err) {
    showErrorMessage(res, 500, "Error al buscar jornada");
  }
};

exports.createJornada = async (req, res) => {
  try {
    //ID del usuario por el token
    const id = req.user.id;
    const { nombre, fechaHora, precioInscripcion, capacidad, juegosDisponibles } = req.body;
    
    //const { nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles } = req.body;
    
    if (!nombre || !fechaHora || !precioInscripcion || !capacidad || !juegosDisponibles) {
     
    //if (!nombre || !fechaHora || !precioInscripcion || !capacidad || !Juegoteka || !juegosDisponibles) {
      showErrorMessage(res, 400, "Faltan campos obligatorios");
    }
    else{
      //Guardo en juegosDisponibles lo que tiene la jornada en Usuario.misJuegos
      // Usamos .lean() para obtener un objeto JS simple y luego accedemos a la propiedad misJuegos.
      const user = await usuarioService.getUsuarioById(id);
      const juegosDisponibles = user.misJuegos;

      //chequeo que los juegos disponibles no estén vacíos
      const hayJuegosDisponibles = await usuarioService.hayJuegos(juegosDisponibles);
      if (!hayJuegosDisponibles) {
        showErrorMessage(res, 400, "El usuario no tiene juegos disponibles, es necesario tener minimo un juego para armar una jornada");
      }else{

      //en juegosDisponibles viene con _id y en jornada lo guardo con id
      const juegosParaGuardar = juegosDisponibles.map(juego => ({
        //_id: juego._id,
        id: juego._id,
        titulo: juego.titulo,
        imagen: juego.imagen
      }));

      //creo el json de juegoteka
      const Juegoteka = usuarioService.formatoJsonJuegoteka(user);
      
      const nuevaJornada = new Jornada({ nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles: juegosParaGuardar });
      await nuevaJornada.save();
      res.status(200).json({ id: nuevaJornada.id, nuevaJornada }); //true
    }}
    
  } catch (err) {
    console.error(err);
    showErrorMessage(res, 500, "Error al crear jornada");
  }
};

exports.updateJornada = async (req, res) => {
  try {
    const { id } = req.params; //id de la jornada
    const bodyJson = req.body; //body a modificar
    //encuentros no
    delete bodyJson.encuentros;

    const jornadaExistente = await jornadaService.getJornadaById(id);
    
    if (!jornadaExistente) {
      showErrorMessage(res, 404, "Jornada no encontrada");
    }else{
      //Si el estado es "Activo" se puede modificar, sino no
      const tieneEstadoActivo = await jornadaService.tieneEstadoActivo(id);
      if (!tieneEstadoActivo) {
        showErrorMessage(res, 400, "La jornada no se puede modificar debido a que se encuentra cancelada o finalizada");
      }else{

      //chequea la capacidad
      const datosParaActualizar = jornadaService.validarJornada(jornadaExistente, bodyJson);
    
      // actualizar
      const jornadaActualizada = await jornadaService.updateJornada(
        id, 
        datosParaActualizar, 
        { new: true, runValidators: true }
      );
      
      res.json(jornadaActualizada);
    }}
    } catch (err) {

    // Para cualquier otro error (Mongoose, servidor, etc.)
    console.error("Error detallado al actualizar jornada:", err);
    showErrorMessage(res, 500, "Error al actualizar jornada");
  }
};

exports.updateJornadaEncuentros = async (req, res) => {
  try {
    const idJornada = req.params.id;
    const encuentroData = req.body;
    const { tipo,capacidad,juego} = req.body;

    if (!capacidad || !juego ) {
      showErrorMessage(res, 400, "Faltan campos obligatorios");
    }else{

    //1) Chequea si existe la jornada
    const jornadaExistente = await jornadaService.getJornadaById(idJornada);
    if (!jornadaExistente) {
      showErrorMessage(res, 404, "La jornada no existe");
    } else {
      //2) Si el estado es "Activo" se puede modificar, sino no
      const tieneEstadoActivo = await jornadaService.tieneEstadoActivo(idJornada);
      if (!tieneEstadoActivo) {
        showErrorMessage(res, 400, "La jornada no se puede modificar debido a que se encuentra cancelada o finalizada");
      }else{
        //Crear el encuentro
        const jornadaId = req.params.id;
        const encuentroCreado = await jornadaService.crearEncuentrosPorJornada(encuentroData, jornadaId, req);

        //Agregar el encuentro a la jornada
        const jornadaActualizada = await Jornada.findByIdAndUpdate(
          idJornada,
          { $push: { encuentros: encuentroCreado._id } }, // solo guardamos el id
          { new: true, runValidators: true }
        );

        //console.log(encuentroCreado);
        res.json(jornadaActualizada);
      }}
    }
  } catch (err) {
    //console.error("Error al actualizar jornada:", err.message);
    showErrorMessage(res, 500, err.message || "Error al actualizar jornada :)");
  }
};
///////////////////////////////////////////////////////////////////////////////////////////


//El jugador logueado se inscribe en la jornada, no un conjunto
exports.updateJornadaJugador = async (req, res) => {
  try {
      const idJornada = req.params.id; // Usar el ID de la URL
      const idJugador = req.user.id; // Usar el ID del token 
      const user = await usuarioService.getUsuarioById(idJugador);

      //busca la jornada
      const jornada = await Jornada.findById(idJornada);
      
      if (jornada) {
        //verifico que el usuario no este anotado

        //Si el estado es "Activo" se puede modificar, sino no
        const tieneEstadoActivo = await jornadaService.tieneEstadoActivo(idJornada);
        if (!tieneEstadoActivo) {
          showErrorMessage(res, 400, "La jornada no se puede modificar debido a que se encuentra cancelada o finalizada");
        }else{
        const usuarioYaAnotado = jornada.jugadoresInscriptos.find(jugador => String(jugador.id) === String(idJugador));
        
        if (usuarioYaAnotado) {
          showErrorMessage(res, 400, "El jugador ya está anotado en la jornada");
        }else{
            //verifico que la cantidad de jugadores no supere la capacidad
            const cantidadJugadores = jornada.jugadoresInscriptos.length;

            if (cantidadJugadores + 1 > jornada.capacidad) {
              showErrorMessage(res, 400, "Capacidad máxima superada");
            }
            else{
              const jornadaActualizada = await Jornada.findByIdAndUpdate(
                idJornada, 
                {
                $push: { 
                    jugadoresInscriptos: {
                        id: idJugador,
                        userName: user.userName,
                        //nombre: user.nombre,
                       // apellido: user.apellido
                    } 
                } 
                }, { new: true, runValidators: true });
              res.json(jornadaActualizada) //true
              }
      }}} else{
        showErrorMessage(res, 404, "Jornada no encontrada");
      }
    } catch (err) {

        console.error("Error detallado al actualizar jornada:", err);
        showErrorMessage(res, 500, "Error al actualizar jornada");
        }
};

exports.updateJornadaEstado = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { estado } = req.body; //nuevo estado

    if (!estado) {
      showErrorMessage(res, 400, "Falta ingresar el estado");
    }
    else{
      //verifico que el estado sea una de las opciones del enum que se encuentra en jornadaModel
      const estadosValidos = await jornadaService.estadosValidos(estado);
      if (!estadosValidos) {
        showErrorMessage(res, 400, "El estado ingresado es inválido");
      }else{
      //jornada existe?
      const jornadaExistente = await jornadaService.getJornadaById(id);
      if (!jornadaExistente) {
        showErrorMessage(res, 404, "Jornada no encontrada");
      } else {
        //Si el estado es "Activo" se puede modificar, sino no
        const tieneEstadoActivo = await jornadaService.tieneEstadoActivo(id);
        if (!tieneEstadoActivo) {
          showErrorMessage(res, 400, "La jornada no se puede modificar debido a que se encuentra cancelada o finalizada");
        }else{
            //update
            //DESCOMENTAR
            //const jornadaActualizada = await jornadaService.updateJornada(id, {estado});
            let jornadaActualizada = await jornadaService.updateJornada(id, {estado});
            
            //si se coloco cancelado, se eliminan los encuentros
            if (jornadaActualizada.estado === "cancelado") {
            jornadaActualizada = await jornadaService.eliminarEncuentrosDeJornada(id);
            console.log("Se eliminaron los encuentros de la jornada:", jornadaActualizada);
            }
            console.log("Jornada actualizada:", jornadaActualizada);
            res.json(jornadaActualizada) 
    }}}}}
    catch (err) {
      console.error("Error detallado al actualizar jornada:", err);
      showErrorMessage(res, 500, "Error al actualizar jornada");
  }
};

