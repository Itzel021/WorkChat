
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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


logoutButton.addEventListener('click', (e) => {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const dt = new Date();

        // Obtener el username asociado al UID
        const usernameRef = ref(database, "usernames/" + userId);
        get(usernameRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const username = snapshot.val();

                    // Actualizar el last_logout en el nodo de "users/[username]"
                    update(ref(database, "users/" + username), {
                        last_logout: dt,
                    })
                    .then(() => {
                        // Cerrar sesión después de actualizar el last_logout
                        signOut(auth).then(() => {
                            window.location.href = "../login.html";
                        }).catch((error) => {
                            alert("Error al cerrar sesión: " + error.message);
                        });
                    })
                    .catch((error) => {
                        alert("Error actualizando la base de datos: " + error.message);
                    });
                } else {
                    alert("Username no encontrado.");
                }
            })
            .catch((error) => {
                alert("Error al obtener el username: " + error.message);
            });
    } else {
        alert("No hay usuario logueado");
    }
});
