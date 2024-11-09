import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJFw4Tr8d0-2NLtaUAgU15W2t7zaOJ79g",
  authDomain: "workchat-c8c72.firebaseapp.com",
  databaseURL: "https://workchat-c8c72-default-rtdb.firebaseio.com",
  projectId: "workchat-c8c72",
  storageBucket: "workchat-c8c72.appspot.com",
  messagingSenderId: "469035320450",
  appId: "1:469035320450:web:067dd30ab4c6e19541a09b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function initAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (callback) callback(user); 
  });
}

export function getCurrentUser() {
    return auth.currentUser; // Devuelve el usuario actual
}

export function isUserAuthenticated() { // Verifica si hay un usuario autenticado
    return !!auth.currentUser; 
}