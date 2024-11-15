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
const grupoRef = ref(database, `grupos/${equipoId}`);
const usernamesRef = ref(database, "usernames");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Obtener el UID del líder con el username almacenado en sessionStorage
        const usernamesSnapshot = await get(usernamesRef);
        let uidSesion = null;
        
        if (usernamesSnapshot.exists()) {
            const usernames = usernamesSnapshot.val();
            
            // Buscar el UID correspondiente al username en sessionStorage
            for (let uid in usernames) {
                if (usernames[uid] === usernameSesion) {
                    uidSesion = uid;
                    break;
                }
            }
        }

        if (!uidSesion) {
            console.error("No se encontró un UID para el username actual.");
            return;
        }

        // Obtener los detalles del grupo y verificar si el UID coincide con el del líder
        const grupoSnapshot = await get(grupoRef);
        if (grupoSnapshot.exists()) {
            const grupo = grupoSnapshot.val();
            const esLider = grupo.lider === uidSesion; // Comparar el UID obtenido

            console.log(`Es líder: ${esLider}`); // Confirmar si es líder

            // Cargar las tareas del grupo
            const tareasSnapshot = await get(tareasRef);
            if (tareasSnapshot.exists()) {
                const tareas = tareasSnapshot.val();

                const pendientesList = document.querySelector("#pendientes");
                const enCursoList = document.querySelector("#enCurso");
                const hechoList = document.querySelector("#hecho");

                for (let tareaId in tareas) {
                    const tarea = tareas[tareaId];
                    const listItem = crearElementoTarea(tareaId, tarea, esLider);
                    listItem.addEventListener("click", () => mostrarDetallesTarea(tarea));

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
        } else {
            console.log("No se encontró el grupo.");
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});

function crearElementoTarea(tareaId, tarea, esLider) {
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

    // Si el usuario es líder, agregar botón de eliminar
    if (esLider) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("btn", "btn-sm", "btn-danger", "ms-2");

        deleteButton.addEventListener("click", async () => {
            await eliminarTarea(tareaId, listItem);
        });

        listItem.appendChild(deleteButton);
    }

    return listItem;
}

async function eliminarTarea(tareaId, listItem) {
    const tareaRef = ref(database, `grupos/${equipoId}/tareas/${tareaId}`);
    try {
        await set(tareaRef, null); // Elimina la tarea de Firebase
        listItem.remove(); // Elimina el elemento de la interfaz
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
    }
}

// Función para actualizar el estado de una tarea
async function actualizarEstadoTarea(tareaId, nuevoEstado, listItem, titulo) {
    const tareaRef = ref(database, `grupos/${equipoId}/tareas/${tareaId}/estado`);
    await set(tareaRef, nuevoEstado);

    // Actualizar la interfaz moviendo la tarea a la lista correspondiente
    const pendientesList = document.querySelector("#pendientes");
    const enCursoList = document.querySelector("#enCurso");
    const hechoList = document.querySelector("#hecho");

    listItem.innerHTML = `${titulo} `;

    if (nuevoEstado === "hecho") {
        // Eliminar el botón al marcar la tarea como "hecho"
        const buttons = listItem.getElementsByTagName("button");
        while (buttons.length > 0) {
            buttons[0].parentNode.removeChild(buttons[0]);
        }
        hechoList.appendChild(listItem);
    } else if (nuevoEstado === "en-curso") {
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

    document.getElementById("detalleTitulo").textContent = `${tarea.titulo}`;
    document.getElementById("detalleDescripcion").textContent = `${tarea.descripcion || "No hay descripción disponible"}`;
    document.getElementById("detalleFecha").textContent = ` ${tarea.fecha_limite}`;
    document.getElementById("detalleEstado").textContent = ` ${tarea.estado}`;
    document.getElementById("detalleResponsable").textContent = `${tarea.responsable}`;

    detalleDiv.style.display = "block"; // Mostrar los detalles
}

