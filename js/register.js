// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getDatabase, ref, set, update, child, get } 
    from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// https://firebase.google.com/docs/web/setup#available-libraries


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
const auth = getAuth();
const db = getDatabase();

/* ---------------- Register New Uswer --------------------------------*/
document.getElementById('submitData').onclick = function() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("userEmail").value;

    // Firebase requires a password of at least 6 chars
    const password = document.getElementById('userPass').value;

    if (!validation(firstName, lastName, email, password)) {
        return;
    }
    console.log("we got this far")
  
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        
        // Add user account info to realtime database
        // set - will create a new reference or completely replace existing one
        // Each new user will be placed under the "users" node
        set(ref(db, 'users/' + user.uid + '/accountInfo'), {
            uid: user.uid,  // save userID for home.js reference
            email: email,
            password: encryptPass(password),
            firstname: firstName,
            lastname: lastName
        })
        .then(() => {
            // Data saved successfully!
            alert('User created successfully')
            window.location = "signin.html";
        })
        .catch((error) => {
            // Data write failed...
            alert(error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });

   
}

/* --------------- Check for null, empty ("") or all spaces only ------------*/
function isEmptyorSpaces(str){
    return str === null || str.match(/^ *$/) !== null
}

/* ---------------------- Validate Registration Data -----------------------*/
function validation(firstName, lastName, email, password) {
    let fNameRegex = /^[a-zA-Z]+$/;
    let lNameRegex = /^[a-zA-Z]+$/;
    let emailRegex = /^[a-zA-Z]+@(gmail|ctemc|yahoo)\.org$/;

    if (isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(email)
    || isEmptyorSpaces(password)) {
        alert("Please complete all fields");
        return false;
    }

    if (!fNameRegex.test(firstName)) {
        alert("The first name should only contain letters.")
        return false;
    }

    if (!lNameRegex.test(lastName)) {
        alert("The last name should only contain letters.")
        return false;
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email.")
        return false;
    }

    return true;
  
}

/* --------------- Password Encryption -------------------------------------*/
function encryptPass(password) {
    let encrypted = CryptoJS.AES.encrypt(password, password);
    return encrypted.toString();
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
        window.location = 'home.html';
    } 
    
    // Local storage will stay even if browser is closed
    // Local storage will be cleared with "signOut()" function
    else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        console.log(localStorage.getItem('user'))
        window.location = 'home.html';
    }
}

