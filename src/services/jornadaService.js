//codigo que verifique si dada una jornada, y un body:
    //en el body recibe capacidad, que la misma no sea menor a los jugadores inscriptos
    //que en el return devuelva la jornada como deberia quedar
//creame la funcion completa del service:

// src/services/jornadaService.js
const validarJornada = (jornadaExistente, body) => {

  const nuevaCapacidad = body.capacidad;

  // Solo valida si la capacidad está presente en el body
  if (nuevaCapacidad !== undefined) {
    const jugadoresActuales = jornadaExistente.jugadoresInscriptos.length;

    if (jugadoresActuales > nuevaCapacidad) {
      // Usar un Error de JavaScript estándar para indicar el fallo
      const errorMessage = `La capacidad (${nuevaCapacidad}) no puede ser menor a los ${jugadoresActuales} jugadores ya inscriptos.`;
      
      throw new Error(errorMessage);
    }
  }

  // Devolver el cuerpo para que el controlador lo use en la actualización
  return body;
};

module.exports = { validarJornada };