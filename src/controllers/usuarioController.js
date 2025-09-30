// src/controllers/usuarioController.js

//CAMBIAR LO DE LOS ERRORES!!!!

/*
const Usuario = require("../models/usuarioModel");

exports.getAllUsuarios = (req, res) => {
  res.json(Usuario.getAll());
};

exports.getUsuarioById = (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = Usuario.getById(id); //lo trae del modelo
  usuario //ternario IF
    ? res.json(usuario) //true
    : res.status(404).json({ error: "Usuario no encontrado" }); //false
};

exports.createUsuario = (req, res) => {
  const { userName, pass, rol } = req.body;
  !userName || !pass || !rol
    ? res.status(400).json({ error: "Faltan campos obligatorios" }) //false
    : res.status(201).json(Usuario.create({ userName, pass, rol })); //true
};

exports.updateUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const actualizada = Usuario.update(id, req.body);
  actualizada
    ? res.json(actualizada) //true
    : res.status(404).json({ error: "Usuario no encontrado" }); //false
};

exports.deleteUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const eliminada = Usuario.remove(id);
  eliminada
    ? res.json({ message: "Usuario eliminado" }) //true
    : res.status(404).json({ error: "Usuario no encontrado" }); //false
};

*/
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarioModel");

exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    usuario
      ? res.json(usuario) //true
      : res.status(404).json({ error: "Usuario no encontrado" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    //desestructuracion en javascript
    const { userName, pass } = req.body; //cuando hay + de un parametro
            //campo del postman, puedo cambiar alli el nombre y aca tambien

    //busco usuario
    const usuario = await Usuario.findOne({ userName, pass });
    //usuario
    //  ? res.status(200).json({ message: "Usuario logueado con exito :)" }) //true
    //  : res.status(404).json({ error: "Datos de login incorrectos" }); //false
    if(!usuario){
      res.status(404).json({ error: "Datos de login incorrectos" });
    }
    //verificar contra (comparo hash)
    //encripto la otra y compara, no se desencripta nada
    //si cuando se registra hasheo la contraseña
    /*
    const isMatch = await bcrypt.compare(pass,usuario.pass);
    if (!isMatch){
      res.status(404).json({ error: "Datos de login incorrectos" });
    }
    */
   
    //generar token JWT si todo es correcto
    //jwt.sign(datosDelUsuario  , clave  , opciones (ej:tiempo de expiracion)  );
    const token = jwt.sign(
      {id:usuario._id, userName: usuario.userName, rol: usuario.rol},
      process.env.JWT_SECRET,
      //variable de entorno ej: JWT_SECRET, ahi se guarda la clave (env)
      {expiresIn: "1h"} //si no aclaro, es milisegundos
    );

    res.json({
      message: "Login exitoso :)",
      token,
      usuario: {
        id: usuario._id,
        user: usuario.userName,
        tipo: usuario.rol
      },
    });

  
  
    } catch (err) {
    console.error("Error en el login",err); //NUEVO
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

exports.createUsuario = async (req, res) => {
  try {
    const { userName, pass, rol, nombre, apellido, foto, telefono, mail } = req.body;
    if (!userName || !pass || !rol || !nombre || !apellido || !mail) {
      return res.status(400).json({ error: "Faltan campos obligatorios" }); //false
    }
    const nuevoUsuario = new Usuario({ userName, pass, rol, nombre, apellido, foto, telefono, mail });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario); //true
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    usuarioActualizado
      ? res.json(usuarioActualizado) //true
      : res.status(404).json({ error: "Usuario no encontrado" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    usuarioEliminado
      ? res.json({ message: "Usuario eliminado" }) //true
      : res.status(404).json({ error: "Usuario no encontrado" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};