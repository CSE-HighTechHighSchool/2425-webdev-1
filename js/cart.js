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
    itemList.innerHTML=`
                <option disabled selected value="">Select an option</option>
            `;
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

  let menuItem=menu[item];

  let tableRow = document.createElement("tr");
  let td1 = document.createElement("td");
  td1.className="cart-items-col p-2"
  let td2 = document.createElement("td");
  td2.className="cart-quant-col p-2"
  let td3 = document.createElement("td");
  td3.className="cart-price-col p-2"

  td1.innerHTML = menuItem['name'];
  td3.innerHTML = menuItem['price']*quantity;
  totalPrice += menuItem['price']*quantity;
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

    let menuItem=menu[item];
    listItem.innerHTML =menuItem['name'];
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
        let menuItem = menu[items[i]]
        price+=menuItem['price']*quantity[i];
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

async function getPrevOrderItem(userID,order){
    
    let itemList = document.getElementById('prevItemSelect');
    const items = [];
    itemList.innerHTML= `<option disabled selected value="">Select an option</option>
            `;

    const dbref = ref(db);
    
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders/'+order)).then((snapshot)=> {

        if(snapshot.exists()){

            snapshot.forEach(child => {
            //console.log(child.key, child.val());

            //Push key: value pairs to corresponding arrays
            if(child.key!='price'){
                items.push(child.key);
            }
            });
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

async function getPrevOrderSpecific(userID, order, item){
    let viewItem= document.getElementById('prevOrderSpecificView');
    viewItem.innerHTML=`
    <option disabled selected value="">Select an option</option>
`;

    const dbref = ref(db);
    
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders/'+order)).then((snapshot)=> {
        console.log(snapshot)
        if(snapshot.exists()){
            snapshot.forEach(child => {;
                if(child.key==item){
                    console.log(child.val());
                    let menuItem = menu[item];
                    viewItem.innerHTML=`The order has ${child.val()} order(s) of ${menuItem['name']}.`;   
                };
        })}
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
}

async function getPrevOrderFull(userID,order){
    
    const items = [];
    const quantities = [];
    let tbodyEl = document.getElementById('order-table'); 
    let tFooter = document.getElementById('order-price-total')
    let totalPrice=0;

    tbodyEl.innerHTML='';   //Clear any existing table
    tFooter.innerHTML = '';

    const dbref = ref(db);

  //Wait for all data to be pulled from the FB
  //Must provide the path through the nodes to the data
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders/'+order)).then((snapshot)=> {

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
                if(items[i]=='price'){
                    totalPrice=quantities[i];
                }
                else{   
                    addOrderToTable(items[i], quantities[i], tbodyEl);
                }
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
    })
    .catch((error)=> {
        alert('unsuccessful, error'+error);
    });
}

function addOrderToTable(item, quantity, tbodyEl){

    //console.log(item, quantity);
  
    let menuItem=menu[item];
  
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

async function getPrevOrders(userID, elementID){
    let orderList = document.getElementById(elementID); 
    let orders=[];
    orderList.innerHTML=`
    <option disabled selected value="">Select an option</option>
`;

    const dbref = ref(db);

  //Wait for all data to be pulled from the FB
  //Must provide the path through the nodes to the data
    await get(child(dbref, 'users/'+userID+'/accountInfo/orders')).then((snapshot)=> {

        if(snapshot.exists()){

            snapshot.forEach(child => {
            //console.log(child.key, child.val());

            //Push key: value pairs to corresponding arrays
            orders.push(child.key);
            });


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
        getPrevOrders(userID, 'prevOrderSelectSpecific');
        getPrevOrders(userID, 'prevOrderSelectFull');
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
            getPrevOrders(userID, 'prevOrderSelectSpecific');
            getPrevOrders(userID, 'prevOrderSelectFull');
        });
    });
    
}

document.getElementById('seePrevOrderFull').onclick=function(){
    const userID = currentUser.uid;
    const order = document.getElementById('prevOrderSelectFull').value;

    getPrevOrderFull(userID, order);
}

document.getElementById('prevOrderSelectSpecific').onchange=function(){
    const userID = currentUser.uid;
    const order = document.getElementById('prevOrderSelectSpecific').value;
    getPrevOrderItem(userID, order);
}

document.getElementById('seePrevOrderSpecific').onclick=function(){
    const userID = currentUser.uid;
    const order = document.getElementById('prevOrderSelectSpecific').value;
    const item = document.getElementById('prevItemSelect').value;

    getPrevOrderSpecific(userID, order, item);
}