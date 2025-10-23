const Jornada = require("../models/jornadaModel");
const Usuario = require('../models/usuarioModel');
const jornadaService = require("../services/jornadaService");
const encuentro = require("./encuentroController");
const usuario = require("./usuarioController");
const encuentroService = require('../services/encuentroService');
const usuarioService = require('../services/usuarioService');

exports.getAllJornadas = async (req, res) => {
  try {
    const jornadas = await jornadaService.getAllJornadas();
    res.json(jornadas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener jornadas" });
  }
};

exports.getJornadaById = async (req, res) => {
  try {
    const jornada = await jornadaService.getJornadaById(req.params.id);
    jornada
      ? res.json(jornada) //true
      : res.status(404).json({ error: "Jornada no encontrada" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al buscar jornada" });
  }
};

exports.createJornada = async (req, res) => {
  try {
    //ID del usuario por el token
    const id = req.user.id;
    const { nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles } = req.body;
    
    if (!nombre || !fechaHora || !precioInscripcion || !capacidad || !Juegoteka || !juegosDisponibles) {
      res.status(400).json({ error: "Faltan campos obligatorios" }); //false
    }
    else{
      //Guardo en juegosDisponibles lo que tiene la jornada en Usuario.misJuegos
      // Usamos .lean() para obtener un objeto JS simple y luego accedemos a la propiedad misJuegos.
      const user = await usuarioService.getUsuarioById(id);
      const juegosDisponibles = user.misJuegos;
      //en juegosDisponibles viene con _id y en jornada lo guardo con id
      const juegosParaGuardar = juegosDisponibles.map(juego => ({
        //_id: juego._id,
        id: juego._id,
        titulo: juego.titulo,
        imagen: juego.imagen
      }));
      const nuevaJornada = new Jornada({ nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles: juegosParaGuardar });
      await nuevaJornada.save();
      res.status(201).json({ id: nuevaJornada.id, nuevaJornada }); //true
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear jornada" });
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
      res.status(404).json({ error: "Jornada no encontrada" });
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
    }
    } catch (err) {
      //no hay otra forma?

      // 6. Manejo de Errores: Verifica si es un error de validación (código 400)
      // Se asume que cualquier error lanzado desde validarJornada es un 400
    /*  if (err.message.includes('capacidad no puede ser menor')) {
        return res.status(400).json({ error: err.message });
      }*/

    // Para cualquier otro error (Mongoose, servidor, etc.)
    console.error("Error detallado al actualizar jornada:", err);
    return res.status(500).json({ error: "Error al actualizar jornada", detalle: err.message });
  }
};

exports.updateJornadaEncuentros = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { encuentros } = req.body; //uno solo
    if (!encuentros) { 
      res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{//push: actualiza y no pisa
      //crear el encuentro en la bd
      //json encuentros

      //añado el createdBy en encuentros
      const encuentroConId = await encuentroService.create({encuentros});

      //validar que se ingresaron todos los datos

      //añadir encuentroConId a la jornada
      //const encuentrosConId = await crearEncuentrosPorJornada(encuentros);
      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { $push: { encuentros: encuentrosConId } }, { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

//El jugador logueado se inscribe en la jornada, no un conjunto
exports.updateJornadaJugador = async (req, res) => {
  try {
      const idJornada = req.params.id; // Usar el ID de la URL
      const idJugador = req.user.id; // Usar el ID del token 

      const user = await usuarioService.getUsuarioById(idJugador);

      //push: actualiza y no pisa
      //busca la jornada
      const jornada = await Jornada.findById(idJornada);
      
      if (jornada) {
        //verifico que el usuario no este anotado
        const usuarioYaAnotado = jornada.jugadoresInscriptos.find(jugador => String(jugador.id) === String(idJugador));
        
        if (usuarioYaAnotado) {
          res.status(400).json({ error: "El jugador ya está anotado en la jornada" });
        }else{
          //verifico que la cantidad de jugadores no supere la capacidad
          const cantidadJugadores = jornada.jugadoresInscriptos.length;

          if (cantidadJugadores + 1 > jornada.capacidad) {
            res.status(400).json({ error: "Capacidad máxima superada" });
          }
          else{
            const jornadaActualizada = await Jornada.findByIdAndUpdate(
              idJornada, 
              {
              $push: { 
                  jugadoresInscriptos: {
                      id: idJugador,
                      userName: user.userName,
                      nombre: user.nombre,
                      apellido: user.apellido
                  } 
              } 
              }, { new: true, runValidators: true });
            res.json(jornadaActualizada) //true
            }
      }}
      else{
        res.status(404).json({ error: "Jornada no encontrada" }); //false
      }
    } catch (err) {
    
        console.error("Error detallado al actualizar jornada:", err); 
        res.status(500).json({ error: "Error al actualizar jornada" });
        }
};

exports.updateJornadaEstado = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { estado } = req.body; //nuevo estado

    if (!estado) {
      res.status(400).json({ error: "Falta ingresar el estado" });
    }
    else{
      //verifico que el estado sea una de las opciones del enum que se encuentra en jornadaModel
      const estadosValidos = await jornadaService.estadosValidos(estado);

      if (!estadosValidos) {
        res.status(400).json({ error: "El estado ingresado es inválido"});
      }else{
      const jornadaActualizada = await jornadaService.updateJornada(id, {estado});
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false
    }}

    } catch (err) {
      console.error("Error detallado al actualizar jornada:", err);
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

exports.crearEncuentrosPorJornada = async (encuentroJson) => {
  //me falta el id que se crea una vez en createEncuentro
  try {
      encuentroJson.forEach(async (encuentroData) => {
      const encuentroConId = await encuentro.createEncuentro(encuentroData);
      //crear un vector con encuentroConId
      encuentrosConId.push(encuentroConId);

      return encuentrosConId;
    });
  } catch (err) {
    console.error(err);
  }
};


