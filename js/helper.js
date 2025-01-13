/*
    File: helper.js
    Purpose: Declares functions that are used in multiple js files
    Date: 1/13/25
    Created By: Maria, Maya, Vee
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

export function signOutUser(newLocation) {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('keepLoggedIn');

    signOut(auth).then(() => {
        // Sign out successful

    }).catch((error) => {
        // error occured
    });

    window.location = newLocation
}

export function getUserName(){
    //Grab value for the 'keep logged in' switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn');
  
    let currentUser = null;
    //Grab user information from the signIn.JS
    if(keepLoggedIn == 'yes'){
      currentUser = JSON.parse(localStorage.getItem('user'));
    }
    else{
      currentUser = JSON.parse(sessionStorage.getItem('user'));
    }

    return currentUser;
}
