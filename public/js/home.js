// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});

logoutButton.addEventListener('click', (e) => {
    const user = auth.currentUser;
    if (user) {
        const dt = new Date();
        update(ref(database, 'users/' + user.uid), {
            last_logout: dt,
        }).then(() => {
            signOut(auth).then(() => {
                window.location.href = "../login.html";
            }).catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
        }).catch((error) => {
            const errorMessage = error.message;
            alert("Error actualizando la base de datos: " + errorMessage);
        });
    } else {
        alert("No hay usuario logueado");
    }
});
