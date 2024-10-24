 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
 import {
     getDatabase,
     set,
     ref,
     update,
 } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
 import {
     getAuth,
     signInWithEmailAndPassword,
 } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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

 // Añadir el evento al botón de inicio de sesión
 loginButton.addEventListener("click", (e) => {
     var email = document.getElementById("emailLogin").value;
     var password = document.getElementById("passwordLogin").value;

     signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
             // Signed in
             const user = userCredential.user;
             const dt = new Date();
             update(ref(database, "users/" + user.uid), {
                 last_login: dt,
             })
                 .then(() => {
                     alert('Acceso correcto!');
                     // Redirigir a la página principal
                     window.location.href = '../home.html';
                 })
                 .catch((error) => {
                     alert('Error al guardar el usuario: ' + error.message);
                 });
         })
         .catch((error) => {
             const errorCode = error.code;
             const errorMessage = error.message;
             alert(errorMessage);
         });
 });