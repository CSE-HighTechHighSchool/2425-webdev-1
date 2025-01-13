/*
    File: index.js
    Purpose: Show buttons to create an account, sign in, or sign out depending on whether a user is currently
    logged in
    Date: 1/12/25
    Created by: Maria, Maya, and Vee
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, signOut }
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

// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById('account-button'); // User name for navbar
let signOutLink = document.getElementById('signOut');   // Sign out link
let navList = document.getElementById("nav-list");
let cartLink = document.getElementById("nav-cart");
let currentUser = null;

// ----------------------- Get User's Name'Name ------------------------------
function getUserName() {
    // Grab value for "the keep logged in" switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn');

    // Grab the user information from signIn.JS
    if (keepLoggedIn == 'yes') {
        currentUser = JSON.parse(localStorage.getItem('user'));
    } else {
        currentUser = JSON.parse(sessionStorage.getItem('user'));
    }
    console.log("hello")
}

window.onload = function() {
    getUserName();  // Get current user's first name
    console.log(currentUser);
    if (currentUser === null) {
        userLink.innerHTML = `
            <a class="btn menu-btn acct-btn" href="register.html">Create New Account</a>
            <a class="btn menu-btn acct-btn" href="signin.html">Sign in</a>
        `
        navList.removeChild(cartLink);
    } else {
        userLink.innerHTML = `
            <a class="btn menu-btn acct-btn" id="signOut">Sign Out</a>
        `
        console.log("here")

        document.getElementById('signOut').onclick = () => {
            signOutUser();
        }
    }
}

function signOutUser() {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('keepLoggedIn');

    signOut(auth).then(() => {
        // Sign out successful

    }).catch((error) => {
        // error occured
    });

    window.location = 'index.html'
}