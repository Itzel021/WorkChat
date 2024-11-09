import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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
const auth = getAuth();

// Referencias a los elementos del formulario
const form = document.getElementById("crearGrupo");
const nombreEquipoInput = document.getElementById("nombreEquipo");
const emailColaboradorInput = document.getElementById("emailColaborador");
const emailEliminarInput = document.getElementById("emailEliminar");
const listaMiembrosTextarea = document.getElementById("listaMiembros");
const addMiembroButton = document.getElementById("addMiembro");
const removeMiembroButton = document.getElementById("removeMiembro");

let correosMiembros = [];

// Validar si el correo existe en la base de datos
async function validarCorreoExiste(email) {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
        const users = snapshot.val();
        for (const username in users) {
            if (users[username].email === email) {
                return true; // El correo existe
            }
        }
    }
    return false; // El correo no existe
}

// Agregar miembro con validación de líder
addMiembroButton.addEventListener("click", async () => {
    const email = emailColaboradorInput.value.trim();
    const liderEmail = auth.currentUser ? auth.currentUser.email : null;

    if (email) {
        if (email === liderEmail) {
            alert("No puedes agregar tu propio correo como miembro del equipo.");
        } else if (correosMiembros.includes(email)) {
            alert("Este correo ya está en la lista de miembros.");
        } else {
            const correoExiste = await validarCorreoExiste(email);
            if (correoExiste) {
                correosMiembros.push(email);
                actualizarListaMiembros();
                emailColaboradorInput.value = ""; // Limpiar el campo
            } else {
                alert("El correo ingresado no pertenece a un usuario registrado.");
            }
        }
    }
});

removeMiembroButton.addEventListener("click", () => {
    const email = emailEliminarInput.value.trim();
    if (email && correosMiembros.includes(email)) {
        correosMiembros = correosMiembros.filter((correo) => correo !== email);
        actualizarListaMiembros();
        emailEliminarInput.value = ""; // Limpiar el campo
    } else {
        alert("El correo no está en la lista.");
    }
});

// Actualizar la lista de miembros en el área de texto
function actualizarListaMiembros() {
    listaMiembrosTextarea.value = correosMiembros.join("\n");
}

async function obtenerUsernamesDeCorreos(correos) {
    const usernames = {};
    for (const email of correos) {
        const userSnapshot = await get(child(ref(database), `users`));
        if (userSnapshot.exists()) {
            const users = userSnapshot.val();
            for (const username in users) {
                if (users[username].email === email) {
                    usernames[username] = true; // Almacena el username
                    break;
                }
            }
        }
    }
    return usernames;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombreEquipo = nombreEquipoInput.value.trim();
    //Id de lider siempre el que inicia sesion
    const liderUID = auth.currentUser ? auth.currentUser.uid : null;
    const fechaCreacion = new Date().toISOString();

    if (nombreEquipo && liderUID) {
        const miembros = await obtenerUsernamesDeCorreos(correosMiembros);

        // Generar un nuevo ID para el grupo
        const grupoRef = push(ref(database, "grupos"));

        // Estructura del grupo
        const nuevoGrupo = {
            nombre: nombreEquipo,
            lider: liderUID,
            miembros: miembros,
            fecha_creacion: fechaCreacion,
        };

        // Insertar en Firebase
        set(grupoRef, nuevoGrupo)
            .then(() => {
                alert("¡Grupo creado con éxito!");
                form.reset();
                correosMiembros = [];
                listaMiembrosTextarea.value = "";
            })
            .catch((error) => {
                alert("Error al crear el grupo: " + error.message);
            });
    } else {
        alert("El nombre del equipo es obligatorio.");
    }
});
