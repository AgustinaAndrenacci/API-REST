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
    res.json(
      usuarios.map(usuario => ({
        id: usuario._id,
        user: usuario.userName,
        rol: usuario.rol,
        nombre: usuario.nombre + " " + usuario.apellido,
        foto: usuario.foto,
        telefono: usuario.telefono,
        mail: usuario.mail
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    usuario
      ? res.json({
          usuario: {
            id: usuario._id,
            user: usuario.userName,
            rol: usuario.rol,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            foto: usuario.foto,
          telefono: usuario.telefono,
         mail: usuario.mail
      },
      }) //true
      : res.status(404).json({ error: "Usuario no encontrado" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

exports.findUserForJornada = async (id) => {
    try {
        //no usa req y res
        // Busca el usuario por ID y solo selecciona los campos necesarios para la inscripción
        const usuario = await Usuario.findById(id, 'userName nombre apellido');
        return usuario; // Retorna el objeto Mongoose o null/undefined si no lo encuentra
    } catch (err) {
        console.error("Error al buscar usuario para inscripción:", err);
    }
};

exports.getUsuarioByUsername = async (req, res) => {
  try {
    const { userName } = req.params;
    const usuario = await Usuario.findOne({ userName });
    usuario
      ? res.json({
          usuario: {
            id: usuario._id,
            user: usuario.userName,
            rol: usuario.rol,
            nombre: usuario.nombre + " " + usuario.apellido,
            foto: usuario.foto,
            telefono: usuario.telefono,
            mail: usuario.mail
      },
      }) //true
      : res.status(404).json({ error: "Usuario no encontrado" }); //false
  } catch (err) {
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

exports.getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
    usuario
      ? res.json({
          usuario: {
            id: usuario._id,
            user: usuario.userName,
            rol: usuario.rol,
            nombre: usuario.nombre + " " + usuario.apellido,
            foto: usuario.foto,
            telefono: usuario.telefono,
            mail: usuario.mail
          },
        }) //true
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

exports.registrar = async (req, res) => {
  try {
    const { userName, pass, rol, nombre, apellido, foto, telefono, mail } = req.body;
    if (!userName || !pass || !rol || !nombre || !apellido || !mail || !telefono) {
      res.status(400).json({ error: "Faltan campos obligatorios" }); //false
    }
    else{
      //Chequeo si existe el username
      const usuarioConUserNameIgual = await Usuario.findOne({ userName });

      if(!usuarioConUserNameIgual){
        const nuevoUsuario = new Usuario({ userName, pass, rol, nombre, apellido, foto, telefono, mail });
        await nuevoUsuario.save();
        res.status(201).json({
          message: "Usuario creado con éxito",
          usuario: {
            id: nuevoUsuario._id,
            user: nuevoUsuario.userName,
            rol: nuevoUsuario.rol,
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            foto: nuevoUsuario.foto,
            telefono: nuevoUsuario.telefono,
            mail: nuevoUsuario.mail
      },
      }); //true
      }
      else{ 
        res.status(400).json({ error: "El username ya existe" }); //false
      }
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};




//El userName no se modifica!
exports.updateUsuario = async (req, res) => {
  try {
    const id = req.user.id //id del token
    //const id = req.params.id; // Usar el ID de la URL
    const datosAActualizar = { ...req.body };
    //que no se guarde el userName
    delete datosAActualizar.userName;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, datosAActualizar, { new: true });
    if(usuarioActualizado)
    {
        res.json({
          usuarioActualizado: {
            id: usuarioActualizado._id,
            user: usuarioActualizado.userName,
            rol: usuarioActualizado.rol,
            nombre: usuarioActualizado.nombre,
            apellido: usuarioActualizado.apellido,
            foto: usuarioActualizado.foto,
            telefono: usuarioActualizado.telefono,
            mail: usuarioActualizado.mail
          }
        });
    }
    else
    {
      res.status(404).json({ error: "Usuario no encontrado" });
    }

  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

exports.updatePassword = async (req, res) => {
    try {
        //obtiene el id a traves del token
        const id = req.user.id
        const { pass } = req.body; 
        
        if (!pass) {
            return res.status(400).json({ error: "Debe ingresar la nueva contraseña" });
        }

        const datosAActualizar = { pass }; // Objeto solo con el campo 'pass'

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id, 
            datosAActualizar, 
            { 
                new: true,
                runValidators: true, // Ejecuta validaciones del modelo antes de actualizar
                // **CLAVE:** Excluir el campo 'pass' de la respuesta
                select: '-pass -__v' 
            }
        );

        if (usuarioActualizado) {
            // El usuario fue encontrado y actualizado. Lo devolvemos sin la contraseña.
            res.json({ message: "Contraseña actualizada correctamente" });
        } else {
            // No se encontró ningún usuario con ese ID
            res.status(404).json({ error: "Usuario no encontrado" });
        }

    } catch (err) {
        // En caso de errores de validación de Mongoose, el 500 se activa.
        console.error("Error en updatePassword:", err); 
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if(usuarioEliminado)
    {
      res.json({ message: "Usuario eliminado",
        usuarioEliminado:{
          id: usuarioEliminado._id,
          user: usuarioEliminado.userName,
          rol: usuarioEliminado.rol,
          nombre: usuarioEliminado.nombre,
          apellido: usuarioEliminado.apellido,
          telefono: usuarioEliminado.telefono,
          mail: usuarioEliminado.mail
        }}
      )
    }
    else{
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

//MisJuegos----------------------------------------------------------------------------------------
exports.getMisJuegos = async (req, res) => {
  try {
    const idUsuario = req.user.id; // Obtener el ID del usuario desde el token
    
    
    // 1. Busca el usuario por su ID trae el campo misJuegos
    const usuario = await Usuario.findById(idUsuario, 'misJuegos');

    // 2. Devuelve el array de juegos
    // usuario.misJuegos contendrá el array de subdocumentos
    res.json(usuario.misJuegos);
  } catch (err) {
    console.error("Error al obtener los juegos del usuario:", err);
    res.status(500).json({ error: "Error al obtener los juegos del usuario" });
  }
};

exports.agregarMisJuegos = async (req, res) => {
  try {
    //de a uno se suben
    const idUsuario = req.user.id; // Obtener el ID del usuario desde el token
    const { idJuego } = req.params; // Obtener el ID del juego desde los parámetros

    // Verificar que se envió al menos un juego
    if (!idJuego) {
      return res.status(400).json({ error: "Debe ingresar el id del juego" });
    }

    //FUNCION NUEVA - decir que paso un id, verifica si existe y me pasa el juego en un json
    //const flag = juegosServices.verificarExistenciaJuegos(juegos);
    //true: existen todos false:alguno no existe

    //if (!flag) {
      //res.status(400).json({ error: "El juego no existe" });
    //}else{
      //Obtengo el juego
      //const juego = await juegosServices.getJuegoById(idJuego);

      //Chequeo que el id no exista en el vector
      const juegoExiste = usuario.misJuegos.some(juego => juego.id.toString() === idJuego);
      if (juegoExiste) {
        res.status(400).json({ error: "El juego ya se encuentra en misJuegos" });
      }else{
        const juegosActualizados = await Usuario.findByIdAndUpdate(idUsuario, { $addToSet: { misJuegos: { $each: [juego] } } }, { new: true });
        res.json(juegosActualizados);
      }
      //}
  } catch (err) {
    console.error("Error al agregar juego a mis juegos:", err);
    res.status(500).json({ error: "Error al agregar juego a mis juegos" });
  }
};

exports.eliminarJuegoDeMisJuegos = async (req, res) => {
  try {
    const idUsuario = req.user.id; // Obtener el ID del usuario desde el token
    const { idJuego } = req.params; // Obtener el ID del juego a eliminar

    if (!idJuego) {
      res.status(400).json({ error: "Falta el ID del juego" });
    }
    else{
      //chequear que el id exista en el vector
      const usuario = await Usuario.findById(idUsuario);
      
      const juegoExiste = usuario.misJuegos.some(juego => juego.id.toString() === idJuego);

    if (!juegoExiste) {
      // Si el juego no está, notificamos y terminamos
      res.status(404).json({ error: "El juego no está en tu lista de 'misJuegos'." });
    }else{
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
            idUsuario, 
            { 
                // $pull encuentra y elimina el juego en misJuegos
                $pull: { 
                    misJuegos: { id: idJuego } 
                } 
            },
            { new: true } // Devuelve el documento después de la modificación
        );

        res.json(usuarioActualizado.misJuegos);
     
    }
  }
  } catch (err) {
    console.error("Error al eliminar juego de mis juegos:", err);
    res.status(500).json({ error: "Error al eliminar juego de mis juegos" });
  }
};