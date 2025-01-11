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
let table = document.getElementById('menu-table-section');
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

async function getDataSet(userID){

    const items = [];
    const quantities = [];
    let tbodyEl = document.getElementById('cart-table'); //Select <tbody-2> element

    const dbref = ref(db);

  //Wait for all data to be pulled from the FB
  //Must provide the path through the nodes to the data
    await get(child(dbref, 'users/'+userID+'/accountInfo/cart')).then((snapshot)=> {

        if(snapshot.exists()){
            console.log(snapshot.val());

            snapshot.forEach(child => {
            //console.log(child.key, child.val());

            //Push key: value pairs to corresponding arrays
            items.push(child.key);
            quantities.push(child.val());
            });
        }
        else{
            let tableRow = document.createElement("tr");
            let td = document.createElement("td");
             td1.className="cart-empty"
            td2.innerHTML = 'There are no items in your cart';
            tableRow.appendChild(td);
            tbodyEl.appendChild(tableRow);
        }
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });

    //Dynamically add table rows to HTML using string interpolation
    tbodyEl.innerHTML='';   //Clear any existing table

    let th1=document.createElement("th");
    th1.className="cart-items-header";
    let th2=document.createElement("th");
    th2.className="cart-quant-header";
    th1.innerHTML = 'Items';
    th2.innerHTML = 'Quantity';

    tbodyEl.appendChild(th1);
    tbodyEl.appendChild(th2);

    
    for(let i = 0; i<items.length; i++){
        addItemToTable(items[i], quantities[i], tbodyEl);
    }
}

// Add an item to the table of data
function addItemToTable(item, quantity, tbodyEl){

  console.log(item, quantity);

  let tableRow = document.createElement("tr");
  let td1 = document.createElement("td");
  td1.className="cart-items-col p-2"
  let td2 = document.createElement("td");
  td2.className="cart-quant-col p-2"

    if(item=='chocolateChipCookie'){
        td1.innerHTML = 'Chocolate Chip Cookie';
    }
    else if(item=='sugarCookie'){
        td1.innerHTML = 'Sugar Cookie';
    }
    else if(item=='smoreCookie'){
        td1.innerHTML = "S'more Cookie";
    }
    else if(item=='pumpkinPie'){
        td1.innerHTML = 'Pumpkin Pie';
    }
    else if(item=='appleCiderDonuts'){
        td1.innerHTML = "Apple Cider Donuts";
    }
    else if(item=='chocolateCake'){
        td1.innerHTML = 'Chocolate Cake';
    }
    else if(item=='vanillaCake'){
        td1.innerHTML = "Vanilla Cake";
    }
    else if(item=='carrotCake'){
        td1.innerHTML = "Carrot Cake";
    }
    else if(item=='applePie'){
        td1.innerHTML = "Apple Pie";
    }
    else if(item=='pecanPie'){
        td1.innerHTML = "Pecan Pie";
    }
    else if(item=='blueberryPie'){
        td1.innerHTML = "Blueberry Pie";
    }
    else if(item=='chocolateCupcake'){
        td1.innerHTML = 'Chocolate Cupcake';
    }
    else if(item=='vanillaCupcake'){
        td1.innerHTML = "Vanilla Cupcake";
    }
    else{
        td1.innerHTML = "Red Velvet Cupcake";
    }
  td2.innerHTML = quantity;

  tableRow.appendChild(td1);
  tableRow.appendChild(td2);

  tbodyEl.appendChild(tableRow);
}

window.onload = function(){
    
    getUserName()
    if(!currentUser){
        welcome.innerText = "You're not signed in. Please sign in to order";
    }
    else{
        welcome.innerText = 'Welcome '+currentUser.firstname+'!';
        const userID = currentUser.uid;

        getDataSet(userID);
    }


}