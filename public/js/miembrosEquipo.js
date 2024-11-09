import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get, remove, child, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

document.addEventListener("DOMContentLoaded", async () => {
    const equipoId = sessionStorage.getItem("equipoIdSeleccionado");
    
  if (!equipoId) {
    alert("No se seleccionó un equipo.");
    return;
  }

  const userIdSesion = sessionStorage.getItem("userIdSesion"); // Obtener UID del usuario en sesión
  const equipoRef = ref(database, `grupos/${equipoId}`);
  const equipoSnapshot = await get(equipoRef);

  if (!equipoSnapshot.exists()) {
    alert("No se encontró el equipo.");
    return;
  }

  const equipoData = equipoSnapshot.val();
  const esLider = equipoData.lider === userIdSesion; // Verificar si el usuario en sesión es el líder

  // Referencia a la lista de miembros del equipo
  const miembrosRef = ref(database, `grupos/${equipoId}/miembros`);
  const miembrosSnapshot = await get(miembrosRef);

  if (miembrosSnapshot.exists()) {
    const miembros = miembrosSnapshot.val();
    const miembrosContainer = document.querySelector(".miembros-lista");

    // Recorrer los miembros del equipo
    for (const username in miembros) {
      // Obtener los detalles del miembro desde la referencia en `users`
      const usuarioRef = ref(database, `users/${username}`);
      const usuarioSnapshot = await get(usuarioRef);

      if (usuarioSnapshot.exists()) {
        const usuarioData = usuarioSnapshot.val();

        // Crear tarjeta de miembro
        const miembroCard = document.createElement("div");
        miembroCard.classList.add("miembro-card");

        miembroCard.innerHTML = `
          <div class="card" style ="min-height: 200px;">
            <div class="card-body">
              <h5 class="card-title">${usuarioData.nombre} ${usuarioData.apellidos}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Username: ${username}</h6>
              <p class="card-text">Email: ${usuarioData.email}</p>
              ${
                esLider
                  ? `<button class="btn btn-danger btn-sm eliminar-miembro" data-username="${username}">Eliminar Miembro</button>`
                  : ""
              }
            </div>
          </div>
        `;

        miembrosContainer.appendChild(miembroCard);
      }
    }

    // Añadir evento para eliminar miembro solo si el usuario en sesión es líder
    if (esLider) {
      document.querySelectorAll(".eliminar-miembro").forEach((button) => {
        button.addEventListener("click", async (e) => {
          const username = e.target.getAttribute("data-username");
          const miembroRef = ref(database, `grupos/${equipoId}/miembros/${username}`);

          // Confirmación antes de eliminar
          if (confirm(`¿Estás seguro de eliminar a ${username} del equipo?`)) {
            try {
              // Eliminar miembro de la base de datos
              await remove(miembroRef);
              
              // Mostrar mensaje de éxito
              alert(`Miembro ${username} eliminado exitosamente.`);
              
              // Remover la tarjeta de miembro del DOM
              e.target.closest(".miembro-card").remove();
            } catch (error) {
              console.error("Error al eliminar miembro:", error);
              alert("Hubo un error al eliminar al miembro.");
            }
          }
        });
      });
    }
  } else {
    // Si no hay miembros en el equipo, mostrar mensaje
    alert("Este equipo no tiene miembros.");
  }
});

document.getElementById("addMiembro").addEventListener("click", async () => {
    // Obtener correo del colaborador desde el input
    const email = document.getElementById("emailColaborador").value.trim();
    if (!email) {
      alert("Por favor ingresa un correo electrónico.");
      return;
    }
  
    // Referencia a la base de datos
    const dbRef = ref(database);
  
    try {
      // Buscar usuario en la base de datos por correo electrónico
      const usersSnapshot = await get(child(dbRef, "users"));
      let usernameEncontrado = null;
  
      usersSnapshot.forEach((childSnapshot) => {
        const usuario = childSnapshot.val();
        if (usuario.email === email) {
          usernameEncontrado = childSnapshot.key;  // username es la clave de la referencia
        }
      });
  
      if (!usernameEncontrado) {
        alert("No se encontró un usuario con ese correo electrónico.");
        return;
      }
  
      // Obtener el ID del equipo seleccionado
      const equipoId = sessionStorage.getItem("equipoIdSeleccionado");
      if (!equipoId) {
        alert("No se seleccionó un equipo.");
        return;
      }
  
      // Referencia a los miembros del equipo
      const equipoRef = ref(database, `grupos/${equipoId}/miembros`);
  
      // Verificar si el usuario ya es miembro del equipo
      const miembrosSnapshot = await get(equipoRef);
      const miembros = miembrosSnapshot.val() || {};
  
      if (miembros[usernameEncontrado]) {
        alert("Este usuario ya es miembro del equipo.");
        return;
      }
  
      // Agregar al usuario como miembro del equipo
      await set(ref(database, `grupos/${equipoId}/miembros/${usernameEncontrado}`), true);
  
      // Confirmar éxito
      alert(`El miembro con username ${usernameEncontrado} ha sido agregado exitosamente.`);
      
      // Limpiar el input de correo
      document.getElementById("emailColaborador").value = "";
    } catch (error) {
      console.error("Error al agregar miembro:", error);
      alert("Hubo un error al agregar al miembro.");
    }
  });
  