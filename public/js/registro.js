import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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

singUp.addEventListener("click", (e) => {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var username = document.getElementById("username").value.trim();
  var nombre = document.getElementById("nombre").value;
  var apellidos = document.getElementById("apellidos").value;

  const usernameRegex = /^[a-zA-Z0-9._]+$/;
  if (!usernameRegex.test(username)) {
    alert("El nombre de usuario solo puede contener letras, números, puntos y guiones bajos.");
    return; // Detener el registro si el nombre de usuario es inválido
  }

  //Verificar nombre de usuario unico
  const dbRef = ref(database);
  get(child(dbRef, `users/${username}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        alert("El nombre de usuario ya está en uso. Elige otro.");
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            const userId = user.uid;

            set(ref(database, "users/" + username), {
              //username: username,
              email: email,
              nombre: nombre,
              apellidos: apellidos,
            });
            // Almacenar el UID y su respectivo username en una referencia separada
            set(ref(database, "usernames/" + userId), username)
              .then(() => {
                alert("Registro exitoso!");
                window.location.href = "../login.html";
              })
              .catch((error) => {
                alert("Error al guardar el username: " + error.message);
              });
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    })
    .catch((error) => {
      console.error("Error al verificar el usuario:", error);
    });
});
