/**
 * services/encuentroService.js
 *
 * Capa de lógica de negocio para Encuentro.
 *
 * Responsabilidades:
 *  - CRUD sobre Encuentro (create, get, update, delete)
 *  - Validaciones estrictas:
 *      * verificar existencia de jugadores (Usuario)
 *      * verificar existencia de juego (Juego)
 *      * verificar capacidad disponible
 *      * verificar existencia de encuentro antes de operar
 *  - Métodos de consulta adicionales:
 *      * getByCreador, getByGanador, getByJuego, getByEstado, getByJugador
 *  - deleteByJornada: método pensado para uso interno por otros services (p. ej. Jornada).
 *
 * Notas: 
 */

const mongoose = require("mongoose");
const Encuentro = require("../models/encuentroModel");
const Mensaje = require('../models/mensajeModel');
const Jornada = require("../models/jornadaModel");
const Usuario = require("../models/usuarioModel");
const Juego = require("../models/juegoModel");
const { crearMensaje } = require("./mensajeService");

/////////////////////////////////////////////////////////////////////////////////////
/**
 * Consultas públicas : GET,CREATE; UDATE; DELETE
 */
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * getAll - retorna encuentros según filtro.
 * @param {Object} filtro - objeto de filtro (ej: { tipo: 'torneo' })
 */
async function getAll(filtro = {}) {
  //Ejemplo de operador spread (...) copia todas las propiedades de filtro dentro de un nuevo objeto:
  //Si luego modificás safeFilter, no afecta al objeto original filtro.
  //Esto es lo que se llama una copia superficial (shallow copy).
  // Seguridad: no permitir filtros peligrosos por defecto (se asume uso interno / controller)
  const safeFilter = { ...filtro };
  
  const data = await Encuentro.find(safeFilter).lean();
  return data;
}

async function getById(id) {
     return await getEncuentroOrThrow(id);
   

}

/**
 * getByCreador - devuelve encuentros donde createdBy contiene al usuario (idUsuario).
 * Asume que en el modelo createdBy es un array de organizadores con campo id_usuario.
 */
async function getByCreador(idUsuario) {
  if (!idUsuario) throw new Error("getByCreador: idUsuario requerido.");
  const data = await Encuentro.find({ "createdBy.id_usuario": idUsuario }).lean();
  return data;
}

/**
 * getByGanador - devuelve encuentros donde ganador.id_jugador === idUsuario
 */
async function getByGanador(idUsuario) {
  if (!idUsuario) throw new Error("getByGanador: idUsuario requerido.");
  const data = await Encuentro.find({ "ganador.id_jugador": idUsuario }).lean();
  return data;
}

/**
 * getByJuego - devuelve encuentros por juego.id_juego o por juego._id
 */
async function getByJuego(idJuego) {
  if (!idJuego) throw new Error("getByJuego: idJuego requerido.");
  const data = await Encuentro.find({
    "juego.id_juego": idJuego  
  }).lean();
    return data;
}

/**
 * getByEstado - devuelve encuentros por campo estado
 */
async function getByEstado(estado) {
  if (!estado) throw new Error("getByEstado: estado requerido.");
  const data = await Encuentro.find({ estado }).lean();
  return data;
}

/**
 * getByJugador - devuelve encuentros donde jugadores array contiene idJugador
 * Se busca en jugadores.id_jugador y en jugadores (por si se guardó el _id directamente)
 */
async function getByJugador(idJugador) {
  if (!idJugador) throw new Error("getByJugador: idJugador requerido.");

  const data = await Encuentro.find({
    "jugadores.id_jugador": idJugador
  }).lean();

  return data;
}


/**
 * CREATE-->Crear un nuevo encuentro.
 * Validaciones estrictas: jugadores, juego, capacidad.
 *
 * @param {Object} payload - objeto con campos para crear el encuentro (debe coincidir con el schema)
 */
async function create(payload) {
  if (!payload) throw new Error("create: payload requerido.");
console.log("111");
  // Validar jugadores
  if (payload.jugadores && Array.isArray(payload.jugadores) && payload.jugadores.length > 0) {
    const ids = payload.jugadores.map((j) => j.id_jugador || j._id || j);
    await verificarJugadoresExistentes(ids);
  }

  // Validar juego
  if (payload.juego) {
    // Soportar array o un solo objeto
let juegoId;
let juegoInfo;

if (Array.isArray(payload.juego) && payload.juego.length > 0) {
  juegoId = payload.juego[0].id_juego || payload.juego[0]._id;
  juegoInfo = {
    nombre: payload.juego[0].nombre,
    imagen: payload.juego[0].imagen,
  };
} else if (typeof payload.juego === "object" && (payload.juego.id_juego || payload.juego._id)) {
  juegoId = payload.juego.id_juego || payload.juego._id;
  juegoInfo = {
    nombre: payload.juego.nombre,
    imagen: payload.juego.imagen,
  };
} else if (typeof payload.juego === "string") {
  juegoId = payload.juego;
  // Buscar en la BD para traer nombre e imagen
  const juegoBD = await Juego.findById(juegoId).lean();
  if (!juegoBD) throw new Error("Juego no encontrado");
  juegoInfo = {
    nombre: juegoBD.titulo,
    imagen: juegoBD.imagen,
  };
} else {
  throw new Error("Juego inválido");
}
    ////
        if (!mongoose.isValidObjectId(juegoId)) throw new Error("ID de juego inválido");
    await verificarJuegoExistente(juegoId);

    // Sobrescribimos payload.juego para que Mongoose lo entienda
    payload.juego = {
      id_juego: juegoId,
      ...juegoInfo,
    };
  }

  // Validar capacidad
  if (typeof payload.capacidad === "number") {
    const cantidadJugadores = payload.jugadores ? payload.jugadores.length : 0;
    verificarCapacidadDisponible(payload.capacidad, cantidadJugadores);
  }

  // Crear y devolver
  const nuevo = new Encuentro(payload);
  const saved = await nuevo.save();
  return saved.toObject();
}


/**
 * UPDATE - actualiza un encuentro con validaciones estrictas.
 * - id: id del encuentro a actualizar
 * - updates: objeto con campos a modificar (p. ej. jugadores, juego, capacidad, estado)
 */

async function update(id, updates = {}) {

  // 1 Obtener encuentro existente
  let encuentro = await Encuentro.findById(id).populate('jornada');
  console.log(encuentro);
  if (!encuentro) throw new Error(`Encuentro no encontrado: ${id}`);

  //  Verificar si la jornada está cerrada
  if (encuentro.jornada?.estado === 'cancelado' || encuentro.jornada?.estado === 'finalizado') {
    throw new Error('La jornada está cerrada, no se puede modificar el encuentro');
  }

  //  Actualizar jugadores si vienen en updates
  if (Array.isArray(updates.jugadores) && updates.jugadores.length > 0) 
    {
      await updateJugadores(id, updates);
    }
    // Crear un mapa de jugadores actuales por ID para acceso rápido
  /*  {
    const jugadoresMap = new Map();
    encuentro.jugadores.forEach(j => jugadoresMap.set(j.id_jugador.toString(), j));

    const nuevosJugadoresIds = [];

    // Procesar cada jugador enviado en updates
    for (const jBody of updates.jugadores) {
      const idJugadorStr = jBody.id_jugador?.toString();
      if (!idJugadorStr) continue;

      if (jugadoresMap.has(idJugadorStr)) {
        // Si ya existe, actualizar estado si viene
        if (jBody.estado) jugadoresMap.get(idJugadorStr).estado = jBody.estado;
      } else {
        // Nuevo jugador, agregar con estado por defecto 'pendiente' si no viene
        const nuevoJugador = {
          id_jugador: new mongoose.Types.ObjectId(idJugadorStr),
          estado: jBody.estado || 'pendiente'
        };
        encuentro.jugadores.push(nuevoJugador);
        nuevosJugadoresIds.push(idJugadorStr);
      }
    }

    // Validaciones: jugadores existentes y capacidad
    await verificarJugadoresExistentes(encuentro.jugadores.map(j => j.id_jugador));
    await verificarNoRepetidosEnEncuentro(id, encuentro.jugadores);

    const idJornada = encuentro.jornada._id;
    await verificarJugadoresEnJornada(idJornada, nuevosJugadoresIds, id);

    const capacidadFinal = typeof updates.capacidad === "number" ? updates.capacidad : encuentro.capacidad;
    if (encuentro.jugadores.length > capacidadFinal) {
      throw new Error(`La cantidad de jugadores supera la capacidad (${capacidadFinal})`);
    }

    // Enviar mensajes a los nuevos jugadores
    const creadorNombre = encuentro.createdBy[0]?.userName || "El creador";
    const nombreJuego = encuentro.juego[0]?.nombre || "el encuentro";
    const creadorId = new mongoose.Types.ObjectId(encuentro.createdBy[0].idUsuario);

    for (const jugadorId of nuevosJugadoresIds) {
      const mensajeData = {
        remitente: creadorId,
        destinatario: new mongoose.Types.ObjectId(jugadorId),
        contenido: `Has sido desafiado por ${creadorNombre} en ${nombreJuego}`,
        tipo: "notificacionEncuentro",
      };
      await crearMensaje(mensajeData);
    }
  }
*/
  //  Actualizar juego si viene
  if (updates.juego) {
    const idJuego = updates.juego.id_juego || updates.juego._id || updates.juego;
    if (idJuego) await verificarJuegoExistente(idJuego);
    encuentro.juego = idJuego;
  }

  //  Actualizar capacidad si viene
  if (typeof updates.capacidad === "number") {
    const cantidadActual = encuentro.jugadores.length;
    if (updates.capacidad < cantidadActual) {
      throw new Error(`La capacidad no puede ser menor a la cantidad actual de jugadores (${cantidadActual})`);
    }
    encuentro.capacidad = updates.capacidad;
  }

  //  Actualizar otros campos simples
  const camposSimples = ['nombre', 'fecha', 'estado']; // ejemplo
  for (const campo of camposSimples) {
    if (updates[campo] !== undefined) encuentro[campo] = updates[campo];
  }

  //  Guardar cambios
  const updated = await encuentro.save();
  return updated.toObject();
}

/**
 * UPDATE JUGADORES- actualiza exclusivametne los jugadores de un encuentro 
 * - id: id del encuentro a actualizar
 * - updates: objeto con campos a modificar (jugadores)
 */

async function updateJugadores(id, updates = {}) {
  
  // 1 Obtener el encuentro existente
  let encuentro = await Encuentro.findById(id).populate('jornada');
  if (!encuentro) throw new Error(`Encuentro no encontrado: ${id}`);

  // 2 Verificar si la jornada está cerrada
  if (encuentro.jornada?.estado === 'cancelado' || encuentro.jornada?.estado === 'finalizado') {
    throw new Error('La jornada está cerrada, no se puede modificar el encuentro');
  }

  // 3 Validar que vengan jugadores en updates
  if (!Array.isArray(updates.jugadores) || updates.jugadores.length === 0) {
    throw new Error('No se proporcionaron jugadores para actualizar');
  }

  // Crear un mapa de jugadores actuales por ID para acceso rápido
  const jugadoresMap = new Map();
  encuentro.jugadores.forEach(j => jugadoresMap.set(j.id_jugador.toString(), j));

  const nuevosJugadoresIds = [];

  // 4 Procesar cada jugador del update
  for (const jBody of updates.jugadores) {
    const idJugadorStr = jBody.id_jugador?.toString();
    if (!idJugadorStr) continue;
 
    if (jugadoresMap.has(idJugadorStr)) {
      // Ya existe → actualizar estado si viene
      if (jBody.estado) jugadoresMap.get(idJugadorStr).estado = jBody.estado;
    } else {
      // Nuevo jugador
      const nuevoJugador = {
        id_jugador: new mongoose.Types.ObjectId(idJugadorStr),
        estado: jBody.estado || 'pendiente'
      };
       
      encuentro.jugadores.push(nuevoJugador);
       
      nuevosJugadoresIds.push(idJugadorStr);
    }
  }

  // 5 Validaciones
  await verificarJugadoresExistentes(encuentro.jugadores.map(j => j.id_jugador));
  await verificarNoRepetidosEnEncuentro(id, encuentro.jugadores);

  const idJornada = encuentro.jornada._id;
  await verificarJugadoresEnJornada(idJornada, nuevosJugadoresIds, id);
  
  const capacidadFinal = encuentro.capacidad;
  if (encuentro.jugadores.length > capacidadFinal) {
    throw new Error(`La cantidad de jugadores supera la capacidad (${capacidadFinal})`);
  }

  // 6 Enviar mensajes a los nuevos jugadores
  const creadorNombre = encuentro.createdBy[0]?.userName || "El organizador";
  const nombreJuego = encuentro.juego[0]?.nombre || "el encuentro";
  const creadorId = new mongoose.Types.ObjectId(encuentro.createdBy[0].idUsuario);

  for (const jugadorId of nuevosJugadoresIds) {
    const mensajeData = {
      remitente: creadorId,
      destinatario: new mongoose.Types.ObjectId(jugadorId),
      contenido: `Has sido desafiado por ${creadorNombre} en ${nombreJuego}`,
      tipo: "notificacionEncuentro",
    };
    console.log(mensajeData);
    await crearMensaje(mensajeData);
    
  }
 
  // 7 Guardar y devolver el encuentro actualizado
  const updated = await encuentro.save();
  

  return updated.toObject();
}


/**
 * DELETE - ELIMINA un encuentro .
 * - Elimina su referencia de todas las jornadas
 * - envia mensaje a los jugadores inscriptos notificando
 */

async function deleteById(id) {
  if (!id) throw new Error("deleteById: id requerido.");
  if (!mongoose.isValidObjectId(id)) throw new Error("ID inválido.");

  // Buscar el encuentro
  const encuentro = await Encuentro.findById(id).exec();
  if (!encuentro) throw new Error(`Encuentro no encontrado: ${id}`);

  // Eliminar el encuentro
  const deleted = await Encuentro.findByIdAndDelete(id).exec();

  //  Eliminar referencia del encuentro en TODAS las jornadas
  await Jornada.updateMany(
    { encuentros: id },
    { $pull: { encuentros: id } }
  );

  // Enviar mensajes de cancelación a los jugadores inscritos
  try {
    if (Array.isArray(encuentro.jugadores) && encuentro.jugadores.length > 0) {
      const creadorId = new mongoose.Types.ObjectId(encuentro.createdBy[0].idUsuario)

      if (creadorId) {
        for (const jugador of encuentro.jugadores) {
           
          const jugadorId = jugador.id_jugador || jugador._id || jugador;
          const destinatarioId = new mongoose.Types.ObjectId(jugadorId);
          const nombreJuego = encuentro.juego?.[0]?.nombre || "el encuentro";
          const organizadorNombre = encuentro.createdBy?.[0]?.userName || "el creador";

          const mensajeData = {
            remitente: creadorId,
            destinatario: destinatarioId,
            contenido:`El encuentro de "${nombreJuego}" organizado por "${creadorNombre}" ha sido cancelado.`,
            tipo: "notificacionEncuentro",
          };
          //const nuevoMensaje = new Mensaje(mensajeData);
         await crearMensaje(mensajeData);
        }
      } else {
        console.warn("No se pudo determinar el creador del encuentro para enviar mensajes.");
      }
    }
  } catch (msgErr) {
    console.error("Error al crear mensajes de cancelación:", msgErr.message);
  }

  return { message: "Encuentro eliminado", id: String(deleted._id) };
}


/**
 * Método interno: elimina todos los encuentros referenciados por una jornada.
 * USO: pensado para ser invocado por jornadaService o scripts administrativos.
 *
 * Nota: este método está exportado en el service para permitir reutilización por otros servicios,
 * pero no se usa en el controller REST directamente . *
 * @param {String} jornadaId
 */
async function deleteByJornada(jornadaId) {
  if (!Jornada) {
    throw new Error("Modelo Jornada no disponible: crear file models/jornadaModel.js o ajustar require.");
  }
  if (!jornadaId) throw new Error("deleteByJornada: jornadaId requerido.");
  if (!mongoose.isValidObjectId(jornadaId)) throw new Error("jornadaId inválido.");

  const jornada = await Jornada.findById(jornadaId).lean();
  if (!jornada) throw new Error(`Jornada no encontrada: ${jornadaId}`);

  // Suponemos que jornada.encuentros es un array de ObjectId o strings
  const encuentrosIds = Array.isArray(jornada.encuentros) ? jornada.encuentros : [];

  if (encuentrosIds.length === 0) return { deletedCount: 0 };

  const result = await Encuentro.deleteMany({ _id: { $in: encuentrosIds } });
  return result; // { deletedCount: X }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Helpers / Validaciones internas
 */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Lanza Error si alguno de los ids de jugadores no existe.
 * @param {String[]} idsJugadores - array de ids (string/ObjectId)
 * @throws {Error} con mensaje descriptivo si falta alguno
 */
async function verificarJugadoresExistentes(idsJugadores) {
  if (!Array.isArray(idsJugadores)) {
    throw new Error("verificarJugadoresExistentes: se esperaba un arreglo de ids de jugadores.");
  }

  if (idsJugadores.length === 0) return;

  if (!Usuario) {
    throw new Error("Modelo Usuario no disponible.");
  }

  // Limpiamos y validamos IDs
  const idsValidos = [];
  const idsInvalidos = [];
  idsJugadores.forEach((id) => {
    const cleanId = String(id).trim();  // quitar espacios
    if (mongoose.isValidObjectId(cleanId)) {
      idsValidos.push(cleanId);
    } else {
      idsInvalidos.push(cleanId);
    }
    console.log("Verificando ID:", cleanId);
   
    
  });

  if (idsInvalidos.length > 0) {
    console.warn("IDs inválidos detectados:", idsInvalidos);
  }


  // Consulta solo con los válidos
  const encontrados = await Usuario.countDocuments({ _id: { $in: idsValidos } }).exec();
 
  if (encontrados !== idsValidos.length) {
    const usuarios = await Usuario.find({ _id: { $in: idsValidos } }).select("_id").lean();
    //const encontradosSet = new Set(usuarios.map((u) => String(u._id)));
    //const faltantes = idsValidos.filter((id) => !encontradosSet.has(String(id)));
    //throw new Error(`Jugadores no encontrados: ${faltantes.join(", ")}`);
  }
}


/**
 * Verifica que los jugadores no estén ya inscriptos en el encuentro.
 */

async function verificarNoRepetidosEnEncuentro(encuentroId, idsJugadores = []) {
  const encuentro = await Encuentro.findById(encuentroId);
  if (!encuentro) throw new Error(`Encuentro ${encuentroId} no encontrado.`);

  const participantes = encuentro.participantes || []; // <-- aquí
  const repetidos = idsJugadores.filter(id => participantes.includes(id));

  if (repetidos.length > 0) {
    throw new Error(`Los siguientes jugadores ya están inscriptos en el encuentro: ${repetidos.join(", ")}`);
  }
}
/**
 * Verifica que los jugadores estén inscriptos en la jornada asociada.
 */

async function verificarJugadoresEnJornada(jornadaId, idsJugadores = []) {
  if (!jornadaId) return; // Si no hay jornada asociada, no hacemos nada
  if (!Array.isArray(idsJugadores) || idsJugadores.length === 0) return;

  // Buscar la jornada con sus encuentros y jugadores
  const jornada = await Jornada.findById(jornadaId)
    .populate().lean();

  if (!jornada) throw new Error(`Jornada ${jornadaId} no encontrada.`);

 
  const jugadoresInscriptos = new Set(
    (jornada.jugadoresInscriptos || []).map(j =>
      j.id_jugador?.toString() || j.id?.toString() || j.toString()
    )
  );
 console.log(jornada.jugadoresInscriptos)

  // Verificar que todos los jugadores pasados estén inscritos
  const noInscritos = idsJugadores.filter(jId => !jugadoresInscriptos.has(jId.toString()));

  if (noInscritos.length > 0) {
    throw new Error(`Los siguientes jugadores no están inscriptos en la jornada: ${noInscritos.join(", ")}`);
  }
}


/**
 * Lanza Error si el juego no existe.
 * @param {String} idJuego
 */
async function verificarJuegoExistente(idJuego) {
  if (!idJuego) throw new Error("verificarJuegoExistente: idJuego requerido.");

  if (!Juego) throw new Error("Modelo Juego no disponible");

  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(idJuego);
  } catch {
    throw new Error(`ID de juego inválido: ${idJuego}`);
  }

  const existe = await Juego.exists({ _id: objectId });
  if (!existe) throw new Error(`Juego no encontrado: ${idJuego}`);
}

/**
 * Verifica capacidad disponible:
 * - recibe la capacidad máxima (capacidadMax)
 * - y la cantidad de jugadores que quedarían después de la operación (cantidadFinal)
 * Lanza Error si cantidadFinal > capacidadMax
 */
function verificarCapacidadDisponible(capacidadMax, cantidadFinal) {
  if (typeof capacidadMax !== "number") {
    throw new Error("verificarCapacidadDisponible: capacidadMax debe ser número.");
  }
  if (typeof cantidadFinal !== "number") {
    throw new Error("verificarCapacidadDisponible: cantidadFinal debe ser número.");
  }
  if (cantidadFinal > capacidadMax) {
    throw new Error(
      `Capacidad superada: capacidad máxima ${capacidadMax}, intentado asignar ${cantidadFinal} jugadores.`
    );
  }
}

/**
 * Verifica que un ID de encuentro exista; devuelve el documento si existe.
 * Lanza Error  con mensaje si no existe.
 */
async function getEncuentroOrThrow(id) {
  if (!id) throw new Error("ID de encuentro requerido.");
  if (!mongoose.isValidObjectId(id)) {
    throw new Error(`ID de encuentro inválido: ${id}`);
  }
  const encuentro = await Encuentro.findById(id);
  if (!encuentro) throw new Error(`Encuentro no encontrado: ${id}`);
  return encuentro;
}


/**
 * Verifica que un id encuentro exista; devuelve el documento si existe, 
 * devuelve {} si no existe--NO SE USA ACTUALMENTE
 */

async function getEncuentroOrEmpty(id) {
  if (!id || !mongoose.isValidObjectId(id)) return {};
  const encuentro = await Encuentro.findById(id);
  return encuentro || {};
}


/////////////////////////////////////////////////////////////////////////////////

module.exports = {
  // queries
  getAll,
  getById,
  getByCreador,
  getByGanador,
  getByJuego,
  getByEstado,
  getByJugador,

  // operaciones
  create, //solo desde jornadaController
  update,
  updateJugadores,
  deleteById,

  // método "interno" reutilizable
  deleteByJornada,
};
