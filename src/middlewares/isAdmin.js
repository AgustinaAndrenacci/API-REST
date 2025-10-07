const isAdmin = (req, res, next) => {
    if (req.user.role === 'administrador') {
        next();
    } else {
        res.status(403).json({ message: 'El usuario no tiene permisos de administrador' });
    }
}

module.exports = { isAdmin };