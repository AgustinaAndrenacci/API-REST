const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema(
  {
    remitente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    destinatario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      default: "general",
      trim: true,
    },
    leido: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt
  }
);

module.exports = mongoose.model("Mensaje", mensajeSchema);
