
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
    direccion: { type: String, required: true, trim: true },
    //Creo un vector misJuegos que tiene juego(modelo)
    misJuegos: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Juego", required: true },
        titulo: { type: String, required: true },
        imagen: { type: String, default: "" },
      }
    ],
    

    //inbox: { type: [msjSchema], default: [] },
    //msjEnviados: { type: [msjSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", usuarioSchema);