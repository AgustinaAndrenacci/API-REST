// src/models/juegoModel.js
let juegos = require("../data/juego");
const mongoose = require("mongoose")
  
const juegoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    imagen: { type: String, required: true },
    descripcion: { type: String, required: true },
    reglamento: { type: String, required: true },
    cantJugadoresMax: { type: Number, required: true },
    cantJugadoresMin: { type: Number, required: true },
    tiempoEstimado: { type: Number, required: true },
    estado: { 
      type: String, 
      enum: ["activo", "eliminado"]
    },
  }
);

module.exports = mongoose.model("Juego", juegoSchema);
/*
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

module.exports = { getAll, getById, create, update, remove }; */