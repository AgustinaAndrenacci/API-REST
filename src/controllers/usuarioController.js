const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuarioModel");
const usuarioService = require("../services/usuarioService");
const jornadaService = require("../services/jornadaService");
const juegoService = require("../services/juegosService");
const juegoModel = require("../models/juegoModel");
const { showErrorMessage } = require("../errorHandler");

exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    //muestra sin la password
    //el admin puede ver con otro formato mas completo
    if (req.user.rol === "administrador") {
      res.json(usuarios.map(usuarioService.formatoJsonUsuarioPersonalizado));
    } else {
      res.json(usuarios.map(usuarioService.formatoJsonUsuarioGeneral));
    }
    //map: aplica la funcion formatoJsonUsuario a cada elemento del array usuarios
  } catch (err) {
    console.error("Error al obtener usuarios", err);
    showErrorMessage(res, 500, "Error al obtener usuarios");
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    usuario
      ? res.json(usuarioService.formatoJsonUsuarioGeneral(usuario)) //true
      : showErrorMessage(res, 404, "Usuario no encontrado"); 
  } catch (err) {
    showErrorMessage(res, 500, "Error al buscar usuario");
  }
};

exports.getUsuarioByUsername = async (req, res) => {
  try {
    const userName = req.params; 
    const usuario = await usuarioService.getUsuarioByUsername(userName);
    usuario
      ? res.json(usuarioService.formatoJsonUsuarioGeneral(usuario)) //true
      : showErrorMessage(res, 404, "Usuario no encontrado"); //false
  } catch (err) {
    showErrorMessage(res, 500, "Error al buscar usuario");
  }
};

exports.getAllJuegotekas = async (req, res) => {
  try {
    const usuarios = await usuarioService.getUsuarioByTipo("juegoteka");
    //muestra sin la password
    res.json(usuarios.map(usuarioService.formatoJsonUsuarioPersonalizado));
    //map: aplica la funcion formatoJsonUsuario a cada elemento del array usuarios
  } catch (err) {
    console.error("Error al obtener usuarios", err);
    showErrorMessage(res, 500, "Error al obtener usuarios");
  }
};

exports.getAllJugadores = async (req, res) => {
  try {
    const usuarios = await usuarioService.getUsuarioByTipo("jugador");
    //muestra sin la password
    res.json(usuarios.map(usuarioService.formatoJsonUsuarioGeneral));
    //map: aplica la funcion formatoJsonUsuario a cada elemento del array usuarios
  } catch (err) {
    console.error("Error al obtener usuarios", err);
    showErrorMessage(res, 500, "Error al obtener usuarios");
  }
};

exports.getPerfil = async (req, res) => {
  try {
    //getPerfil obtiene el id del token
    const usuario = await usuarioService.getUsuarioById(req.user.id);
    usuario
      ? res.json(usuarioService.formatoJsonUsuarioPersonalizado(usuario)) //true
      : showErrorMessage(res, 404, "Usuario no encontrado"); //false
  } catch (err) {
    showErrorMessage(res, 500, "Error al buscar usuario");
  }
};

exports.login = async (req, res) => {
  try {
    //desestructuracion en javascript
    const { userName, pass } = req.body; //cuando hay + de un parametro
            //campo del postman, puedo cambiar alli el nombre y aca tambien

    //chequeo que ingreso los datos pedidos
    if (!userName || !pass) {
      showErrorMessage(res, 400, "Faltan campos obligatorios");
    }else{
    //busco usuario
    const usuario = await usuarioService.getUsuarioByUsername({userName});
    if(!usuario){
      showErrorMessage(res, 401, "Username incorrecto");
    }
    else{
      //verificar contra (comparo hash)
      //encripto la otra y compara, no se desencripta nada
      //si cuando se registra hasheo la contraseña
      
      const isMatch = await bcrypt.compare(pass,usuario.pass);
      if (!isMatch){
        showErrorMessage(res, 401, "Contraseña incorrecta");
      }
      else{

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
          usuario: usuarioService.formatoJsonUsuarioPersonalizado(usuario)
          }
        );
      }
    }}
  } catch (err) {
    console.error("Error en el login", err); //NUEVO
    showErrorMessage(res, 500, "Error al buscar usuario");
  }
};

exports.registrar = async (req, res) => {
  try {
    const { userName, pass, rol, nombre, apellido, direccion, foto, telefono, mail } = req.body;
    if (!userName || !pass || !rol || !nombre || !apellido || !mail || !telefono || !direccion) {
      showErrorMessage(res, 400, "Faltan campos obligatorios");
    }
    else{
      //Chequeo si existe el username
      const usuarioConUserNameIgual = await usuarioService.getUsuarioByUsername({userName});

      if(!usuarioConUserNameIgual){
        //Chequeo si el rol es válido
        const rolValido = await usuarioService.estadosValidos(rol);
        if (!rolValido) {
          showErrorMessage(res, 400, "Rol inválido");
        }else{
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10); 
        //genSalt(10): genera un salt de 10 rondas. 
        // salt es: un valor aleatorio que se utiliza para aumentar la seguridad
        //  del hash
        const hashPass = await bcrypt.hash(pass, salt);

        const nuevoUsuario = new Usuario({ userName, pass: hashPass, rol, nombre, apellido, direccion,foto, telefono, mail });
        //await nuevoUsuario.save();
        const newUsuario = await usuarioService.createUsuario(nuevoUsuario);
        res.status(200).json({
          message: "Usuario creado con éxito",
          usuario: usuarioService.formatoJsonUsuarioPersonalizado(newUsuario)
        }); //true
      }}
      
      else {
        showErrorMessage(res, 400, "El username ya existe");
      }
    }
    
  } catch (err) {
    console.error(err);
    showErrorMessage(res, 500, "Error al crear usuario");
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
    delete datosAActualizar.pass;

    const usuarioActualizado = await usuarioService.updateUsuarioById(id, datosAActualizar);
    if(usuarioActualizado)
    {    
        //Chequeo si hay datos del usuario a modificar en la jornada
        const hayDatosAModificar = await usuarioService.hayDatosAModificarEnJornada(datosAActualizar);
        if (hayDatosAModificar) {
          //Se modifican todos los datos de Juegoteka en las jornadas activas
          await jornadaService.modificaDatosEnJornadaActiva(usuarioActualizado);
        }

        //muestro json final
        res.json(usuarioService.formatoJsonUsuarioPersonalizado(usuarioActualizado));
    }
    else
    {
      showErrorMessage(res, 404, "Usuario no encontrado");
    }

  } catch (err) {
    showErrorMessage(res, 500, "Error al actualizar usuario");
  }
};

exports.updatePassword = async (req, res) => {
    try {
        const id = req.user.id; // ID del usuario a través del token
        const { passVieja, passNueva } = req.body;

        // valido los datos ingresados
        if (!passVieja || !passNueva) {
            showErrorMessage(res, 400, "Debe ingresar la contraseña actual y la nueva contraseña");
        }else{
          // Busco el usuario
          const user = await usuarioService.getUsuarioById(id);

          //Comparo la contraseña antigua
          const isMatch = await bcrypt.compare(passVieja, user.pass);
          if (!isMatch) {
              showErrorMessage(res, 401, "La contraseña actual es incorrecta");
          }else{
            //chequeo que la pass nueva no sea igual que la anterior
            const isMatchNueva = await bcrypt.compare(passNueva, user.pass);
            if (isMatchNueva) {
              showErrorMessage(res, 400, "La nueva contraseña no puede ser igual a la anterior");
            }else{
              //actualizo la nueva contraseña
              const salt = await bcrypt.genSalt(10);
              //genSalt(10): genera un salt de 10 rondas. 
            // salt es: un valor aleatorio que se utiliza para aumentar la seguridad
            //  del hash
              const hashPass = await bcrypt.hash(passNueva, salt);

              // Guardo
              const usuarioActualizado = await usuarioService.updateUsuarioById(id, { pass: hashPass });

            // 6. Respuesta
            res.json({ message: "Contraseña actualizada correctamente" });

          }}

        }   
    } catch (err) {
        showErrorMessage(res, 500, "Error al actualizar la contraseña");
    }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await usuarioService.deleteUsuarioById(req.params.id);
    if(usuarioEliminado)
    {
      res.json(usuarioService.formatoJsonUsuarioPersonalizado(usuarioEliminado));
    }
    else{
      showErrorMessage(res, 404, "Usuario no encontrado");
    }
  } catch (err) {
    showErrorMessage(res, 500, "Error al eliminar usuario");
  }
};

//MisJuegos----------------------------------------------------------------------------------------
exports.getMisJuegos = async (req, res) => {
  try {
    const idUsuario = req.user.id; // Obtener el ID del usuario desde el token
    
    // 1. Busca el usuario por su ID
    const usuario = await usuarioService.getUsuarioById(idUsuario);

    // 2. Devuelve el array de juegos
    // usuario.misJuegos contendrá el array de subdocumentos
    res.json(usuario.misJuegos);

  } catch (err) {
    console.error("Error al obtener los juegos del usuario:", err);
    showErrorMessage(res, 500, "Error al obtener los juegos del usuario");
  }
};

exports.agregarMisJuegos = async (req, res) => {
  try {
    //de a uno se suben
    const idUsuario = req.user.id; // Obtener el ID del usuario desde el token
    const  {idJuego}  = req.params; // Obtener el ID del juego desde los parámetros

    //chequeo que existe el juego en la bd
    const juegoExisteEnBd = await juegoService.verificarExistenciaJuego(idJuego);
    if (!juegoExisteEnBd) {
      showErrorMessage(res, 404, "El juego no existe");
    }else{
    //const juegoNuevo = await Juego.getJuegoById(idJuego);
    //necesito un service
    const juegoNuevo = await juegoModel.findById(idJuego);
    // res.json( juegoNuevo );
      
    if (juegoNuevo){
      //busco el usuario
      const user = await Usuario.findById(idUsuario);
      //Chequeo que el id no exista en el vector
      const juegoExiste = user.misJuegos.some(juego => juego._id.toString() === idJuego);
      if (juegoExiste) {
        showErrorMessage(res, 400, "El juego ya se encuentra en misJuegos");
      }else{
        const juegosActualizados = await Usuario.findByIdAndUpdate(idUsuario, { $addToSet: { misJuegos: { $each: [juegoNuevo] } } }, { new: true });
        res.json(juegosActualizados.misJuegos);
      }
    }else{
      showErrorMessage(res, 404, "Juego no encontrado");
    }
  }
  } catch (err) {
    console.error("Error al agregar juego a mis juegos:", err);
    showErrorMessage(res, 500, "Error al agregar juego a mis juegos");
  }
};

exports.eliminarJuegoDeMisJuegos = async (req, res) => {
  try {
    const idUsuario = req.user.id; // Obtener el ID del usuario desde el token
    const { idJuego } = req.params; // Obtener el ID del juego a eliminar

    //busco al usuario
    const user = await usuarioService.getUsuarioById(idUsuario);
  
    //chequear que el id exista en el vector
    const juegoExiste = user.misJuegos.some(juego => juego._id.toString() === idJuego);

    if (!juegoExiste) {
      // Si el juego no está, notificamos y terminamos
      showErrorMessage(res, 404, "El juego no está en tu lista de 'misJuegos'.");
    }else{
      const juegosActualizados = await usuarioService.deleteMisJuegos(idUsuario, idJuego);
      res.json({ message: "Juego eliminado correctamente" });
    }
  } catch (err) {
    console.error(err);
    showErrorMessage(res, 500, "Error al eliminar juego de mis juegos");
  }
};