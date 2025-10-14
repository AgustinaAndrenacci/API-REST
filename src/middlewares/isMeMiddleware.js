//middleware que verifica si el usuario que inicio sesion es el mismo que quiere editar su propio usuario (otro no puede)
const isMe = (req, res, next) => {
  const userId = req.user.id;
  const paramId = req.params.id;

  if (userId !== paramId) {
    return res.status(403).json({ message: "No tienes permiso para editar este usuario." });
  }

  next();
}

module.exports = { isMe };
