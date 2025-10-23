/*
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

*/

//mongoose
const mongoose = require("mongoose");

const jornadaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    fechaHora: { type: Date, required: true },
    precioInscripcion: { type: Number, default: 0 }, //0 si no se ingresa
    capacidad: { type: Number, required: true },
    estado: { type: String, enum: ["suspendido", "cancelado", "activo", "finalizado"], default: "activo" },
    Juegoteka: { //true
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
      nombre: { type: String, required: true },
      direccion: { type: String, required: true }
    },
    juegosDisponibles: [  //true
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Juego", required: true },
        titulo: { type: String, required: true },
        imagen: { type: String, default: "" },
      }
    ],
    jugadoresInscriptos: [ //false
      {
        //Usar referencia para no tener problema en el modificar
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
        userName: { type: String, required: true },
        nombre: { type: String, required: true },
        apellido: { type: String, required: true }
      }
    ],
    encuentros: [ //false
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Encuentro", required: true },
        tipo: { type: String, required: true },
        estado: { 
          type: String, 
          enum: ["Pendiente", "En proceso", "Finalizado", "Abierto", "Cerrado"], 
          required: true 
          }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jornada", jornadaSchema);