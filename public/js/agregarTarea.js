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

document.getElementById("guardarTarea").addEventListener("click", async function (event) {
  event.preventDefault();

  // Capturar los datos del formulario
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
  const miembrosRef = ref(database, `grupos/${equipoId}/miembros`);

  try {
    const miembrosSnapshot = await get(miembrosRef);

    if (!miembrosSnapshot.exists()) {
      alert("No se encontraron miembros para el equipo seleccionado.");
      return;
    }

    const miembros = miembrosSnapshot.val();

    if (!miembros.hasOwnProperty(responsable)) {
      alert("Este usuario no  está en el equipo seleccionado.");
      return;
    }
    
    const nuevaTarea = { // Estructura de la tarea
      titulo: nombreTarea,
      descripcion: descripcionTarea,
      responsable: responsable,
      estado: estado,
      fecha_limite: fecha
    };
    const tareasRef = ref(database, `grupos/${equipoId}/tareas`);

    const snapshot = await get(tareasRef); // Obtener las tareas actuales

    let nuevoIdTarea;
    if (snapshot.exists()) {
      const tareas = snapshot.val();
      const keys = Object.keys(tareas);

      const ultimoNumero = keys       // Buscar el número de la última tarea creada
        .filter(key => key.startsWith("Tarea"))
        .map(key => parseInt(key.replace("Tarea", "")))
        .sort((a, b) => b - a)[0];

      nuevoIdTarea = `Tarea${ultimoNumero + 1}`;
    } else {
      nuevoIdTarea = "Tarea1";
    }

    await set(ref(database, `grupos/${equipoId}/tareas/${nuevoIdTarea}`), nuevaTarea);
    alert("Tarea guardada exitosamente.");

    // Limpiar los campos del formulario
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