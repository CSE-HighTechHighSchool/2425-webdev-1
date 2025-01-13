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

import { getUserName, signOutUser } from "./helper.js";

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


// Runs when the page loads
window.onload = function() {
    currentUser = getUserName();
    let userLink = document.getElementById("account-button");
    if (!currentUser) {
        const navList = document.getElementById("nav-list");    // Navbar element
        const cartLink = document.getElementById("nav-cart");   // Link to cart page
        navList.removeChild(cartLink);  // remove cart link from navbar if there is no user signed

        // Add Create Account and SIgn In buttons
        userLink.innerHTML = `
            <a class="btn menu-btn acct-btn" href="register.html">Create New Account</a>
            <a class="btn menu-btn acct-btn" href="signin.html">Sign in</a>
        `
    } else {
      // Add sign out button
      userLink.innerHTML = `
            <a class="btn menu-btn acct-btn" id="signOut">Sign Out</a>
        `
        document.getElementById('signOut').onclick = () => {
          signOutUser("about.html");
      }
    }
}