// src/models/encuentroModel.js
let encuentros = require("../data/encuentros");

// Obtener todas
function getAll() {
  return encuentros;
}

// Buscar por ID
function getById(id) {
  return encuentros.find((e) => e._id === id);
}

// Crear
function create(encuentro) {
  const newId = encuentros.length ? Math.max(...encuentros.map((e) => e._id)) + 1 : 1;
  const nueva = { _id: newId,...encuentro, estado: "pendiente", id_ganador: null, jugadores: []};
  encuentros.push(nueva);
  return nueva;
}

// Actualizar
function update(id, data) {
  let encuentroActualizado = null;
  const index = encuentros.findIndex((e) => e._id === id);
  if (index !== -1) {
    encuentros[index] = { ...encuentros[index], ...data };
    encuentroActualizado = encuentros[index];
  }
  return encuentroActualizado;
}


function remove(id) {
  const index = encuentros.findIndex((e) => e._id === id);
  let encuentroEliminado = false;
  if (index !== -1) {
    encuentros.splice(index, 1);
    encuentroEliminado = true;
  }
  return encuentroEliminado;
}

module.exports = { getAll, getById, create, update, remove };