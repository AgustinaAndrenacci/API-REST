// src/models/jornadaModel.js
let jornadas = require("../data/jornada");

// Obtener todas las jornadas
function getAll() {
  return jornadas;
}

// Buscar por ID la jornada
function getById(id) {
  return jornadas.find((j) => j.id === id);
}

// Crear una nueva jornada
function create(jornada) {
  const newId = jornadas.length ? Math.max(...jornadas.map((j) => j.id)) + 1 : 1;
  const jornadaActualizada = { id: newId, ...jornada };
  jornadas.push(jornadaActualizada);
  return jornadaActualizada;
}

// Actualizar una jornada
function update(id, jornada) {
  let jornadaActualizada = null;
  const index = jornadas.findIndex((j) => j.id === id);
  if (index !== -1) { //si no encuentra, siempre devuelve -1
    jornadas[index] = { ...jornadas[index], ...jornada }; //lo modifico
    jornadaActualizada = jornadas[index];
  }
  return jornadaActualizada; //devuelvo la jornada actualizada
}

// Eliminar jornada
function remove(id) {
  let jornadaEliminada = null;
  const index = jornadas.findIndex((j) => j.id === id);
  if (index !== -1) { //si no encuentra, siempre devuelve -1
    jornadaEliminada = jornadas[index];
    jornadas.splice(index, 1); //(indice, cantidad de elementos a eliminar desde el index)
  }
  return jornadaEliminada; //devuelvo la jornada que se elimino
}

module.exports = { getAll, getById, create, update, remove };
