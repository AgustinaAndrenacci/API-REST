

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

// Verificar si el usuario es 'Juegoteka'
const isJuegoteka = async (req, res, next) => {
  let status;
  req.usuario.rol !== "juegoteka" || req.usuario.rol !== "administrador"
    ? status = res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' })
    : status = next();
  return status;
};

module.exports = { autenticarToken, isJuegoteka};