const jwt = require("jsonwebtoken");
const diccionarioRutasYPermisos = require("../authDictionary");

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

const validarPermisoRuta = async (req, res, next) => {
  let status;
  const permisoNecesario = diccionarioRutasYPermisos[req.baseUrl + req.route.path];// Ejemplo: req.path toma el path COMPLETO | req.route.path toma el cachito p/usar en diccionario
  if (!permisoNecesario) {
    status = res.status(404).json({ error: "La ruta especificada no existe." });
  } else if ((req.user.rol === permisoNecesario || req.user.rol === "administrador")){
    status = next();
  } else {
    console.log(permisoNecesario)
    status = res.status(403).json({ error: "No tenés permisos para esta acción." });
  }
  return status;
};

module.exports = { autenticarToken, validarPermisoRuta};