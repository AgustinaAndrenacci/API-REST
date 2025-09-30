// src/models/juegoModel.js
let juegos = require("../data/juego");

// Obtener todos los juegos
function getAll() {
  return juegos;
}

// Buscar por ID el juego
function getById(id) {
  return juegos.find((j) => j.id === id);
}

// Crear un nuevo juego
function create(juego) {
  const newId = juegos.length ? Math.max(...juegos.map((j) => j.id)) + 1 : 1;
  const juegosActualizado = { id: newId, ...juego };
  juegos.push(juegosActualizado);
  return juegosActualizado;
}

// Actualizar un juego
function update(id, juego) {
  let juegoActualizado = null;
  const index = juegos.findIndex((j) => j.id === id);
  if (index !== -1) { //si no encuentra, siempre devuelve -1
    juegos[index] = { ...juegos[index], ...juego }; //lo actualiza
    juegoActualizado = juegos[index];
  }
  return juegoActualizado; //devuelvo el juego actualizado
}

// Eliminar juego
function remove(id) {
  let juegoEliminado = null;
  const index = juegos.findIndex((j) => j.id === id);
  if (index !== -1) { //si no encuentra, siempre devuelve -1
    juegoEliminado = juegos[index];
    juegos.splice(index, 1); //(indice, cantidad de elementos a eliminar desde el index)
  }
  return juegoEliminado; //devuelvo el juego que se elimino
}

module.exports = { getAll, getById, create, update, remove };