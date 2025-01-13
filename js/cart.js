/*
  File: cart.js
  Purpose: Show item name, quantity, and price. Let user add, remove, or change the 
           items in their cart. Place orders and show user previous orders they have made.
  Date: 1/13/25
  Created by: Maria Huan, Maya Bhasin, and Vee Marinaccio
*/

//Import functions*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, update, child, get, remove} 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
  import { signOutUser } from "./helper.js";

//Website Firebase configuration
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

//Get reference values
let welcome = document.getElementById('cart-welcome');   
let currentUser = null;

//Establish menu item names and prices
const menu = {
    'chocolateChipCookie':
    {
        name: 'Chocolate Chip Cookie', 
        price: 1.50
    },
    'sugarCookie':
    {
        name:'Sugar Cookie', 
        price:1.50
    },
    'smoreCookie':
    {
        name: "S'more Cookie", 
        price:2.00
    },
    'pumpkinPie':
    {
        name:"Pumpkin Pie", 
        price:24.00
    },
    'appleCiderDonuts':
    {
        name: "Apple Cider Donuts", 
        price: 12.00
    },
    'chocolateCake':
    {
        name:'Chocolate Cake',
        price:20.00
    },
    'vanillaCake':
    {
        name:"Vanilla Cake", 
        price:20.00
    },
    'carrotCake':
    {
        name:"Carrot Cake", 
        price:20.00},
    'applePie':
    {
        name:"Apple Pie",
        price:18.00
    },
    'pecanPie':
    {
        name:"Pecan Pie",
        price:18.00
    },
    'blueberryPie':
    {
        name:"Blueberry Pie", 
        price:18.00
    },
    'chocolateCupcake':
    {
        name:'Chocolate Cupcake',
        price:4.00
    },
    'vanillaCupcake':
    {
        name:"Vanilla Cupcake",
        price:4.00
    },
    'redVelvetCupcake':
    {
        name:"Red Velvet Cupcake",
        price:4.00
    }
};

//Get current user information
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

//Get data to display in table
async function getDataSet(userID){
    
    //Create arrays to hold values
    const items = [];
    const quantities = [];

    //Get reference values
    let tbodyEl = document.getElementById('cart-table'); 
    let itemList = document.getElementById('deleteItemSelect');
    let tFooter = document.getElementById('price-total')
    let totalPrice = 0;

    tbodyEl.innerHTML='';   //Clear any existing table  
    itemList.innerHTML=`    
                <option disabled selected value="">Select an option</option>
            `;              //Set default value of select list
    tFooter.innerHTML = ''; //Clear any existing information  

    const dbref = ref(db);  //Get database reference  

    //Wait for all data to be pulled from Firebase
    await get(child(dbref, 'users/'+userID+'/accountInfo/cart')).then((snapshot)=> {

        if(snapshot.exists()){

            snapshot.forEach(child => {

            //Push key: value pairs to corresponding arrays
            items.push(child.key);
            quantities.push(child.val());
            });

            //Create table headers
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

            //Dynamically add table rows to HTML using string interpolation
            for(let i = 0; i<items.length; i++){
                totalPrice=addItemToTable(items[i], quantities[i], tbodyEl, totalPrice);
            }
            //Add items in order to 'Add or Change Items' list 
            for(let i = 0; i<items.length; i++){
                addItemToList(items[i], itemList)
            }
            
            //Create table footer
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
            //Print that there are no items in the cart
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

  //reference item from menu
  let menuItem=menu[item];

  //Add item name, quantity, and price to the table
  let tableRow = document.createElement("tr");
  let td1 = document.createElement("td");
  td1.className="cart-items-col p-2"
  let td2 = document.createElement("td");
  td2.className="cart-quant-col p-2"
  let td3 = document.createElement("td");
  td3.className="cart-price-col p-2"

  td1.innerHTML = menuItem['name'];
  td2.innerHTML = quantity;
  td3.innerHTML = menuItem['price']*quantity;
  totalPrice += menuItem['price']*quantity;

  tableRow.appendChild(td1);
  tableRow.appendChild(td2);
  tableRow.appendChild(td3);

  tbodyEl.appendChild(tableRow);

  return totalPrice;
}

//Add item to selection list
function addItemToList(item, itemList){

    //Create option element and set to item value
    let listItem = document.createElement("option");
    listItem.value=item;
    let menuItem=menu[item];
    listItem.innerHTML =menuItem['name'];

    //Add item to list
    itemList.append(listItem);
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

//Delete item from order
function deleteItem(item, userID){
    remove(ref(db, 'users/' + userID + '/accountInfo/cart/'+item))
        .then(()=>{
          alert('Item deleted successfully!');
        })
        .catch((error)=>{
          alert('Error: item could not be deleted')
        });
}

//Delete all items from order
async function deleteAll(userID){
    const items = [];

    const dbref = ref(db);

  //Wait for all data to be pulled from the FB
    await get(child(dbref, 'users/'+userID+'/accountInfo/cart')).then((snapshot)=> {
        if(snapshot.exists()){

            snapshot.forEach(child => {
            //push each key value into an array
            items.push(child.key);
            });
        }
        else{
            alert('No data to delete!');
        }
    })
    .then(()=>{
        alert('Items removed');
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });

    //Go through the array of key values and remove all items
    for(let i = 0; i<items.length; i++){
        remove(ref(db, 'users/' + userID + '/accountInfo/cart/'+items[i]))
        .catch((error)=>{
          alert('Error: item could not be deleted')
        });
    }
}

//Store order to Database
async function storeOrder (userID){
    
    //Grab date
    let date = new Date();

    //Create variables
    const items = [];
    const quantity = [];
    let price = 0;

    //Get database
    const dbref = ref(db);

    //Wait for all data to be pulled from the Firebase
    await get(child(dbref, 'users/'+userID+'/accountInfo/cart')).then((snapshot)=> {
        if(snapshot.exists()){
            console.log(snapshot.val());

            snapshot.forEach(child => {
            //Push key: value pairs to corresponding arrays
            items.push(child.key);
            quantity.push(child.val());
            }).then(()=>{
                //Go through the array of keys and add to 'orders' section of database
                for(let i = 0; i<items.length; i++){
                    
                    //Get item object properties
                    let menuItem = menu[items[i]]

                    //use menu properties to get price and add to total price
                    price+=menuItem['price']*quantity[i];

                    //update database
                    update(ref(db, 'users/' + userID + '/accountInfo/orders/'+date), {
                        [items[i]]: quantity[i]
                    })
                .catch((error)=>{
                    alert('Error: item could not be added')
                });
                }
                //Add total order price to the database
                update(ref(db, 'users/' + userID + '/accountInfo/orders/'+date), {
                    ['price']: price
                }).then(()=>{
                    alert('Order placed successfully!');
                }).catch((error)=>{
                    alert('Error: issue with price calculation');
                });
            })
        }
        else{
            alert('Cannot place a blank order');
            throw new Error('Cannot place a blank order');
        }
    });
}

//Get previous order names from Firebase
async function getPrevOrders(userID, elementID){
    
    //Set reference value
    let orderList = document.getElementById(elementID); 

    //Create empty array for orders
    let orders=[];

    //Set default value of selection list
    orderList.innerHTML=`
    <option disabled selected value="">Select an option</option>
    `;

    //Get database
    const dbref = ref(db);

    //Wait for all data to be pulled from the Firebase
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders')).then((snapshot)=> {

        if(snapshot.exists()){

            snapshot.forEach(child => {

            //Push key: value pairs to corresponding arrays
            orders.push(child.key);
            });

            //Add each key as an option in the orderList
            for(let i = 0; i<orders.length; i++){
                let listOrder = document.createElement("option");
                listOrder.value=orders[i];
                listOrder.innerHTML=orders[i];
                orderList.append(listOrder);
            }
        }
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
}

//Get list of items from previous order
async function getPrevOrderItem(userID,order){
    
    //Get reference value
    let itemList = document.getElementById('prevItemSelect');

    //Create empty items array
    const items = [];

    //Set default list value
    itemList.innerHTML= `<option disabled selected value="">Select an option</option>
            `;

    //Get database
    const dbref = ref(db);
    
    //Wait for all data to be pulled from the Firebase
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders/'+order)).then((snapshot)=> {

        if(snapshot.exists()){

            snapshot.forEach(child => {

            //Push key: value pairs to corresponding arrays
            if(child.key!='price'){
                items.push(child.key);
            }
            });

            //For each item in the order add the name to itemList
            for(let i=0; i<items.length; i++){
                let listItem = document.createElement("option");
                listItem.value=items[i];
                let menuItem=menu[items[i]];
                listItem.innerHTML =menuItem['name'];
                itemList.append(listItem);
            }
        }
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
}

//Get specific quantity value from a previous order
async function getPrevOrderSpecific(userID, order, item){
    
    //Get reference value
    let viewItem= document.getElementById('prevOrderSpecificView');
    
    //Remove any value from viewItem
    viewItem.innerHTML='';

    //Get Database
    const dbref = ref(db);
    
    //Wait for all data to be pulled from the Firebase
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders/'+order)).then((snapshot)=> {
        console.log(snapshot)
        if(snapshot.exists()){
            snapshot.forEach(child => {;
                //If the key value is equal to the selected item, print the quantity of the item in the order
                if(child.key==item){
                    let menuItem = menu[item];
                    viewItem.innerHTML=`The order has ${child.val()} ${menuItem['name']} orders.`;   
                };
        })}
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
}

//Get an entire previous order
async function getPrevOrderFull(userID,order){
    
    //create variables
    const items = [];
    const quantities = [];
    let totalPrice=0;

    //Get reference values
    let tbodyEl = document.getElementById('order-table'); 
    let tFooter = document.getElementById('order-price-total')

    //Clear any existing values from the table
    tbodyEl.innerHTML='';   
    tFooter.innerHTML = '';

    //Get database
    const dbref = ref(db);

    //Wait for all data to be pulled from the Firebase
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders/'+order)).then((snapshot)=> {

        if(snapshot.exists()){

            snapshot.forEach(child => {

            //Push key: value pairs to corresponding arrays
            items.push(child.key);
            quantities.push(child.val());
            });

            //Create table header
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

            //Dynamically add table rows to HTML using string interpolation
            for(let i = 0; i<items.length; i++){
                //Set variable totalPrice to the order price instead of adding it to the table
                if(items[i]=='price'){
                    totalPrice=quantities[i];
                }
                else{   
                //Add items to table
                    addOrderToTable(items[i], quantities[i], tbodyEl);
                }
            }
            
            //Create table footer
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
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
}

//Add items to the table
function addOrderToTable(item, quantity, tbodyEl){

    //Use object values for the item
    let menuItem=menu[item];
  
    //Add name, price, and quantity of item to the table
    
    let tableRow = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.className="cart-items-col p-2"
    let td2 = document.createElement("td");
    td2.className="cart-quant-col p-2"
    let td3 = document.createElement("td");
    td3.className="cart-price-col p-2"
    
    td1.innerHTML = menuItem['name'];
    td3.innerHTML = menuItem['price']*quantity;
    td2.innerHTML = quantity;
  
    tableRow.appendChild(td1);
    tableRow.appendChild(td2);
    tableRow.appendChild(td3);
  
    tbodyEl.appendChild(tableRow);
  }

//When page loads
window.onload = function(){
    //Get user information
    getUserName()

    //If not signed in, tell user and hide other information
    if(!currentUser){
        welcome.innerText = "You are not signed in. Please sign in to order";
        const page = document.getElementById("cart-functions");
        page.style.display = "none";
    }
    else{
        //Greet user
        welcome.innerText = 'Welcome '+currentUser.firstname+'!';
        
        //get user information and display data
        const userID = currentUser.uid;
        getDataSet(userID);
        getPrevOrders(userID, 'prevOrderSelectSpecific');
        getPrevOrders(userID, 'prevOrderSelectFull');
    }

}

//Update cart
document.getElementById('orderItem').onclick = function(){
    //Get values
    const item = document.getElementById('itemSelect').value;
    const quantity = document.getElementById('itemNum').value;
    const userID = currentUser.uid;

    //Call function
    addItemToOrder(userID, item, quantity);  

    //Reset data table
    getDataSet(userID);
}

//Delete item from cart
document.getElementById('deleteItem').onclick = function(){
    //Get values
    const item = document.getElementById('deleteItemSelect').value;
    const userID = currentUser.uid;

    //Call function
    deleteItem(item, userID);  
    //Reset data table
    getDataSet(userID);
}

//Delete all items from cart
document.getElementById('deleteAll').onclick = function(){
    //Get user id
    const userID = currentUser.uid;

    //Call function then reset data table
    deleteAll(userID).then(()=>{    
        getDataSet(userID);
    });
}

//Place order
document.getElementById('placeOrder').onclick = function(){
    //Get user id
    const userID = currentUser.uid;

    //Call function
    storeOrder(userID).then(()=>{
        //Delete all items from current cart 
            deleteAll(userID).then(()=>{    
            //Reset data table and previous order views
            getDataSet(userID);
            getPrevOrders(userID, 'prevOrderSelectSpecific');
            getPrevOrders(userID, 'prevOrderSelectFull');
        });
    });
    
}

//View entire previous order
document.getElementById('seePrevOrderFull').onclick=function(){
    //get values
    const userID = currentUser.uid;
    const order = document.getElementById('prevOrderSelectFull').value;

    //call function
    getPrevOrderFull(userID, order);
}

//Update dropdown list depending on selected order
document.getElementById('prevOrderSelectSpecific').onchange=function(){
    //get values
    const userID = currentUser.uid;
    const order = document.getElementById('prevOrderSelectSpecific').value;

    //call function
    getPrevOrderItem(userID, order);
}

//See specific item from previous order
document.getElementById('seePrevOrderSpecific').onclick=function(){
    //get values
    const userID = currentUser.uid;
    const order = document.getElementById('prevOrderSelectSpecific').value;
    const item = document.getElementById('prevItemSelect').value;

    //call function
    getPrevOrderSpecific(userID, order, item);
}

// Create sign out button
document.getElementById('signOut').onclick = () => {
    signOutUser("index.html");
}