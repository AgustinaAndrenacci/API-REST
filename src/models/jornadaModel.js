const mongoose = require("mongoose");
const { Schema } = mongoose; 
//por que {}?  Para desestructurar el objeto mongoose 
// y obtener solo la clase Schema

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
    juegosDisponibles: [  //true
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Juego", required: true },
        titulo: { type: String, required: true },
        imagen: { type: String, default: "" },
      }
    ],
    jugadoresInscriptos: [ //false
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
        userName: { type: String, required: true },
      }
    ],
   encuentros: [{ type: Schema.Types.ObjectId, ref: 'Encuentro' }]
  },
  { timestamps: true } // Agrega campos de fecha de creación y actualización
);

module.exports = mongoose.model("Jornada", jornadaSchema);