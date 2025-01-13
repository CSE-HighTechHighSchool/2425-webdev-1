/*
    File: index.js
    Purpose: Allow users to sign in using their email and password
    Date: 1/12/25
    Created by: Maria, Maya, and Vee
*/

// ----------------- User Sign-In Page --------------------------------------//

/* ----------------- Firebase Setup & Initialization ------------------------*/
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, update, child, get } 
    from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
    
    
// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDrkDGdwaN0Ny08t08JPv8mb3_jZqUsSRg",
authDomain: "humming-bee-bakes.firebaseapp.com",
projectId: "humming-bee-bakes",
storageBucket: "humming-bee-bakes.firebasestorage.app",
messagingSenderId: "626309569524",
appId: "1:626309569524:web:45a224c3f6ddf8ea76f7a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication
const auth = getAuth();

// Return an instance of your app's database
const db = getDatabase()

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signin').onclick = function() {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPass').value;

    // Attempt to sign user in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Create user credential and store userID
        const user = userCredential.user;

        // Log sign-in in db
        // update - will only add the last_login info and won't overwrite anything
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + "/accountInfo"), {
            last_login: logDate,
        })
        .then(() => {
            // user signed in successfully
            alert("User signed in successfully")

            // get snapshot of all tbe user info (including uid)
            // to pass to the login() function and store in session or local storage
            get(ref(db, 'users/' + user.uid + "/accountInfo")).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val())
                    logIn(snapshot.val())
                } else {
                    console.log('user does not exist')
                }
            })
            .catch((error) => {
                console.log(error)
            })
        })
        .catch((error) => {
            alert(error)
        })
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
    })
}

// ---------------- Keep User Logged In ----------------------------------//
function logIn(user) {
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;
    console.log(user)
    
    // Session storage is temporary (only while session is active)
    // Info saved as a string (must convert JS object to a string)
    // session storage will be cleared with a signOut() function in home.js
    if (!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user))
        window.location = 'index.html';
    } 
    
    // Local storage will stay even if browser is closed
    // Local storage will be cleared with "signOut()" function
    else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        console.log(localStorage.getItem('user'))
        window.location = 'index.html';
    }
}
