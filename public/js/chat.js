import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, push, set, get, onChildAdded } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJFw4Tr8d0-2NLtaUAgU15W2t7zaOJ79g",
  authDomain: "workchat-c8c72.firebaseapp.com",
  databaseURL: "https://workchat-c8c72-default-rtdb.firebaseio.com",
  projectId: "workchat-c8c72",
  storageBucket: "workchat-c8c72.appspot.com",
  messagingSenderId: "469035320450",
  appId: "1:469035320450:web:067dd30ab4c6e19541a09b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Función para enviar un mensaje
function enviarMensaje(grupoId, userId, nombre, mensaje) {
    const timestamp = new Date().toISOString();
    const mensajesRef = ref(database, `grupos/${grupoId}/mensajes`);
    const nuevoMensajeRef = push(mensajesRef);

    set(nuevoMensajeRef, {
        userId: userId,
        nombre: nombre,
        mensaje: mensaje,
        timestamp: timestamp
    });
}

// Función para escuchar mensajes nuevos
function escucharMensajes(grupoId, callback) {
    const mensajesRef = ref(database, `grupos/${grupoId}/mensajes`);
    
    onChildAdded(mensajesRef, (snapshot) => {
        const mensaje = snapshot.val();
        callback(mensaje);
    });
}

// Agregar el evento de envío de mensaje
document.getElementById("enviarBtn").addEventListener("click", () => {
    const grupoId = sessionStorage.getItem("equipoIdSeleccionado");
    const userId = sessionStorage.getItem("userIdSesion");
    const nombre = sessionStorage.getItem("nombreUsuarioSesion");
    const mensaje = document.getElementById("mensajeInput").value;

    if (mensaje.trim() !== "") {
        enviarMensaje(grupoId, userId, nombre, mensaje);
        document.getElementById("mensajeInput").value = "";
    } else {
        alert("El mensaje no puede estar vacío.");
    }
});

// Función para mostrar mensaje en el chat
function mostrarMensaje(mensaje) {
    const mensajesDiv = document.getElementById("mensajes");
    const mensajeDiv = document.createElement("div");
    mensajeDiv.classList.add("mensaje");

    mensajeDiv.innerHTML = `
        <strong>${mensaje.nombre}</strong>: ${mensaje.mensaje} <br>
        <small>${new Date(mensaje.timestamp).toLocaleTimeString()}</small>
    `;

    mensajesDiv.appendChild(mensajeDiv);
    mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
}

// Función para listar miembros del equipo con su última conexión
async function listarMiembrosConUltimaConexion() {
  const grupoId = sessionStorage.getItem("equipoIdSeleccionado");
  if (!grupoId) {
      alert("No se ha seleccionado un grupo.");
      return;
  }

  const miembrosRef = ref(database, `grupos/${grupoId}/miembros`);
  const miembrosSnapshot = await get(miembrosRef);

  const listaMiembros = document.getElementById("listaMiembros");
  listaMiembros.innerHTML = ""; // Limpiar lista antes de agregar miembros

  if (miembrosSnapshot.exists()) {
      const miembros = miembrosSnapshot.val();

      // Para cada miembro del equipo, obtener su última conexión desde 'users'
      for (const username in miembros) {
          const userRef = ref(database, `users/${username}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
              const userData = userSnapshot.val();
              const ultimaConexion = userData.last_logout
                  ? new Date(userData.last_logout).toLocaleString()
                  : "Desconocido";
              
              const listItem = document.createElement("li");
              listItem.innerHTML = `<strong>${username}</strong><br><small>Última conexión: ${ultimaConexion}</small>`;
              listaMiembros.appendChild(listItem);
          } else {
              console.warn(`No se encontró información para el usuario: ${username}`);
          }
      }
  } else {
      listaMiembros.innerHTML = "<li>No hay miembros en este equipo.</li>";
  }
}

// Ejecutar cuando la página se haya cargado
document.addEventListener("DOMContentLoaded", () => {
    const grupoId = sessionStorage.getItem("equipoIdSeleccionado");

    if (grupoId) {
        escucharMensajes(grupoId, mostrarMensaje);
        listarMiembrosConUltimaConexion(); // Llama a la función para listar miembros
    } else {
        alert("No se ha seleccionado un grupo.");
    }
});
