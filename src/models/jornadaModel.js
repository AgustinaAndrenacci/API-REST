const mongoose = require("mongoose");

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
        //Usar referencia para no tener problema en el modificar
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
        userName: { type: String, required: true },
        //nombre: { type: String, required: true },
        //apellido: { type: String, required: true }
      }
    ],
    encuentros: [ //que sea por referencia
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Encuentro", required: true },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jornada", jornadaSchema);