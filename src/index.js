
// src/index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const usuarioRoutes = require("./routes/usuarioRoutes");
const jornadaRoutes = require("./routes/jornadaRoutes");
const encuentroRoutes = require("./routes/encuentroRoutes");
const juegosRoutes = require("./routes/juegoRoutes");
const mensajeRoutes = require("./routes/mensajeRoutes");///AGREGO para mensaje(fede 19.10)
const { showErrorMessage } = require("./errorHandler");

const connectDB = require("./config/db");

dotenv.config(); // carga variables de entorno.env 

const app = express();
app.use(cors()); // middleware para...
app.use(express.json()); // middleware para...

//Conectar BD
connectDB(); 

// Rutas
app.use("/usuarios", usuarioRoutes);
app.use("/jornadas", jornadaRoutes);
app.use("/encuentros", encuentroRoutes);
app.use("/juegos", juegosRoutes);
app.use("/mensajes", mensajeRoutes); ///AGREGO para mensaje(fede 19.10)

app.use((req, res) => {
  return showErrorMessage(res, 404, "Suponiamos que charly iba a hacer esto");
});

// Inicio del server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
