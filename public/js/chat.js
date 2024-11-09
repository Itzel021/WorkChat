import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded  } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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
  
  function escucharMensajes(grupoId, callback) {
    const mensajesRef = ref(database, `grupos/${grupoId}/mensajes`);
    
    onChildAdded(mensajesRef, (snapshot) => {
      const mensaje = snapshot.val();
      callback(mensaje);
    });
  }
  
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
  
  document.addEventListener("DOMContentLoaded", () => {
    const grupoId = sessionStorage.getItem("equipoIdSeleccionado");
    
    if (grupoId) {
      escucharMensajes(grupoId, mostrarMensaje);
    } else {
      alert("No se ha seleccionado un grupo.");
    }
  });