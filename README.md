# Bienvenidos a la JuegotekAPI! :game_die: :black_joker:
# Programación 3.603 | 2025

---

## :bookmark_tabs: Indice: 
- [Autores](#busts_in_silhouette-autores) 
- [Descripción general del proyecto](#clipboardpaperclip-descripción-general-del-proyecto)  
- [Tecnologías](#wrenchhammer-tecnologías-utilizadas)
- [Estructura de directorios](#file_folderpushpin-estructura-de-directorios)   
- [Documentacion API](#mag_rightnotebook_with_decorative_cover-documentación-api)  
- [Setup del entorno](#setup-del-entorno)
- [Autenticación](#-autenticación)  
- [Deployment](#deployment)  

---

## :busts_in_silhouette: Autores:
Federico Nadal | :computer: [GitHub](https://github.com/FedericoNadal)  
Agustina Andrenacci | :computer: [GitHub](https://github.com/AgustinaAndrenacci)  
Guillermo Iribarne | :computer: [GitHub](https://github.com/WillIribarne)  

---

## :clipboard::paperclip: Descripción general del proyecto:

Este proyecto fue pensado como una idea para ayudar a la comunidad de jugadores de juegos de mesa, que deseen buscar encuentros y situaciones para poder jugar con otras personas. Esto permite que tanto jugadores como organizadores puedan encontrar una forma de conectarse mucho más ágil, segura y eficaz que con los métodos tradicionales de comunicación. 

### Si sos jugador... :raising_hand:
La aplicación final permitirá a un usuario ingresar como jugador a una plataforma, tener su propio perfil con sus juegos favoritos, y poder anotarse a jornadas creadas. También, una vez en una jornada, el jugador puede crear desafíos con otras personas dentro de esa misma jornada.

### Si sos organizador... :office:
La aplicación final te permitirá organizar jornadas, agregar juegos que tengas en tu negocio a nuestra base de datos, y poder organizar los encuentros según los juegos que dispongas y quieras gestionar. 

---
## :wrench::hammer: Tecnologías utilizadas:

Entorno de desarrollo JavaScript [![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
Motor de base de datos NoSQL [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-blue)](https://www.mongodb.com/)
Framework de desarrollo web Node.js [![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)

---

## :file_folder::pushpin: Estructura de directorios:

![Mi Imagen](./assets/img/directoryManagement.jpg)

---

## :mag_right::notebook_with_decorative_cover: Documentación API:

[![Postman](https://img.shields.io/badge/Postman-API_Docs-orange)](https://documenter.getpostman.com/view/38998120/2sB3WpSgnK)  

---

## :pencil: Setup del entorno:

1. **Clonar el repositorio usando git**:  
   ```bash  
   git clone https://github.com/AgustinaAndrenacci/API-REST
   ```  

2. **Instalar dependencias**:  
   ```bash  
   npm install  
   ```  

3. **Establecer variables de entorno (.env)**:  
   Create a `.env` file:  
   ```env  
   PORT=4000  
   SECRETKEY=your_JWT_secret_key 
   DB_USER=your_MongoDB_user
   ```  

4. **Iniciar el servidor de desarrollo**:  
   ```bash  
   npm run devstart
   ```  

---

## :cop: Autenticación:

- **JWT Tokens**: Utilizamos JWT Tokens para realizar autenticación de usuarios.   
  ```  
  Authorization: Bearer <token>
  ```  
- **Bcrypt**: Utilizamos Bcrypt para encriptar las contraseñas de los usuarios.

---

## :link::cloud: Deployment:

El deployment se realiza utilizando Render, con base de datos MongoDB Atlas.

### Pasos a realizar:  
1. **MongoDB Atlas**:  
   - Crear un cluster de MongoDB en la nube. Esto permitira la integración de la base de datos con la aplicación.
2. **Render**:  
   - Interlace su link de aplicación remota en Github con Render..
   - Agregue sus variables de entorno (.env) a Render.  
   - Listo! Aplicación desplegada.