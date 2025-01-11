import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, update, child, get, remove} 
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
    let tbodyEl = document.getElementById('cart-table'); 
    let itemList = document.getElementById('deleteItemSelect');
    let tFooter = document.getElementById('price-total')
    let totalPrice = 0;

    tbodyEl.innerHTML='';   //Clear any existing table
    itemList.innerHTML='';
    tFooter.innerHTML = '';

    const dbref = ref(db);

  //Wait for all data to be pulled from the FB
  //Must provide the path through the nodes to the data
    await get(child(dbref, 'users/'+userID+'/accountInfo/cart')).then((snapshot)=> {

        if(snapshot.exists()){

            snapshot.forEach(child => {
            //console.log(child.key, child.val());

            //Push key: value pairs to corresponding arrays
            items.push(child.key);
            quantities.push(child.val());
            });

            //Dynamically add table rows to HTML using string interpolation

            let th1=document.createElement("th");
            th1.className="cart-items-header";
            let th2=document.createElement("th");
            th2.className="cart-quant-header";
            let th3=document.createElement("th");
            th3.className="cart-price-header";
            th1.innerHTML = 'Item';
            th2.innerHTML = 'Quantity';
            th3.innerHTML = 'Price';

            tbodyEl.appendChild(th1);
            tbodyEl.appendChild(th2);
            tbodyEl.appendChild(th3);

            
            for(let i = 0; i<items.length; i++){
                totalPrice=addItemToTable(items[i], quantities[i], tbodyEl, totalPrice);
            }

            for(let i = 0; i<items.length; i++){
                addItemToList(items[i], itemList)
            }
            
            let tFootRow = document.createElement("tr");
            let tf1 = document.createElement("td");
            let tf2 = document.createElement("td");
            let tf3 = document.createElement("td");
            
            tf1.innerHTML = 'Total Price: ';
            tf1.className="p-2"
            tf2.innerHTML = '';
            tf3.innerHTML = totalPrice;
            tf3.className="tfooter-value p-2"
            tFootRow.appendChild(tf1);
            tFootRow.appendChild(tf2);
            tFootRow.appendChild(tf3);
            tFooter.appendChild(tFootRow);

        }
        else{
            let tableRow = document.createElement("tr");
            let td = document.createElement("td");
            td.className="cart-empty p-2"
            td.innerHTML = 'There are no items in your cart :(';
            tableRow.appendChild(td);
            tbodyEl.appendChild(tableRow);
        }
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
}

// Add an item to the table of data
function addItemToTable(item, quantity, tbodyEl, totalPrice){

  //console.log(item, quantity);

  let tableRow = document.createElement("tr");
  let td1 = document.createElement("td");
  td1.className="cart-items-col p-2"
  let td2 = document.createElement("td");
  td2.className="cart-quant-col p-2"
  let td3 = document.createElement("td");
  td3.className="cart-price-col p-2"

    if(item=='chocolateChipCookie'){
        td1.innerHTML = 'Chocolate Chip Cookie';
        td3.innerHTML = 1.50*quantity;
        totalPrice+= 1.50*quantity;
    }
    else if(item=='sugarCookie'){
        td1.innerHTML = 'Sugar Cookie';
        td3.innerHTML = 1.50*quantity;
        totalPrice+= 1.50*quantity;
    }
    else if(item=='smoreCookie'){
        td1.innerHTML = "S'more Cookie";
        td3.innerHTML = 2.00*quantity;
        totalPrice+= 2.00*quantity;
    }
    else if(item=='pumpkinPie'){
        td1.innerHTML = 'Pumpkin Pie';
        td3.innerHTML = 24.00*quantity; 
        totalPrice+= 24.00*quantity; 
    }
    else if(item=='appleCiderDonuts'){
        td1.innerHTML = "Apple Cider Donuts";
        td3.innerHTML = 12.00*quantity;
        totalPrice+= 12.00*quantity; 
    }
    else if(item=='chocolateCake'){
        td1.innerHTML = 'Chocolate Cake';
        td3.innerHTML = 20.00*quantity;
        totalPrice+= 20.00*quantity; 
    }
    else if(item=='vanillaCake'){
        td1.innerHTML = "Vanilla Cake";
        td3.innerHTML = 20.00*quantity;
        totalPrice+= 20.00*quantity; 
    }
    else if(item=='carrotCake'){
        td1.innerHTML = "Carrot Cake";
        td3.innerHTML = 20.00*quantity;
        totalPrice+= 20.00*quantity;
    }
    else if(item=='applePie'){
        td1.innerHTML = "Apple Pie";
        td3.innerHTML = 18.00*quantity;
        totalPrice+= 18.00*quantity;
    }
    else if(item=='pecanPie'){
        td1.innerHTML = "Pecan Pie";
        td3.innerHTML = 18.00*quantity;
        totalPrice+= 18.00*quantity;
    }
    else if(item=='blueberryPie'){
        td1.innerHTML = "Blueberry Pie";
        td3.innerHTML = 18.00*quantity;
        totalPrice+= 18.00*quantity;
    }
    else if(item=='chocolateCupcake'){
        td1.innerHTML = 'Chocolate Cupcake';
        td3.innerHTML = 4.00*quantity;
        totalPrice+= 4.00*quantity;
    }
    else if(item=='vanillaCupcake'){
        td1.innerHTML = "Vanilla Cupcake";
        td3.innerHTML = 4.00*quantity;
        totalPrice+= 4.00*quantity;
    }
    else{
        td1.innerHTML = "Red Velvet Cupcake";
        td3.innerHTML = 4.00*quantity;
        totalPrice+= 4.00*quantity;
    }
  td2.innerHTML = quantity;

  tableRow.appendChild(td1);
  tableRow.appendChild(td2);
  tableRow.appendChild(td3);

  tbodyEl.appendChild(tableRow);

  return totalPrice;
}

function addItemToList(item, itemList){
    //console.log(item);

    let listItem = document.createElement("option");
    listItem.value=item;

    if(item=='chocolateChipCookie'){
        listItem.innerHTML = 'Chocolate Chip Cookie';
    }
    else if(item=='sugarCookie'){
        listItem.innerHTML = 'Sugar Cookie';
    }
    else if(item=='smoreCookie'){
        listItem.innerHTML = "S'more Cookie";
    }
    else if(item=='pumpkinPie'){
        listItem.innerHTML = 'Pumpkin Pie';
    }
    else if(item=='appleCiderDonuts'){
        listItem.innerHTML = "Apple Cider Donuts";
    }
    else if(item=='chocolateCake'){
        listItem.innerHTML = 'Chocolate Cake';
    }
    else if(item=='vanillaCake'){
        listItem.innerHTML = "Vanilla Cake";
    }
    else if(item=='carrotCake'){
        listItem.innerHTML = "Carrot Cake";
    }
    else if(item=='applePie'){
        listItem.innerHTML = "Apple Pie";
    }
    else if(item=='pecanPie'){
        listItem.innerHTML = "Pecan Pie";
    }
    else if(item=='blueberryPie'){
        listItem.innerHTML = "Blueberry Pie";
    }
    else if(item=='chocolateCupcake'){
        listItem.innerHTML = 'Chocolate Cupcake';
    }
    else if(item=='vanillaCupcake'){
        listItem.innerHTML = "Vanilla Cupcake";
    }
    else{
        listItem.innerHTML = "Red Velvet Cupcake";
    }

    itemList.append(listItem);
}

function addItemToOrder(userID, item, quantity){
    //Must use brackets around variable name to use it as a key
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

function deleteItem(item, userID){
    remove(ref(db, 'users/' + userID + '/accountInfo/cart/'+item))
        .then(()=>{
          alert('Item deleted successfully!');
        })
        .catch((error)=>{
          alert('Error: item could not be deleted')
        });
}

async function deleteAll(userID){
    const items = [];

    const dbref = ref(db);

  //Wait for all data to be pulled from the FB
  //Must provide the path through the nodes to the data
    await get(child(dbref, 'users/'+userID+'/accountInfo/cart')).then((snapshot)=> {
        if(snapshot.exists()){

            snapshot.forEach(child => {
            //Push key: value pairs to corresponding arrays
            items.push(child.key);
            });
        }
        else{
            alert('No data to delete!');
        }
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
    for(let i = 0; i<items.length; i++){
        remove(ref(db, 'users/' + userID + '/accountInfo/cart/'+items[i]))
        .catch((error)=>{
          alert('Error: item could not be deleted')
        });
    }
}

async function storeOrder (userID){
    let date = new Date();

    const items = [];
    const quantity = [];
    const dbref = ref(db);
    let price = 0;

    //Wait for all data to be pulled from the FB
    //Must provide the path through the nodes to the data
    await get(child(dbref, 'users/'+userID+'/accountInfo/cart')).then((snapshot)=> {
        if(snapshot.exists()){
            console.log(snapshot.val());

            snapshot.forEach(child => {
            //Push key: value pairs to corresponding arrays
            items.push(child.key);
            quantity.push(child.val());
            });
        }
        else{
            alert('Cannot place a blank order');
        }
    });
    for(let i = 0; i<items.length; i++){
        if(items[i]=='chocolateChipCookie'){
            price += 1.50*quantity[i];
          }
        else if(items[i]=='sugarCookie'){
            price += 1.50*quantity[i];
          }
        else if(items[i]=='smoreCookie'){
            price += 2.00*quantity[i];
          }
        else if(items[i]=='pumpkinPie'){
            price += 24.00*quantity[i];
          }
        else if(items[i]=='appleCiderDonuts'){
            price += 12.00*quantity[i];
          }
        else if(items[i]=='chocolateCake'){
            price += 20.00*quantity[i];
          }
        else if(items[i]=='vanillaCake'){
            price += 20.00*quantity[i];
          }
        else if(items[i]=='carrotCake'){
            price += 20.00*quantity[i];
          }
        else if(items[i]=='applePie'){
            price += 18.00*quantity[i];
          }
        else if(items[i]=='pecanPie'){
            price += 18.00*quantity[i];
          }
        else if(items[i]=='blueberryPie'){
            price += 18.00*quantity[i];
          }
        else if(items[i]=='chocolateCupcake'){
            price += 4.00*quantity[i];
          }
        else if(items[i]=='vanillaCupcake'){
            price += 4.00*quantity[i];
          }
        else{
            price = 4.00*quantity[i];
        }
        update(ref(db, 'users/' + userID + '/accountInfo/orders/'+date), {
            [items[i]]: quantity[i]
        })
      .catch((error)=>{
        alert('Error: item could not be added')
      });
    }
    console.log(price);
    update(ref(db, 'users/' + userID + '/accountInfo/orders/'+date), {
        ['price']: price
    }).then(()=>{
        alert('Order placed successfully!');
    }).catch((error)=>{
        alert('Error: issue with price calculation');
      });
}

window.onload = function(){
    
    getUserName()
    if(!currentUser){
        welcome.innerText = "You are not signed in. Please sign in to order";
        const page = document.getElementById("cart-functions");
        page.style.display = "none";

    }
    else{
        welcome.innerText = 'Welcome '+currentUser.firstname+'!';
        const userID = currentUser.uid;

        getDataSet(userID);
    }

}

document.getElementById('orderItem').onclick = function(){
    const item = document.getElementById('itemSelect').value;
    const quantity = document.getElementById('itemNum').value;
    const userID = currentUser.uid;

    addItemToOrder(userID, item, quantity);  
    getDataSet(userID);
}

document.getElementById('deleteItem').onclick = function(){
    const item = document.getElementById('deleteItemSelect').value;
    const userID = currentUser.uid;

    deleteItem(item, userID);  
    getDataSet(userID);
}

document.getElementById('deleteAll').onclick = function(){
    const userID = currentUser.uid;

    deleteAll(userID).then(()=>{    
        getDataSet(userID);
    });
}

document.getElementById('placeOrder').onclick = function(){
    const userID = currentUser.uid;

    storeOrder(userID).then(()=>{
        deleteAll(userID).then(()=>{    
            getDataSet(userID);
        });
    });
    
}