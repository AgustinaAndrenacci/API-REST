/////////////////////////////////
//
//     encuentroModel para mongoose
//
//////////////////////////////////

const mongoose = require("mongoose");

const juegoSchema = new mongoose.Schema({
  id_juego: { type: String, required: true },
  nombre: { type: String, required: true },
  imagen: { type: String, default: "" },
});

const jugadorSchema = new mongoose.Schema({
  id_jugador: { type: String },
  nombre: { type: String },
  apellido:{ type: String },
  UserName :{ type: String },
  estado: { 
      type: String, 
      enum: ["pendiente", "confirmado"], 
      default: "pendiente"},
  
});

const organizadorSchema = new mongoose.Schema({
  id_usuario: { type: String },
  UserName :{ type: String },
  tipo: { 
      type: String, 
      enum: ["jugador", "juegoteca"],
      required: true}, 
});


const encuentroSchema = new mongoose.Schema(
  {
    createdBy: { type: [organizadorSchema], required: true },
    tipo: { type: String, required: true },
    capacidad: { type: Number, required: true },
    juego: { type: [juegoSchema], default: [] },
    jugadores: { type: [jugadorSchema], default: [] },
    ganador: { type: [jugadorSchema], default: [] },//podria ser default: null para un solo ganador pero neh
    estado: { 
      type: String, 
      enum: ["pendiente", "abierto", "cerrado", "en proceso", "finalizado"], 
      default: "pendiente"},
  },


  { timestamps: true }
);

module.exports = mongoose.model("Encuentro", encuentroSchema);




////////////////////////////////////////////
//
//  Version funcionando en local sin persistencia
//
////////////////////////////////////////////

/*

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

*/