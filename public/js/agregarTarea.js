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

// Función para listar miembros en el select de "responsable"
async function cargarMiembros() {
  const equipoId = sessionStorage.getItem("equipoIdSeleccionado");
  if (!equipoId) {
    alert("No se seleccionó un equipo.");
    return;
  }

  const miembrosRef = ref(database, `grupos/${equipoId}/miembros`);
  const miembrosSnapshot = await get(miembrosRef);

  const selectResponsable = document.getElementById("responsable");
  selectResponsable.innerHTML = '<option value="">Seleccione un miembro</option>'; // Limpiar opciones previas

  if (miembrosSnapshot.exists()) {
    const miembros = miembrosSnapshot.val();
    for (const username in miembros) {
      const option = document.createElement("option");
      option.value = username;
      option.textContent = username;
      selectResponsable.appendChild(option);
    }
  } else {
    alert("Este equipo no tiene miembros.");
  }
}

// Llamada a la función para cargar los miembros al cargar la página
document.addEventListener("DOMContentLoaded", cargarMiembros);

document.getElementById("guardarTarea").addEventListener("click", async function (event) {
  event.preventDefault();

  const nombreTarea = document.getElementById("nombreTarea").value;
  const descripcionTarea = document.getElementById("descripcionTarea").value;
  const responsable = document.getElementById("responsable").value.trim();
  const estado = document.getElementById("estado").value;
  const fecha = document.getElementById("fecha").value;

  if (!nombreTarea || !descripcionTarea || !responsable || !estado || !fecha) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const equipoId = sessionStorage.getItem("equipoIdSeleccionado");
  const tareasRef = ref(database, `grupos/${equipoId}/tareas`);

  try {
    const snapshot = await get(tareasRef);
    let nuevoIdTarea;
    if (snapshot.exists()) {
      const tareas = snapshot.val();
      const ultimoNumero = Object.keys(tareas)
        .filter(key => key.startsWith("Tarea"))
        .map(key => parseInt(key.replace("Tarea", "")))
        .sort((a, b) => b - a)[0];
      nuevoIdTarea = `Tarea${ultimoNumero + 1}`;
    } else {
      nuevoIdTarea = "Tarea1";
    }

    const nuevaTarea = {
      titulo: nombreTarea,
      descripcion: descripcionTarea,
      responsable: responsable,
      estado: estado,
      fecha_limite: fecha
    };

    await set(ref(database, `grupos/${equipoId}/tareas/${nuevoIdTarea}`), nuevaTarea);
    alert("Tarea guardada exitosamente.");

    document.getElementById("nombreTarea").value = "";
    document.getElementById("descripcionTarea").value = "";
    document.getElementById("responsable").value = "";
    document.getElementById("estado").value = "pendiente";
    document.getElementById("fecha").value = "";
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
    alert("Ocurrió un error al guardar la tarea.");
  }
});
