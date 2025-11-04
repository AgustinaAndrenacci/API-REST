const Jornada = require("../models/jornadaModel");
const Encuentro = require("../models/encuentroModel");
const encuentroService = require("./encuentroService");

//chequeo si mi id es del de la jornada
const esMiJornada = (jornadaExistente, idUsuario) => {
  return jornadaExistente.Juegoteka.id.toString() === idUsuario.toString();
};

const validarJornada = (jornadaExistente, body) => {

  const nuevaCapacidad = body.capacidad;

  // Solo valida si la capacidad está presente en el body
  if (nuevaCapacidad !== undefined) {
    const jugadoresActuales = jornadaExistente.jugadoresInscriptos.length;

    if (jugadoresActuales > nuevaCapacidad) {
      // Usar un Error de JavaScript estándar para indicar el fallo
      const errorMessage = `La capacidad (${nuevaCapacidad}) no puede ser menor a los ${jugadoresActuales} jugadores ya inscriptos.`;
      throw new Error(errorMessage);
    }
  }
  return body;
};

//getAll
const getAllJornadas = async () => {
  try {
    const jornadas = await Jornada.find();
    return jornadas;
  } catch (error) {
    throw new Error("Error al obtener todas las jornadas");
  }
};

//getByID
const getJornadaById = async (id) => {
  try {
    const jornada = await Jornada.findById(id);
    return jornada;
  } catch (error) {
    throw new Error("Error al obtener jornada");
  }
};

//getByID
const getJornadaByIdAndEncuentrosCompletos = async (id) => {
  try {
    const jornada = await Jornada.findById(id).populate("encuentros");
    return jornada;
  } catch (error) {
    throw new Error("Error al obtener jornada");
  }
};

//update
const updateJornada = async (id, data) => {
  try {
    const jornadaActualizada = await Jornada.findByIdAndUpdate(id, data, { new: true });
    return jornadaActualizada;
  } catch (error) {
    throw new Error("Error al actualizar jornada");
  }
};

//chequea si el estado de la jornada es cancelado
const esEstadoCancelado = (jornada) => {
  //const jornada = getJornadaById(id);
  return jornada.estado === "cancelado";
 };

//Estado:cancelado -> se eliminan todos los encuentros
const eliminarEncuentrosDeJornada = async (idJornada) => {
    try {
        //busco la jornada
        let jornadaActualizada = await getJornadaById(idJornada); 

        //si hay encuentros, los borra
        if (jornadaActualizada && jornadaActualizada.encuentros.length > 0) {

            // Extraer solo los IDs de encuentro
            const idsEncuentros = jornadaActualizada.encuentros.map(e => e._id || e);
            
            //borro de forma masiva - elimino todos los Encuentros cuyo _id esté en el array idsEncuentros
            const resultadoDelete = await Encuentro.deleteMany({ 
                _id: { $in: idsEncuentros } 
            });
            
            // 3. Limpiar el array de referencias en la Jornada (con [] porque con push, map, daba error)
            await Jornada.updateOne(
                { _id: idJornada }, 
                { $set: { encuentros: [] } } 
            );

        }
        
        return jornadaActualizada; // Retorna la jornada
        
    } catch (error) {
        throw new Error(`Error al eliminar encuentros para la jornada ${idJornada}: ${error.message}`);
    }
};

//borrarEncuentroDeJornada
const borrarEncuentroDeJornada = async (idJornada, idEncuentro) => {
  try {
    const jornadaActualizada = await updateJornada(
      idJornada,
      { 
        $pull: { 
          encuentros: { _id: idEncuentro }
        } 
      },
      { new: true }
    );
    
    return jornadaActualizada;
    
  } catch (error) {
    console.error("Error detallado al borrar encuentro de jornada:", error);
    throw new Error("Error al borrar encuentro de jornada");
  }
};

//create
const createJornada = async (data) => {
  try {
    const nuevaJornada = new Jornada(data);
    await nuevaJornada.save();
    return nuevaJornada;
  } catch (error) {
    throw new Error("Error al crear jornada");
  }
};

const estadosValidos = async (estado) => {
  try {
    const estadosValidos = Jornada.schema.paths.estado.options.enum;
    return (estadosValidos.includes(estado));
    //includes: verifica si el estado recibido está en la lista de estados válidos
  } catch (error) {
    throw new Error("Error al validar estados");
  }
};
/*
exports.validarJugadoresInscriptos = async (jugadoresInscriptos) => {
  try {
    logConsole("Validando jugadores inscriptos:");
    const jugadoresExistentes = await Usuario.find({ userName: { $in: jugadoresInscriptos } });
    const jugadoresNoExistentes = jugadoresInscriptos.filter(userName => !jugadoresExistentes.some(usuario => usuario.userName === userName));
    return jugadoresNoExistentes;
  } catch (err) {
    console.error(err);
  }
};*/

const tieneEstadoActivo = async (id) => {
  try {
    const jornada = await getJornadaById(id);
    return jornada.estado === "activo";
  } catch (error) {
    throw new Error("Error al verificar estado de jornada");
  }
};


const modificaDatosEnJornadaActiva = async (user) => {
  try {
    const resultado = await Jornada.updateMany(
      { estado: "activo", "Juegoteka.id": user.id },
      { $set: { "Juegoteka.nombre": user.nombre, "Juegoteka.direccion": user.direccion } }
    );
    
  } catch (error) {
    throw error;
  }
}



const crearEncuentrosPorJornada = async (encuentroData,jornadaId,req) => {

  
  encuentroData.createdBy = [{
    id_usuario: req.user.id,
    userName: req.user.userName,
    tipo: req.user.rol
   }];
 
   encuentroData.jornada = jornadaId;
   let tipoPorRol;

   if(req.user.rol=="jugador") 
    {
      tipoPorRol="desafío"
   }else if (req.user.rol==="juegoteka")
    {
      tipoPorRol="torneo"
   }
   encuentroData.tipo=tipoPorRol;

  try {
    const encuentroCreado = await encuentroService.create(encuentroData);
    //console.log("Encuentro creado:", encuentroCreado._id);
    return encuentroCreado; // retorna el objeto completo
  } catch (err) {
    console.error(" Error en crearEncuentrosPorJornada:", err.message);
    throw err;
  }
};

module.exports = {
  validarJornada,
  getAllJornadas,
  getJornadaById,
  updateJornada,
  createJornada,
  estadosValidos,
  borrarEncuentroDeJornada,
  tieneEstadoActivo,
  eliminarEncuentrosDeJornada,
  esEstadoCancelado,
  getJornadaByIdAndEncuentrosCompletos,
  modificaDatosEnJornadaActiva,
  crearEncuentrosPorJornada,
  esMiJornada
};
