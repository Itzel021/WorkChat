
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
    import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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
    appId: "1:469035320450:web:067dd30ab4c6e19541a09b"
    };
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const auth = getAuth();

    singUp.addEventListener('click', (e) => {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var username = document.getElementById('username').value;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                set(ref(database, 'users/' + user.uid),{
                    username: username,
                    email: email
                })
                alert('Usuario creado');
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                alert(errorMessage);
            });
    });
