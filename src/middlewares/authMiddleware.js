
/*
const jwt = require("jsonwebtoken");


//verifica token JWT
//verifica si el token que me diste es mio
const autenticarToken = (req, res, next) => {

    //obtengo el token en el header Authorization en postman
    const token = req.headers["authorization"]?.split(" ")[1];
                //         .authorization (es de otra forma, ver xq)
    if (!token) res.status(401).json({ error: "Token no proporcionado" });
    
    //verifico si el token es valido
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) res.status(403).json({ error: "Token invalido o expirado" });
    
    //agregar la informacion del usuario decodificada a la request
    req.user = user;
    next(); //continua con la siguiente funcion
  }); //despues de JWT_SECRET, lo que sigue se llama "callback", se usa
  // xq la libreria para usar callback, no usa promesas, entonces 
  //maneja el asincronismo con callbacks
};

module.exports = { autenticarToken };
*/

const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const autenticarToken = (req, res, next) => {
  // Obtener el token del header Authorization (formato: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer token después de "Bearer "

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    // Agregar la información del usuario decodificada al request
    req.user = user;
    next(); // Continuar con la siguiente función
  });
};

module.exports = { autenticarToken };