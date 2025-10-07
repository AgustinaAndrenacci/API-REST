// middlewares/isJugadorMiddleware.js
const Usuario = require("../models/usuarioModel"); 

const isJugadorMiddleware = async (req, res, next) => {
  try {
    // 1. Verificar que el usuario esté autenticado (req.user debe existir)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado: se requiere autenticación"
      });
    }

    // 2. Buscar el usuario en la base de datos para obtener el rol actualizado
    const usuario = await Usuario.findById(req.user.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // 3. Verificar si el usuario tiene el rol de "jugador"
    if (usuario.rol !== "jugador" && usuario.rol !== "administrador" ) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado: se requiere rol de jugador",
        rolActual: usuario.rol,
        rolRequerido: "jugador"
      });
    }

    // 4. Adjuntar los datos completos del usuario al request para uso posterior (?)
    req.userData = usuario;
    
    // 5. Pasar al siguiente middleware/controlador
    next();
    
  } catch (error) {
    console.error("Error en isJugadorMiddleware:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al verificar permisos"
    });
  }
};

module.exports = isJugadorMiddleware;