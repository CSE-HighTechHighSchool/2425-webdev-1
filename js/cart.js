import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove} 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
  
// Return an instance of your app's database
const db = getDatabase(app);

let welcome = document.getElementById('cart-welcome');    
let currentUser = null;

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

window.onload = function(){
    
    getUserName()
    if(currentUser){
        welcome.innerText = 'Welcome '+currentUser.firstname;
    }
    else{
        welcome.innerText = "You're not signed in. Please sign in to order";
    }

}