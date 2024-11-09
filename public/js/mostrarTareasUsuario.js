import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

async function mostrarTareasResponsable() {
    // Obtener el username del usuario en sesión
    const username = sessionStorage.getItem("usernameSesion");
    if (!username) {
      alert("Usuario no autenticado");
      return;
    }
  
    const tareasContainer = document.getElementById("historialTareasContainer");
    tareasContainer.innerHTML = ""; // Limpiar el contenedor de historial
  
    const gruposRef = ref(database, "grupos");
    try {
      const gruposSnapshot = await get(gruposRef);
  
      if (gruposSnapshot.exists()) {
        const grupos = gruposSnapshot.val();
  
        // Recorrer cada grupo
        for (let grupoId in grupos) {
          const grupo = grupos[grupoId];
          
          // Verificar si el grupo tiene tareas
          if (grupo.tareas) {
            for (let tareaId in grupo.tareas) {
              const tarea = grupo.tareas[tareaId];
              
              // Verificar si el usuario es responsable de la tarea
              if (tarea.responsable === username) {
                // Crear un elemento HTML para la tarea
                const tareaItem = document.createElement("div");
                tareaItem.classList.add("list-group-item");
                tareaItem.innerHTML = `
                  <h5>${tarea.titulo}</h5>
                  <p>Descripción: ${tarea.descripcion || "Sin descripción"}</p>
                  <p>Fecha límite: ${tarea.fecha_limite}</p>
                  <p>Estado: ${tarea.estado}</p>
                  <p>Grupo: ${grupo.nombre}</p>
                `;
                tareasContainer.appendChild(tareaItem); // Añadir la tarea al historial
              }
            }
          }
        }
  
        // Si no hay tareas donde el usuario sea responsable
        if (tareasContainer.innerHTML === "") {
          tareasContainer.innerHTML = "<p>No tienes tareas asignadas como responsable.</p>";
        }
      } else {
        tareasContainer.innerHTML = "<p>No hay grupos disponibles.</p>";
      }
    } catch (error) {
      console.error("Error al cargar las tareas del historial:", error);
    }
  }
  
  // Llama a la función para cargar el historial al cargar la página
  document.addEventListener("DOMContentLoaded", mostrarTareasResponsable);
  