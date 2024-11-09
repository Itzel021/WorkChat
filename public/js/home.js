
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { initAuth, getCurrentUser } from './auth.js';

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

const equiposContainer = document.getElementById("equiposContainer");

function verificarUsuarioAutenticado() {
  initAuth((user) => {
    if (user) {
      console.log("Usuario autenticado:", user.uid);
      mostrarEquipos(); // Llama a mostrarEquipos() solo si el usuario está autenticado
    } else {
      console.log("Usuario no autenticado");
      //window.location.href = "/login.html";
    }
  });
}

async function mostrarEquipos() {
  const user = getCurrentUser();
  if (!user) {
    alert("Usuario no autenticado");
    return;
  }

  const uid = user.uid;
  const usernameRef = ref(database, `usernames/${uid}`);
  const usernameSnapshot = await get(usernameRef);

  if (!usernameSnapshot.exists()) {
    alert("El usuario no tiene un username registrado.");
    return;
  }

  const username = usernameSnapshot.val(); // Username del usuario en sesión
  sessionStorage.setItem("usernameSesion", username);
  const equiposRef = ref(database, "grupos");
  const equiposSnapshot = await get(equiposRef);

  if (equiposSnapshot.exists()) {
    const equipos = equiposSnapshot.val();
    equiposContainer.innerHTML = "";

    // Recorrer y mostrar cada equipo
    for (const equipoId in equipos) {
      const equipo = equipos[equipoId];
      const esLider = equipo.lider === uid;
      const esMiembro = equipo.miembros && equipo.miembros[username];

      if (esLider || esMiembro) {
        const nombreEquipo = equipo.nombre;
        const equipoCard = document.createElement("div");
        equipoCard.className = "card card-equip mt-3";
        equipoCard.innerHTML = `
          <div class="card-body equipo" style="cursor: pointer;">
              <img src="./img/equip.jpg" alt="logo-equipo" class="img-fluid">
              <h5>${nombreEquipo}</h5>
          </div>
          <div class="card-footer text-muted d-flex justify-content-end card-footer-btn">
              ${esLider ? `
              <button class="chat-button btn-add-tarea">
                  <i class="fa-solid fa-plus-square"></i> Tarea
              </button>` : ""}
              <button class="chat-button btn-miembros-equip ms-3">
                  <i class="fa-solid fa-user-group"></i> Colaboradores
              </button>
              <button class="chat-button btn-chat-equip ms-3">
                  <i class="fa-regular fa-comment"></i> Chat
              </button>
          </div>
        `;

        if (esLider) {
          equipoCard.querySelector(".btn-add-tarea").addEventListener("click", () => {
            agregarTarea(equipoId);
          });
        }
        equipoCard.querySelector(".btn-miembros-equip").addEventListener("click", () => {
          miembrosEquipo(equipoId);
        });
        equipoCard.querySelector(".btn-chat-equip").addEventListener("click", () => {
          abrirChat(equipoId);
        });
        equipoCard.querySelector(".equipo").addEventListener("click", () => {
          abrirTareasEquipos(equipoId);
        });
        // Insertar la tarjeta de equipo en el contenedor
        equiposContainer.appendChild(equipoCard);
      }
    }
    // Si no pertenece a ningún equipo
    if (equiposContainer.innerHTML === "") {
      equiposContainer.innerHTML = "<p>No perteneces a ningún equipo.</p>";
    }
  } else {
    equiposContainer.innerHTML = "<p>No hay equipos disponibles.</p>";
  }
}

function miembrosEquipo(equipoId) {
  sessionStorage.setItem("equipoIdSeleccionado", equipoId);
  window.location.href = "../miembrosEquipo.html";
}

function abrirChat(equipoId) {
  sessionStorage.setItem("equipoIdSeleccionado", equipoId);
  window.location.href = "../chat.html";
}

function agregarTarea(equipoId) {
  sessionStorage.setItem("equipoIdSeleccionado", equipoId);
  window.location.href = "../crearTarea.html";
}

function abrirTareasEquipos(equipoId) {
  sessionStorage.setItem("equipoIdSeleccionado", equipoId);
  window.location.href = "../tareasEquipo.html";
}

window.addEventListener("load", verificarUsuarioAutenticado);