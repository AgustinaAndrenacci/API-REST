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
 * Nota: ajustar require() si los modelos están en otra ruta o con otro nombre.
 */

const Encuentro = require("../models/encuentroModel");

let Jornada, Usuario, Juego; // cargamos con try para dar mensajes claros si faltan.

try {
  Jornada = require("../models/jornadaModel");
} catch (e) {
  // No abortamos: algunos proyectos no usan jornadaModel en este módulo.
  Jornada = null;
}

try {
  Usuario = require("../models/usuarioModel");
} catch (e) {
  Usuario = null;
}

try {
  Juego = require("../models/juegoModel");
} catch (e) {
  Juego = null;
}


const mongoose = require("mongoose");

/**
 * Helpers / Validaciones internas
 */

/**
 * Lanza Error si alguno de los ids de jugadores no existe.
 * @param {String[]} idsJugadores - array de ids (string/ObjectId)
 * @throws {Error} con mensaje descriptivo si falta alguno
 */
async function verificarJugadoresExistentes(idsJugadores = []) {
  if (!Array.isArray(idsJugadores)) {
    throw new Error("verificarJugadoresExistentes: se esperaba un arreglo de ids de jugadores.");
  }

  if (idsJugadores.length === 0) return; // OK: no hay jugadores a verificar

  if (!Usuario) {
    throw new Error("Modelo Usuario no disponible: crear archivo models/usuarioModel.js o ajustar require.");
  }

  // Normalizar a ObjectId cuando sea posible
  const ids = idsJugadores.map((id) => (mongoose.isValidObjectId(id) ? id : id));

  // Consulta: buscar cuantos usuarios coinciden
  const encontrados = await Usuario.countDocuments({ _id: { $in: ids } }).exec();
  if (encontrados !== ids.length) {
    // Buscamos cuáles faltan para dar un mensaje útil
    const usuarios = await Usuario.find({ _id: { $in: ids } }).select("_id").lean();
    const encontradosSet = new Set(usuarios.map((u) => String(u._id)));
    const faltantes = ids.filter((id) => !encontradosSet.has(String(id)));
    throw new Error(`Jugadores no encontrados: ${faltantes.join(", ")}`);
  }
}


/**
 * Verifica que los jugadores no estén ya inscriptos en el encuentro.
 */

async function verificarNoRepetidosEnEncuentro(encuentroId, idsJugadores = []) {
  const encuentro = await Encuentro.findById(encuentroId);
  if (!encuentro) throw new Error(`Encuentro ${encuentroId} no encontrado.`);

  const repetidos = idsJugadores.filter(id => encuentro.participantes.includes(id));
  if (repetidos.length > 0) {
    throw new Error(`Los siguientes jugadores ya están inscriptos en el encuentro: ${repetidos.join(", ")}`);
  }
}

/**
 * Verifica que los jugadores estén inscriptos en la jornada asociada.
 */
async function verificarJugadoresEnJornada(jornadaId, idsJugadores = []) {
  const jornada = await Jornada.findById(jornadaId).populate("jugadores", "_id");
  if (!jornada) throw new Error(`Jornada ${jornadaId} no encontrada.`);

  const jornadaJugadores = new Set(jornada.jugadores.map(j => String(j._id)));
  const noInscritos = idsJugadores.filter(id => !jornadaJugadores.has(String(id)));
  if (noInscritos.length > 0) {
    throw new Error(`Los siguientes jugadores no pertenecen a la jornada: ${noInscritos.join(", ")}`);
  }
}



/**
 * Lanza Error si el juego no existe.
 * @param {String} idJuego
 */
async function verificarJuegoExistente(idJuego) {
  if (!idJuego) throw new Error("verificarJuegoExistente: idJuego requerido.");
  if (!Juego) {
    throw new Error("Modelo Juego no disponible: crear archivo models/juegoModel.js o ajustar require.");
  }
  const existe = await Juego.exists({ _id: idJuego });
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

/**
 * Consultas públicas
 */

/**
 * getAll - retorna encuentros según filtro.
 * @param {Object} filtro - objeto de filtro (ej: { tipo: 'torneo' })
 */
async function getAll(filtro = {}) {
  // Seguridad: no permitir filtros peligrosos por defecto (se asume uso interno / controller)
  const safeFilter = { ...filtro };
  // Podés agregar paginación, orden, etc. más adelante.
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
  // Intentamos buscar tanto por campo embebido como por referencia posible
  const data = await Encuentro.find({
    $or: [{ "juego.id_juego": idJuego }, { "juego._id": idJuego }, { "juego": idJuego }],
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
 * Crear un nuevo encuentro.
 * Validaciones estrictas: jugadores, juego, capacidad.
 *
 * @param {Object} payload - objeto con campos para crear el encuentro (debe coincidir con el schema)
 */
async function create(payload) {
  if (!payload) throw new Error("create: payload requerido.");

  // Validaciones que podemos hacer antes de guardar:
  //  - si hay jugadores: verificar existencia
  if (payload.jugadores && Array.isArray(payload.jugadores) && payload.jugadores.length > 0) {
    const ids = payload.jugadores.map((j) => j.id_jugador || j._id || j);
    await verificarJugadoresExistentes(ids);
  }

  //  - si hay juego: verificar existencia
  if (payload.juego) {
    // Si juego viene como objeto con id_juego, preferimos eso; si viene como _id usamos ese.
    const idJuego = payload.juego.id_juego || payload.juego._id || payload.juego;
    if (idJuego) await verificarJuegoExistente(idJuego);
  }

  //  - capacidad: si payload.capacidad está definida y hay jugadores, validar
  if (typeof payload.capacidad === "number") {
    const cantidadJugadores = payload.jugadores ? payload.jugadores.length : 0;
    verificarCapacidadDisponible(payload.capacidad, cantidadJugadores);
  }

  // crear y devolver
  const nuevo = new Encuentro(payload);
  const saved = await nuevo.save();
  return saved.toObject();
}

/**
 * update - actualiza un encuentro con validaciones estrictas.
 * - id: id del encuentro a actualizar
 * - updates: objeto con campos a modificar (p. ej. jugadores, juego, capacidad, estado)
 */
async function update(id, updates = {}) {
  // Obtener encuentro o tirar error si no existe
  const encuentro = await getEncuentroOrThrow(id);

  // Validaciones:
  // 1) Si se actualizan jugadores (p. ej. updates.jugadores), verificar que existan
  if (updates.jugadores !== undefined) {
    if (!Array.isArray(updates.jugadores)) {
      throw new Error("El campo jugadores debe ser un arreglo.");
    }
    const ids = updates.jugadores.map((j) => j.id_jugador || j._id || j);
    await verificarJugadoresExistentes(ids);
    await verificarNoRepetidosEnEncuentro(encuentroId, payload.jugadores);
    await verificarJugadoresEnJornada(payload.jornada, payload.jugadores);

    // verificar capacidad (usar la capacidad resultante: si también se actualiza capacidad, usala; sino la actual)
    const capacidadFinal = typeof updates.capacidad === "number" ? updates.capacidad : encuentro.capacidad;
    verificarCapacidadDisponible(capacidadFinal, updates.jugadores.length);
  }

  // 2) Si se actualiza el juego verifica que el juego exista
  if (updates.juego !== undefined) {
    const idJuego = updates.juego && (updates.juego.id_juego || updates.juego._id || updates.juego);
    if (idJuego) await verificarJuegoExistente(idJuego);
  }

  // 3) Si se actualiza la capacidad sola (sin tocar jugadores), verificar consistencia:
  if (updates.capacidad !== undefined && updates.jugadores === undefined) {
    // cantidad actual de jugadores
    const cantidadActual = Array.isArray(encuentro.jugadores) ? encuentro.jugadores.length : 0;
    verificarCapacidadDisponible(updates.capacidad, cantidadActual);
  }

  // 4) Opcional: evitar actualizar si encuentro está en estado que no permite cambios (ej: 'cerrado')
  if (encuentro.estado && String(encuentro.estado).toLowerCase() === "finalizado") {
    throw new Error("No se puede modificar un encuentro en estado 'finalizado'.");
  }

  // Efectuar la actualización
  // Usamos findByIdAndUpdate para obtener el documento actualizado
  const updated = await Encuentro.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).exec();
  if (!updated) throw new Error(`Error al actualizar encuentro ${id}`);
  return updated.toObject();
}

/**
 * deleteById - elimina un encuentro por id
 */
async function deleteById(id) {
  if (!id) throw new Error("deleteById: id requerido.");
  if (!mongoose.isValidObjectId(id)) throw new Error("ID inválido.");
  const deleted = await Encuentro.findByIdAndDelete(id).exec();
  if (!deleted) throw new Error(`Encuentro no encontrado: ${id}`);
  return { message: "Eliminado", id: String(deleted._id) };
}

/**
 * Export: métodos públicos del service.
 *
 * Observación: exportamos deleteByJornada también para que otros services (p. ej. jornadaService)
 * puedan invocarlo cuando eliminen una jornada o necesiten limpiar encuentros asociados.
 */
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
  create,
  update,
  deleteById,

  // método "interno" reutilizable
  deleteByJornada,
};
