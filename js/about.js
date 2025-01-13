/*
    File: about.js
    Purpose: Remove the link to the cart when user is not signed in
    Date: 1/12/25
    Created by: Maria, Maya, and Vee
*/

// Import firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } 
  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
  
//Initialize Firebase Authentication
const auth = getAuth();

// Store current user
let currentUser = null;

// Get the current user, if there is ones
function getUserName(){
    //Grab value for the 'keep logged in' switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn');
  
    //Grab user information from the signIn.JS
    if(keepLoggedIn == 'yes'){
      currentUser = JSON.parse(localStorage.getItem('user'));
    }
    else{
      currentUser = JSON.parse(sessionStorage.getItem('user'));
    }
}

// Runs when the page loads
window.onload = function() {
    getUserName();
    if (!currentUser) {
        const navList = document.getElementById("nav-list");    // Navbar element
        const cartLink = document.getElementById("nav-cart");   // Link to cart page
        navList.removeChild(cartLink);  // remove cart link from navbar if there is no user signed
    }
}