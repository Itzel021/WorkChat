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

const equipoId = sessionStorage.getItem("equipoIdSeleccionado");
const usernameSesion = sessionStorage.getItem("usernameSesion");
const tareasRef = ref(database, `grupos/${equipoId}/tareas`);

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const snapshot = await get(tareasRef);

        if (snapshot.exists()) {
            const tareas = snapshot.val();

            const pendientesList = document.querySelector("#pendientes");
            const enCursoList = document.querySelector("#enCurso");
            const hechoList = document.querySelector("#hecho");

            for (let tareaId in tareas) {
                const tarea = tareas[tareaId];
                const listItem = crearElementoTarea(tareaId, tarea);
                listItem.addEventListener("click", () => mostrarDetallesTarea(tarea));

                // Insertar la tarea en la lista correspondiente
                if (tarea.estado === "pendiente") {
                    pendientesList.appendChild(listItem);
                } else if (tarea.estado === "en-curso") {
                    enCursoList.appendChild(listItem);
                } else if (tarea.estado === "hecho") {
                    hechoList.appendChild(listItem);
                }
            }
        } else {
            console.log("No hay tareas para este equipo.");
        }
    } catch (error) {
        console.error("Error al cargar las tareas:", error);
    }
});

function crearElementoTarea(tareaId, tarea) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.innerHTML = `${tarea.titulo} `;
    listItem.style.cursor = "pointer";

    if (tarea.responsable === usernameSesion && (tarea.estado === "pendiente" || tarea.estado === "en-curso")) {
        const button = document.createElement("button");

        if (tarea.estado === "pendiente") {
            button.textContent = "Comenzar";
            button.classList.add("btn", "btn-sm", "btn-success");

            button.addEventListener("click", async () => {
                await actualizarEstadoTarea(tareaId, "en-curso", listItem, tarea.titulo);
            });

        } else if (tarea.estado === "en-curso") {
            button.textContent = "Finalizar";
            button.classList.add("btn", "btn-sm", "btn-danger");

            button.addEventListener("click", async () => {
                await actualizarEstadoTarea(tareaId, "hecho", listItem, tarea.titulo);
            });
        }

        listItem.appendChild(button);
    }

    return listItem;
}

async function actualizarEstadoTarea(tareaId, nuevoEstado, listItem, titulo) {
    const tareaRef = ref(database, `grupos/${equipoId}/tareas/${tareaId}/estado`);
    await set(tareaRef, nuevoEstado);

    // Actualizar la interfaz moviendo la tarea a la lista correspondiente
    const pendientesList = document.querySelector("#pendientes");
    const enCursoList = document.querySelector("#enCurso");
    const hechoList = document.querySelector("#hecho");

    // Actualizar el contenido y mover el elemento de lista
    listItem.innerHTML = `${titulo} `;

    if (nuevoEstado === "hecho") {
        // Eliminar el botón al marcar la tarea como "hecho"
        const buttons = listItem.getElementsByTagName("button");
        while (buttons.length > 0) {
            buttons[0].parentNode.removeChild(buttons[0]);
        }
        hechoList.appendChild(listItem);
    } else if (nuevoEstado === "en-curso") {
        // Si la tarea está en "en-curso", mostramos el botón "Finalizar"
        const button = document.createElement("button");
        button.textContent = "Finalizar";
        button.classList.add("btn", "btn-sm", "btn-danger");

        button.addEventListener("click", async () => {
            await actualizarEstadoTarea(tareaId, "hecho", listItem, titulo);
        });

        listItem.appendChild(button);
        enCursoList.appendChild(listItem);
    }
}
// Función para mostrar los detalles de la tarea
function mostrarDetallesTarea(tarea) {
    const detalleDiv = document.getElementById("detalleTarea");

    document.getElementById("detalleTitulo").textContent = `Título: ${tarea.titulo}`;
    document.getElementById("detalleDescripcion").textContent = `Descripción: ${tarea.descripcion || "No hay descripción disponible"}`;
    document.getElementById("detalleFecha").textContent = `Fecha de Entrega: ${tarea.fecha_limite}`;
    document.getElementById("detalleEstado").textContent = `Estado: ${tarea.estado}`;
    document.getElementById("detalleResponsable").textContent = `Responsable: ${tarea.responsable}`;

    detalleDiv.style.display = "block"; // Mostrar los detalles
}

