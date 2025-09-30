/*
// src/models/usuarioModel.js
let usuarios = require("../data/usuario");

// Obtener todos los usuarios
function getAll() {
  return usuarios;
}

// Buscar por ID el usuario
function getById(id) {
  return usuarios.find((u) => u.id === id);
}

// Crear un nuevo usuario
function create(user) {
  const newId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
  const usuariosActualizado = { id: newId, ...user };
  usuarios.push(usuariosActualizado);
  return usuariosActualizado;
}

// Actualizar un usuario
function update(id, user) {
  let usuarioActualizado = null;
  const index = usuarios.findIndex((u) => u.id === id);
  if (index !== -1) { //si no encuentra, siempre devuelve -1
    usuarios[index] = { ...usuarios[index], ...user }; //lo modifico
    usuarioActualizado = usuarios[index];
  }
  return usuarioActualizado; //devuelvo el usuario actualizado
}

// Eliminar usuario
function remove(id) {
  let usuarioEliminado = null;
  const index = usuarios.findIndex((u) => u.id === id);
  if (index !== -1) { //si no encuentra, siempre devuelve -1
    usuarioEliminado = usuarios[index];
    usuarios.splice(index, 1); //(indice, cantidad de elementos a eliminar desde el index)
  }
  return usuarioEliminado; //devuelvo el usuario que se elimino
}

module.exports = { getAll, getById, create, update, remove };
*/

//mongoose
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    pass: { type: String, required: true },
    rol: { type: String, enum: ["jugador", "administrador", "juegoteka"], required: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    foto: { type: String },
    telefono: { type: String },
    mail: { type: String, required: true, trim: true },
    direccion: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", usuarioSchema);