const isAdmin = (req, res, next) => {
    if (req.user.role === 'administrador') {
        next();  //va al siguiente middleware si hay
    } else {
        res.status(403).json({ message: 'El usuario no tiene permisos de administrador' });
    }
}

module.exports = { isAdmin };