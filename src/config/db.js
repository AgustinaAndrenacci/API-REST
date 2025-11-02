const mongoose = require("mongoose");

const dotenv = require("dotenv"); 
// dotenv es un paquete que carga variables de entorno desde un archivo .env
dotenv.config(); // carga variables de entorno.env 


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      //useNewUrlParser: true,
     // useUnifiedTopology: true,
     //process.env: contiene las variables de entorno
    }); 
    
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
