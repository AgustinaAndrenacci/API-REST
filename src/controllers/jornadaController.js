// src/controllers/usuarioController.js

//CAMBIAR LO DE LOS ERRORES!!!!

/*
const Jornada = require("../models/jornadaModel");

exports.getAllJornadas = (req, res) => {
  res.json(Jornada.getAll());
};

exports.getJornadaById = (req, res) => {
  const id = parseInt(req.params.id);
  const jornada = Jornada.getById(id); //lo trae del modelo
  jornada //ternario IF
    ? res.json(jornada) //true
    : res.status(404).json({ error: "Jornada no encontrada" }); //false
};

exports.createJornada = (req, res) => {
  const { nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles } = req.body;
  !nombre || !fechaHora || !precioInscripcion || !capacidad || !Juegoteka || !juegosDisponibles
    ? res.status(400).json({ error: "Faltan campos obligatorios" }) //false
    : res.status(201).json(Jornada.create({ nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles })); //true
};

exports.updateJornada = (req, res) => {
  const id = parseInt(req.params.id);
  const actualizada = Jornada.update(id, req.body);
  actualizada
    ? res.json(actualizada) //true
    : res.status(404).json({ error: "Jornada no encontrada" }); //false
};

exports.deleteJornada = (req, res) => {
  const id = parseInt(req.params.id);
  const eliminada = Jornada.remove(id);
  eliminada
    ? res.json({ message: "Jornada eliminada" }) //true
    : res.status(404).json({ error: "Jornada no encontrada" }); //false
};

*/



const Jornada = require("../models/jornadaModel");
const Usuario = require('../models/usuarioModel');
const encuentro = require("./encuentroController");
const usuario = require("./usuarioController");

exports.getAllJornadas = async (req, res) => {
  try {
    const jornadas = await Jornada.find();
    res.json(jornadas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener jornadas" });
  }
};

exports.getJornadaById = async (req, res) => {
  try {
    const jornada = await Jornada.findById(req.params.id);
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
      const juegosDisponibles = await Usuario.findById(id).select('misJuegos').lean();

      const nuevaJornada = new Jornada({ nombre, fechaHora, precioInscripcion, capacidad, Juegoteka, juegosDisponibles });
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
    const jornadaActualizada = await Jornada.findByIdAndUpdate(req.params.id, req.body, { new: true });
    jornadaActualizada
      ? res.json(jornadaActualizada) //true
      : res.status(404).json({ error: "Jornada no encontrada" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
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
      encuentros.createdBy = req.user.id; //json
      
      //const encuentroConId = await encuentroService.create(encuentros);
      
      //añadir encuentroConId a la jornada

      const encuentrosConId = await crearEncuentrosPorJornada(encuentros);
      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { $push: { encuentros: encuentrosConId } }, { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

//Un jugador se inscribe en la jornada, no un conjunto
exports.updateJornadaJugador = async (req, res) => {
  try {
      const idJornada = req.params.id; // Usar el ID de la URL
      const idJugador = req.user.id; // Usar el ID del token 

      const datosJugador = await usuario.findUserForJornada(idJugador);

      //push: actualiza y no pisa
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
              {// Se agrega el objeto de jugador directamente, no dentro de un array
              $push: { 
                  jugadoresInscriptos: {
                      id: idJugador,
                      userName: datosJugador.userName,
                      nombre: datosJugador.nombre,
                      apellido: datosJugador.apellido
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

//viejo
exports.updateJornadaJugadores = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { jugadorInscripto } = req.body;
    if (!jugadorInscripto) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{//push: actualiza y no pisa
      //verifico que la cantidad de jugadores no supere la capacidad
      const jornada = await Jornada.findById(id);
      if (jornada) {
        const cantidadJugadores = jornada.jugadoresInscriptos.length;
        if (cantidadJugadores + 1 > jornada.capacidad) {
          res.status(400).json({ error: "Capacidad máxima superada" });
        }
        else{
          const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { $push: { jugadoresInscriptos: jugadorInscripto } }, { new: true, runValidators: true });
          res.json(jornadaActualizada) //true
          }
      }
      else{
        res.status(404).json({ error: "Jornada no encontrada" }); //false
      }

    }
    

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};
/*
exports.updateJornadaJuegos = async (req, res) => {
  try {
    //directamente carga todos los de misJuegos
    const id = req.params.id; // Usar el ID de la URL
    const juegosDisponibles = await usuarioController.getMisJuegos();
    if (!juegosDisponibles) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{//push: actualiza y no pisa   

      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { $push: { juegosDisponibles } }, { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};*/

//reformular

exports.updateJornadaEstado = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const { estado } = req.body;
    if (!estado) {
      res.status(400).json({ error: "Falta ingresar el estado" });
    }
    else{
      const jornadaActualizada = await Jornada.findByIdAndUpdate(id, { estado } , { new: true, runValidators: true });
      jornadaActualizada
        ? res.json(jornadaActualizada) //true
        : res.status(404).json({ error: "Jornada no encontrada" }); //false

    }

    } catch (err) {
    res.status(500).json({ error: "Error al actualizar jornada" });
  }
};

exports.deleteJornada = async (req, res) => {
  try {
    const jornadaEliminada = await Jornada.findByIdAndDelete(req.params.id);
    if(jornadaEliminada){
      res.json({ message: "Jornada eliminada", jornadaEliminada }); //true
      //borrar todos los encuentros asociados a la jornada
      eliminarEncuentrosPorJornada(jornadaEliminada);
    }
    else{
      res.status(404).json({ error: "Jornada no encontrada" }); //false
    }
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar jornada" });
  }
};

exports.countJugadoresEnJornada = async (req, res) => {
  try {
    const id = req.params.id; // Usar el ID de la URL
    const jornada = await Jornada.findById(id);
    if (!jornada) {
      res.status(404).json({ error: "Jornada no encontrada" });
    }
    else{
      const cantidadJugadores = jornada.jugadoresInscriptos.length;
      //res.json({ cantidadJugadores });
    }
    return cantidadJugadores;
  } catch (err) {
    res.status(500).json({ error: "Error al contar jugadores en la jornada" });
  }
};

exports.eliminarEncuentrosPorJornada = async (jornadaEliminada) => {
  try {
        jornadaEliminada.encuentros.forEach(async (encuentroId) => {
        await encuentro.deleteEncuentro(encuentroId);
      });
  } catch (err) {
    console.error(err);
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

exports.validarJugadoresInscriptos = async (jugadoresInscriptos) => {
  try {
    logConsole("Validando jugadores inscriptos:");
    const jugadoresExistentes = await Usuario.find({ userName: { $in: jugadoresInscriptos } });
    const jugadoresNoExistentes = jugadoresInscriptos.filter(userName => !jugadoresExistentes.some(usuario => usuario.userName === userName));
    return jugadoresNoExistentes;
  } catch (err) {
    console.error(err);
  }
};
