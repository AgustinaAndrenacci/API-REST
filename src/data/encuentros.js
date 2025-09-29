const encuentros = [
{
    "_id": 1,
    "capacidad":12,
    "tipo": "torneo",
    "id_juego": 1,
    "id_ganador": 5,
    "estado": "finalizado",
    "jugadores": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    "_id": 2,
    "tipo": "desafio",
    "id_juego": 2,
    "id_ganador": null,
    "estado": "pendiente",
    "jugadores": [2, 3]
  },
  {
    "_id": 3,
    "tipo": "desafio",
    "juego": [
        {"id_juego":"2","nombre":"ajedrez", "imagen":"https://drive.google.com/file/d/16w-scGS1g0Ys1KfDCt7o-uoqWucJ3lbG/view?usp=drive_link"}
    ],
    "ganador":[
        {"id_jugador":"1","nombre":"pepe"}
    ],
    "estado": "finalizado",
    "jugadores": [1, 5]
  },
  {
    "_id": 4,
    "tipo": "torneo",
    "id_juego": 4,
    "id_ganador": null,
    "estado": "en proceso",
    "jugadores": [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    "_id": 5,
    "tipo": "desafio",
    "id_juego": 5,
    "id_ganador": null,
    "estado": "en proceso",
    "jugadores": [10, 8]
  },
  {
    "_id": 6,
    "tipo": "torneo",
    "id_juego": 6,
    "id_ganador": 2,
    "estado": "finalizado",
    "jugadores": [2, 4, 6, 8, 10]
  },
  {
    "_id": 7,
    "tipo": "desafio",
    "id_juego": 7,
    "id_ganador": null,
    "estado": "pendiente",
    "jugadores": [7, 9]
  },
  {
    "_id": 8,
    "tipo": "torneo",
    "id_juego": 8,
    "id_ganador": 3,
    "estado": "finalizado",
    "jugadores": [1, 3, 5, 7, 9]
  },
  {
    "_id": 9,
    "tipo": "desafio",
    "id_juego": 9,
    "id_ganador": 6,
    "estado": "finalizado",
    "jugadores": [6, 10]
  },
  {
    "_id": 10,
    "tipo": "torneo",
    "id_juego": 10,
    "id_ganador": null,
    "estado": "en proceso",
    "jugadores": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
];

module.exports = encuentros;