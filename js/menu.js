/*
  File: menu.js
  Purpose: Add items through cart when user is signed in. Hide add item options
           when user is signed out
  Date: 1/13/25
  Created by: Maria Huan, Maya Bhasin, and Vee Marinaccio
*/

//import functions from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, update} 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";


import { signOutUser, getUserName } from "./helper.js";

// Website Firebase configuration
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
  
// Return an instance of your app's database
const db = getDatabase(app);

//Create currentUser
let currentUser = null;

function addItemToOrder(userID, item, quantity){
    //Add item to user's cart if quantity is greater than 0
    if(quantity>0){
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
    else{
      alert('Error: Must add at least 1 item');
    }
}

//Onload functions
window.onload = function(){
  getUserName();  //Grab user information

  if(!currentUser){ //if logged out, hide order elements
    const orderElements = document.querySelectorAll(".order-select");
    orderElements.forEach((element) => {
      element.style.display = "none";
    })
    const checkout = document.getElementById("checkout-button");
    checkout.style.display= "none";

    const navList = document.getElementById("nav-list");    // Navbar element
    const cartLink = document.getElementById("nav-cart");   // Link to cart page
    navList.removeChild(cartLink);  // remove cart link from navbar if there is no user signed
    
    // Add registration and login buttons
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
          signOutUser("menu.html");
      }
    }
}

//Add item to order from Cookies section
document.getElementById('orderCookies').onclick = function(){
    const item = document.getElementById('cookieSelect').value;   //Grab item number
    const quantity = document.getElementById('cookieNum').value;  //Grab quantity 
    const userID = currentUser.uid;                               //Grab user ID
    
    addItemToOrder(userID, item, quantity);   //Add item to order
      
};

//Add item to order from Seasonal section
document.getElementById('orderSeasonal').onclick = function(){
    const item = document.getElementById('seasonalSelect').value;   //Grab item number
    const quantity = document.getElementById('seasonalNum').value;  //Grab quantity 
    const userID = currentUser.uid;                                 //Grab user ID

    addItemToOrder(userID, item, quantity);   //Add item to order
};

//Add item to order from Cake section
document.getElementById('orderCake').onclick = function(){
    const item = document.getElementById('cakeSelect').value;   //Grab item number
    const quantity = document.getElementById('cakeNum').value;  //Grab quantity 
    const userID = currentUser.uid;                             //Grab user ID

    addItemToOrder(userID, item, quantity);   //Add item to order
};

//Add item to order from Pie section
document.getElementById('orderPie').onclick = function(){
    const item = document.getElementById('pieSelect').value;   //Grab item number
    const quantity = document.getElementById('pieNum').value;  //Grab quantity 
    const userID = currentUser.uid;                            //Grab user ID

    addItemToOrder(userID, item, quantity);   //Add item to order
};

//Add item to order from Cupcake section
document.getElementById('orderCupcake').onclick = function(){
    const item = document.getElementById('cupcakeSelect').value;   //Grab item number
    const quantity = document.getElementById('cupcakeNum').value;  //Grab quantity 
    const userID = currentUser.uid;                                //Grab user ID

    addItemToOrder(userID, item, quantity);   //Add item to order
};