// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth }
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
let welcome = document.getElementById('welcome');   // Welcome header
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
}

window.onload = function() {
    getUserName();  // Get current user's first name
    if (currentUser == null) {
        userLink.innerText = 'Create New Account';
        userLink.classList.replace('none', 'btn');
        userLink.classList.add('menu-btn');
        userLink.classList.add('register-btn')
        userLink.href = 'register.html' ;

        signOutLink.innerText = 'Sign In'
        signOutLink.classList.replace('nav-link', 'btn');
        signOutLink.classList.add('btn-success')
        signOutLink.href = 'signIn.html'
    } else {
        userLink.innerText = currentUser.firstname;
        welcome.innerText = 'Welcome ' + currentUser.firstname;
        userLink.classList.replace('none', 'example-div');
        userLink.href = '#';

        signOutLink.innerText = 'Sign Out';
        signOutLink.classList.replace('btn', 'nav-link');
        signOutLink.classList.add('btn-success');
        document.getElementById('signOut').onclick = () => {
        signOutUser();
        }
    }
}