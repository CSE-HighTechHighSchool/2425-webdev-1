import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, update} 
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

function addItemToOrder(userID, item, quantity){
    //Must use brackets around variable name to use it as a key
    update(ref(db, 'users/' + userID + '/accountInfo/cart'), {
      [item]: quantity
    })
    .then(()=>{
      alert('Added to Cart!');
    })
    .catch((error)=>{
      alert('Error: item could not be added')
    });
}

window.onload=function(){
    getUserName();
    console.log(currentUser);

    if(!currentUser){
      const orderElements = document.querySelectorAll(".order-select");
      orderElements.forEach((element) => {
        element.style.display = "none";
    })
      const checkout = document.getElementById("checkout-button");
      checkout.style.display= "none";
  }
}

document.getElementById('orderCookies').onclick = function(){
    const item = document.getElementById('cookieSelect').value;
    const quantity = document.getElementById('cookieNum').value;
    const userID = currentUser.uid;
      
    addItemToOrder(userID, item, quantity);
      
};

document.getElementById('orderSeasonal').onclick = function(){
    const item = document.getElementById('seasonalSelect').value;
    const quantity = document.getElementById('seasonalNum').value;
    const userID = currentUser.uid;

    addItemToOrder(userID, item, quantity);
};

document.getElementById('orderCake').onclick = function(){
    const item = document.getElementById('cakeSelect').value;
    const quantity = document.getElementById('cakeNum').value;
    const userID = currentUser.uid;

    addItemToOrder(userID, item, quantity);
};

document.getElementById('orderPie').onclick = function(){
    const item = document.getElementById('pieSelect').value;
    const quantity = document.getElementById('pieNum').value;
    const userID = currentUser.uid;

    addItemToOrder(userID, item, quantity);
};

document.getElementById('orderCupcake').onclick = function(){
    const item = document.getElementById('cupcakeSelect').value;
    const quantity = document.getElementById('cupcakeNum').value;
    const userID = currentUser.uid;

    addItemToOrder(userID, item, quantity);
};