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

//Get current user information
function getUserName(){
  //Grab value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');
  
  //Grab user information from the signIn.js
  if(keepLoggedIn == 'yes'){
    currentUser = JSON.parse(localStorage.getItem('user'));
  }
  else{
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
  }

//Add item to order
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
window.onload=function(){
  getUserName();  //Grab user information

  if(!currentUser){ //if logged out, hide order elements
    const orderElements = document.querySelectorAll(".order-select");
    orderElements.forEach((element) => {
      element.style.display = "none";
    })
    const checkout = document.getElementById("checkout-button");
    checkout.style.display= "none";

    navList.removeChild(cartLink);  //remove My Cart link from navbar
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