const mongoose = require("mongoose");
const { Schema } = mongoose; 
//por que {}?  Para desestructurar el objeto mongoose 
// y obtener solo la clase Schema

const juegoSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Juego", required: true },
  titulo: { type: String, required: true },
  imagen: { type: String, default: "" }
}, { _id: false }); // deshabilita _id automático para subdocumentos

const jugadorSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  userName: { type: String, required: true }
}, { _id: false }); // deshabilita _id automático para subdocumentos


const jornadaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    fechaHora: { type: Date, required: true },
    precioInscripcion: { type: Number, default: 0 }, //0 si no se ingresa
    capacidad: { type: Number, required: true },
    estado: { type: String, enum: ["cancelado", "activo", "finalizado"], default: "activo" },
    Juegoteka: { //true
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
      nombre: { type: String, required: true },
      direccion: { type: String, required: true }
    },
    juegosDisponibles: [juegoSchema],
    jugadoresInscriptos: [jugadorSchema],
   encuentros: [{ type: Schema.Types.ObjectId, ref: 'Encuentro' }]
  },
  { timestamps: true } // Agrega campos de fecha de creación y actualización
);

module.exports = mongoose.model("Jornada", jornadaSchema);