//Genero los services que se utilizaran en controller
const { MongoCryptCreateDataKeyError } = require("mongodb");
const Usuario = require("../models/usuarioModel");

//create
const createUsuario = async (data) => {
  const nuevoUsuario = new Usuario(data);
  await nuevoUsuario.save();
  return nuevoUsuario;
};

//updateById
const updateUsuarioById = async (id, data) => {
  const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });
  return usuario;
};

//getAll
const getAllUsuarios = async () => {
  const usuarios = await Usuario.find();
  return usuarios;
};

//getById
const getUsuarioById = async (id) => {
  const usuario = await Usuario.findById(id);
  return usuario;
};


//getByUsername
const getUsuarioByUsername = async (userName) => {
  const usuario = await Usuario.findOne(userName);
  return usuario;
};

//getById
const getUsuarioByTipo = async (tipo) => {
  //todos los jugadores, juegotekas, etc
  const usuario = await Usuario.find({ rol:tipo });
  return usuario;
};

const formatoJsonUsuarioPersonalizado = (usuario) => {
  return {
    id: usuario._id,
    userName: usuario.userName,
    rol: usuario.rol,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    foto: usuario.foto,
    telefono: usuario.telefono,
    mail: usuario.mail,
    direccion: usuario.direccion
  };
};

//json a mostrar
const formatoJsonUsuarioGeneral = (usuario) => {
  return {
    id: usuario._id,
    userName: usuario.userName,
    rol: usuario.rol,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    foto: usuario.foto
  };
};

const formatoJsonJuegoteka = (usuario) => {
  return {
    id: usuario._id,
    nombre: usuario.nombre,
    direccion: usuario.direccion
  };
};

//updateMisJuegos
const updateMisJuegos = async (id, juegos) => {
  const usuario = await Usuario.findByIdAndUpdate(id, { misJuegos: juegos }, { new: true });
  return usuario;
};

//createMisJuegos
const createMisJuegos = async (id, juegos) => {
  const usuario = await Usuario.findByIdAndUpdate(id, { misJuegos: juegos }, { new: true });
  return usuario;
};

//deleteMisJuegos
const deleteMisJuegos = async (idUsuario, idJuego) => {
  const juegosActualizados = await Usuario.findByIdAndUpdate(
    idUsuario, 
    { 
      // Usamos $pull para eliminar un elemento de un array.
      // { _id: idJuego } asume que 'misJuegos' es un array de objetos con un campo '_id'.
      $pull: { misJuegos: { _id: idJuego } } 
    }, 
    { 
      new: true // Devuelve el documento actualizado.
    }
  );
  return juegosActualizados;
};

const estadosValidos = async (estado) => {
  try {
    const estadosValidos = Usuario.schema.paths.rol.options.enum;
    return (estadosValidos.includes(estado) && estado !== "administrador");
    //includes: verifica si el estado recibido está en la lista de estados válidos
  } catch (error) {
    throw new Error("Error al validar estados");
  }
};

const hayDatosAModificarEnJornada = async (body) => {
  try {
    //chequea si en el body hay nombre o direccion
     return (body.nombre || body.direccion) ? true : false;
  } catch (error) {
    throw new Error("Error al validar estados");
  }
};

const hayJuegos = async (misJuegos) => {
  try {
    return misJuegos && misJuegos.length > 0;
  } catch (error) {
    throw new Error("Error al verificar juegos");
  }
};

//ver que funcion de formatoJson da
const formatoJsonSeleccionado = async (rol) => {
  if (rol === "administrador") {
    return formatoJsonUsuarioPersonalizado;
  } else {
    return formatoJsonUsuarioGeneral;
  }
};

//exporto
module.exports = {
  formatoJsonSeleccionado,
  createUsuario,
  updateUsuarioById,
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByTipo,
  getUsuarioByUsername,
  formatoJsonUsuarioGeneral,
  formatoJsonUsuarioPersonalizado,
  updateMisJuegos,
  createMisJuegos,
  deleteMisJuegos,
  estadosValidos,
  formatoJsonJuegoteka,
  hayDatosAModificarEnJornada,
  hayJuegos
};