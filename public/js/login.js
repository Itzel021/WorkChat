import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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

// Añadir el evento al botón de inicio de sesión
loginButton.addEventListener("click", (e) => {
  var email = document.getElementById("emailLogin").value;
  var password = document.getElementById("passwordLogin").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userId = user.uid;  // Aquí se define userId
      sessionStorage.setItem("userIdSesion", userId);  // Cambia uid por userId
      const dt = new Date();

      // Obtener el username asociado al UID
      const usernameRef = ref(database, "usernames/" + userId);
      get(usernameRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const username = snapshot.val();

            // Obtener el nombre del usuario
            const userRef = ref(database, "users/" + username);
            get(userRef)
               .then((userSnapshot) => {
                 if (userSnapshot.exists()) {
                   const userData = userSnapshot.val();
                   const nombre = userData.nombre;

                   // Guardar el nombre en sessionStorage
                   sessionStorage.setItem("nombreUsuarioSesion", nombre);

                   // Actualizar el last_login
                   update(userRef, { last_login: dt })
                     .then(() => {
                       window.location.href = "../home.html";
                     })
                     .catch((error) => {
                       alert("Error al guardar el usuario: " + error.message);
                     });
                 } else {
                   alert("Datos del usuario no encontrados.");
                 }
               })
               .catch((error) => {
                 alert("Error al obtener los datos del usuario: " + error.message);
               });
           } else {
             alert("Username no encontrado.");
           }
         })
         .catch((error) => {
           alert("Error al obtener el username: " + error.message);
         });
     })
     .catch((error) => {
       const errorMessage = error.message;
       alert(errorMessage);
     });
});

