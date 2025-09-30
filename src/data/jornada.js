const jornadas = [
  {
    "id": 1,
    "nombre": "Jornada solidaria de juegos “Estefánio Jimenes",
    "fechaHora": "2025-09-15T18:00:00",
    "precioInscripcion": 1200.0,
    "capacidad": 20,
    "Juegoteka": {
      "id": 2,
      "nombre": "Bruno",
      "direccion": "Av. Principal 1234"
    },
    "juegosDisponibles": [
      { "id": 2, "nombre": "Catan", "imagen": "catan.jpg" },
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" },
      { "id": 4, "nombre": "Dominó", "imagen": "domino.jpg" },
      { "id": 6, "nombre": "Poker", "imagen": "poker.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "userName": "user1", "nombre": "Agustina", "apellido": "Andrenacci" },
      { "id": 3, "userName": "user3", "nombre": "Carlos", "apellido": "Díaz" },
      { "id": 4, "userName": "user4", "nombre": "Elena", "apellido": "Gómez" }
    ],
    "encuentros": [
      { "id": 1, "tipo": "Desafio", "estado": "Finalizado" },
      { "id": 2, "tipo": "Torneo", "estado": "En proceso" },
      { "id": 3, "tipo": "Desafio", "estado": "Pendiente" }
    ]
  },
  {
    "id": 2,
    "nombre": "Té & TEG",
    "fechaHora": "2025-09-16T18:00:00",
    "precioInscripcion": 1300.0,
    "capacidad": 25,
    "Juegoteka": {
      "id": 2,
      "nombre": "Juegoteka Sur",
      "direccion": "Calle Falsa 789"
    },
    "juegosDisponibles": [
      { "id": 7, "nombre": "TEG", "imagen": "teg.jpg" },
      { "id": 8, "nombre": "Risk", "imagen": "risk.jpg" },
      { "id": 9, "nombre": "Go", "imagen": "go.jpg" },
      { "id": 10, "nombre": "Monopoly", "imagen": "monopoly.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 2, "nombre": "Bruno Martel" },
      { "id": 3, "nombre": "Carlos Díaz" },
      { "id": 4, "nombre": "Elena Gómez" },
      { "id": 5, "nombre": "David Pardo" },
      { "id": 6, "nombre": "Fernando Ruiz" },
      { "id": 7, "nombre": "Gabriela Castro" }
    ],
    "encuentros": [
      { "id": 4, "tipo": "Torneo", "estado": "Abierto" },
      { "id": 5, "tipo": "Desafio", "estado": "Cerrado" },
      { "id": 6, "tipo": "Torneo", "estado": "Pendiente" }
    ]
  },
  {
    "id": 3,
    "nombre": "Estrategas del Bondi 65",
    "fechaHora": "2025-09-17T18:00:00",
    "precioInscripcion": 1400.0,
    "capacidad": 30,
    "Juegoteka": {
      "id": 1,
      "nombre": "Juegoteka Central",
      "direccion": "Av. Principal 1234"
    },
    "juegosDisponibles": [
      { "id": 1, "nombre": "Damas", "imagen": "damas.jpg" },
      { "id": 2, "nombre": "Catan", "imagen": "catan.jpg" },
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" },
      { "id": 4, "nombre": "Dominó", "imagen": "domino.jpg" },
      { "id": 5, "nombre": "Backgammon", "imagen": "backgammon.jpg" },
      { "id": 6, "nombre": "Poker", "imagen": "poker.jpg" },
      { "id": 7, "nombre": "TEG", "imagen": "teg.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" },
      { "id": 10, "nombre": "Jorge Vidal" }
    ],
    "encuentros": [
      { "id": 7, "tipo": "Desafio", "estado": "En proceso" },
      { "id": 8, "tipo": "Torneo", "estado": "Pendiente" },
      { "id": 9, "tipo": "Desafio", "estado": "Abierto" }
    ]
  },
  {
    "id": 4,
    "nombre": "Tablero, Café y Debate",
    "fechaHora": "2025-09-18T18:00:00",
    "precioInscripcion": 1250.0,
    "capacidad": 18,
    "Juegoteka": {
      "id": 2,
      "nombre": "Juegoteka Sur",
      "direccion": "Calle Falsa 789"
    },
    "juegosDisponibles": [
      { "id": 1, "nombre": "Damas", "imagen": "damas.jpg" },
      { "id": 2, "nombre": "Catan", "imagen": "catan.jpg" },
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 2, "nombre": "Bruno Martel" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" }
    ],
    "encuentros": [
      { "id": 10, "tipo": "Torneo", "estado": "Finalizado" },
      { "id": 1, "tipo": "Desafio", "estado": "En proceso" },
      { "id": 2, "tipo": "Torneo", "estado": "Abierto" }
    ]
  },
  {
    "id": 5,
    "nombre": "Go,Go Go",
    "fechaHora": "2025-09-19T18:00:00",
    "precioInscripcion": 1350.0,
    "capacidad": 22,
    "Juegoteka": {
      "id": 1,
      "nombre": "Juegoteka Central",
      "direccion": "Av. Principal 1234"
    },
    "juegosDisponibles": [
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 2, "nombre": "Bruno Martel" },
      { "id": 3, "nombre": "Carlos Díaz" },
      { "id": 4, "nombre": "Elena Gómez" },
      { "id": 5, "nombre": "David Pardo" },
      { "id": 6, "nombre": "Fernando Ruiz" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" },
      { "id": 10, "nombre": "Jorge Vidal" }
    ],
    "encuentros": [
      { "id": 3, "tipo": "Torneo", "estado": "Finalizado" },
      { "id": 4, "tipo": "Desafio", "estado": "Cerrado" },
      { "id": 5, "tipo": "Torneo", "estado": "Pendiente" }
    ]
  },
  {
    "id": 6,
    "nombre": "La banda del Bridge",
    "fechaHora": "2025-09-20T18:00:00",
    "precioInscripcion": 1400.0,
    "capacidad": 28,
    "Juegoteka": {
      "id": 2,
      "nombre": "Juegoteka Sur",
      "direccion": "Calle Falsa 789"
    },
    "juegosDisponibles": [
      { "id": 7, "nombre": "TEG", "imagen": "teg.jpg" },
      { "id": 8, "nombre": "Risk", "imagen": "risk.jpg" },
      { "id": 9, "nombre": "Go", "imagen": "go.jpg" },
      { "id": 10, "nombre": "Monopoly", "imagen": "monopoly.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 2, "nombre": "Bruno Martel" },
      { "id": 3, "nombre": "Carlos Díaz" },
      { "id": 4, "nombre": "Elena Gómez" },
      { "id": 5, "nombre": "David Pardo" },
      { "id": 6, "nombre": "Fernando Ruiz" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" },
      { "id": 10, "nombre": "Jorge Vidal" }
    ],
    "encuentros": [
      { "id": 1, "tipo": "Desafio", "estado": "Finalizado" },
      { "id": 2, "tipo": "Torneo", "estado": "En proceso" },
      { "id": 3, "tipo": "Desafio", "estado": "Pendiente" }
    ]
  },
  {
    "id": 7,
    "nombre": "Burako, Café y Criptografía",
    "fechaHora": "2025-09-21T18:00:00",
    "precioInscripcion": 1300.0,
    "capacidad": 24,
    "Juegoteka": {
      "id": 1,
      "nombre": "Juegoteka Central",
      "direccion": "Av. Principal 1234"
    },
    "juegosDisponibles": [
      { "id": 1, "nombre": "Damas", "imagen": "damas.jpg" },
      { "id": 2, "nombre": "Catan", "imagen": "catan.jpg" },
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" },
      { "id": 4, "nombre": "Dominó", "imagen": "domino.jpg" },
      { "id": 5, "nombre": "Backgammon", "imagen": "backgammon.jpg" },
      { "id": 6, "nombre": "Poker", "imagen": "poker.jpg" },
      { "id": 7, "nombre": "TEG", "imagen": "teg.jpg" },
      { "id": 8, "nombre": "Risk", "imagen": "risk.jpg" },
      { "id": 9, "nombre": "Go", "imagen": "go.jpg" },
      { "id": 10, "nombre": "Monopoly", "imagen": "monopoly.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 2, "nombre": "Bruno Martel" },
      { "id": 3, "nombre": "Carlos Díaz" },
      { "id": 4, "nombre": "Elena Gómez" },
      { "id": 5, "nombre": "David Pardo" },
      { "id": 6, "nombre": "Fernando Ruiz" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" },
      { "id": 10, "nombre": "Jorge Vidal" }
    ],
    "encuentros": [
      { "id": 9, "tipo": "Torneo", "estado": "Pendiente" },
      { "id": 10, "tipo": "Desafio", "estado": "Finalizado" },
      { "id": 1, "tipo": "Torneo", "estado": "Abierto" }
    ]
  },
  {
    "id": 8,
    "nombre": "ScrabblePorteño",
    "fechaHora": "2025-09-22T18:00:00",
    "precioInscripcion": 1250.0,
    "capacidad": 20,
    "Juegoteka": {
      "id": 2,
      "nombre": "Juegoteka Sur",
      "direccion": "Calle Falsa 789"
    },
    "juegosDisponibles": [
      { "id": 1, "nombre": "Damas", "imagen": "damas.jpg" },
      { "id": 2, "nombre": "Catan", "imagen": "catan.jpg" },
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" },
      { "id": 4, "nombre": "Dominó", "imagen": "domino.jpg" },
      { "id": 5, "nombre": "Backgammon", "imagen": "backgammon.jpg" },
      { "id": 6, "nombre": "Poker", "imagen": "poker.jpg" },
      { "id": 7, "nombre": "TEG", "imagen": "teg.jpg" },
      { "id": 8, "nombre": "Risk", "imagen": "risk.jpg" },
      { "id": 9, "nombre": "Go", "imagen": "go.jpg" },
      { "id": 10, "nombre": "Monopoly", "imagen": "monopoly.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 2, "nombre": "Bruno Martel" },
      { "id": 3, "nombre": "Carlos Díaz" },
      { "id": 4, "nombre": "Elena Gómez" },
      { "id": 5, "nombre": "David Pardo" },
      { "id": 6, "nombre": "Fernando Ruiz" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" },
      { "id": 10, "nombre": "Jorge Vidal" }
    ],
    "encuentros": [
      { "id": 2, "tipo": "Torneo", "estado": "En proceso" },
      { "id": 3, "tipo": "Desafio", "estado": "Finalizado" },
      { "id": 4, "tipo": "Torneo", "estado": "Cerrado" }
    ]
  },
  {
    "id": 9,
    "nombre": "Pictionary nigth ; los Cubitos Cubistas",
    "fechaHora": "2025-09-23T18:00:00",
    "precioInscripcion": 1350.0,
    "capacidad": 26,
    "Juegoteka": {
      "id": 1,
      "nombre": "Juegoteka Central",
      "direccion": "Av. Principal 1234"
    },
    "juegosDisponibles": [
      { "id": 1, "nombre": "Damas", "imagen": "damas.jpg" },
      { "id": 2, "nombre": "Catan", "imagen": "catan.jpg" },
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" },
      { "id": 4, "nombre": "Dominó", "imagen": "domino.jpg" },
      { "id": 5, "nombre": "Backgammon", "imagen": "backgammon.jpg" },
      { "id": 6, "nombre": "Poker", "imagen": "poker.jpg" },
      { "id": 7, "nombre": "TEG", "imagen": "teg.jpg" },
      { "id": 8, "nombre": "Risk", "imagen": "risk.jpg" },
      { "id": 9, "nombre": "Go", "imagen": "go.jpg" },
      { "id": 10, "nombre": "Monopoly", "imagen": "monopoly.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 1, "nombre": "Ana López" },
      { "id": 2, "nombre": "Bruno Martel" },
      { "id": 3, "nombre": "Carlos Díaz" },
      { "id": 4, "nombre": "Elena Gómez" },
      { "id": 5, "nombre": "David Pardo" },
      { "id": 6, "nombre": "Fernando Ruiz" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" },
      { "id": 10, "nombre": "Jorge Vidal" }
    ],
    "encuentros": [
      { "id": 5, "tipo": "Torneo", "estado": "Pendiente" },
      { "id": 6, "tipo": "Desafio", "estado": "Finalizado" },
      { "id": 7, "tipo": "Torneo", "estado": "Abierto" }
    ]
  },
  {
    "id": 10,
    "nombre": "Truco, Mate y Memes Intelectuales",
    "fechaHora": "2025-09-24T18:00:00",
    "precioInscripcion": 1400.0,
    "capacidad": 30,
    "Juegoteka": {
      "id": 2,
      "nombre": "Juegoteka Sur",
      "direccion": "Calle Falsa 789"
    },
    "juegosDisponibles": [
      { "id": 1, "nombre": "Damas", "imagen": "damas.jpg" },
      { "id": 2, "nombre": "Catan", "imagen": "catan.jpg" },
      { "id": 3, "nombre": "Ajedrez", "imagen": "ajedrez.jpg" },
      { "id": 4, "nombre": "Dominó", "imagen": "domino.jpg" },
      { "id": 5, "nombre": "Backgammon", "imagen": "backgammon.jpg" },
      { "id": 6, "nombre": "Poker", "imagen": "poker.jpg" },
      { "id": 7, "nombre": "TEG", "imagen": "teg.jpg" },
      { "id": 8, "nombre": "Risk", "imagen": "risk.jpg" },
      { "id": 9, "nombre": "Go", "imagen": "go.jpg" },
      { "id": 10, "nombre": "Monopoly", "imagen": "monopoly.jpg" }
    ],
    "jugadoresInscriptos": [
      { "id": 4, "nombre": "Elena Gómez" },
      { "id": 5, "nombre": "David Pardo" },
      { "id": 6, "nombre": "Fernando Ruiz" },
      { "id": 7, "nombre": "Gabriela Castro" },
      { "id": 8, "nombre": "Héctor Pérez" },
      { "id": 9, "nombre": "Irene Torres" },
      { "id": 10, "nombre": "Jorge Vidal" }
    ],
    "encuentros": [
      { "id": 8, "tipo": "Torneo", "estado": "Pendiente" },
      { "id": 9, "tipo": "Desafio", "estado": "Cerrado" },
      { "id": 10, "tipo": "Torneo", "estado": "Finalizado" }
    ]
  }
];

module.exports = jornadas;