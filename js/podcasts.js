// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, update, child, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const db = getDatabase(app);

document.getElementById("submit-but").onclick = function(){checkInput("one")};
document.getElementById("submit-but-two").onclick = function(){checkInput("two")};
let user = null;

let navList = document.getElementById("nav-list");
let cartLink = document.getElementById("cart-link");


function getUserName(){
    //Grab value for the 'keep logged in' switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn');
  
    //Grab user information from the signIn.JS
    if(keepLoggedIn == 'yes'){
      user = JSON.parse(localStorage.getItem('user'));
    }
    else{
      user = JSON.parse(sessionStorage.getItem('user'));
    }
}

const dbref = ref(db);

async function getValue(episode, rating){

    const dbref = ref(db); // Firebase parameter for reqesing data
    let datum = 0;

    await get(child(dbref, 'ratings/ep' + episode + '/' + rating)).then((snapshot) => {
      if (snapshot.exists()){
        // To get specific value from a key: snapshot.val()[key]
        datum = snapshot.val();
      } else {
        alert('No data found');
      }
    }).catch((error) => {
      alert('unsuccessful, error' + error);
    });

    return datum;
}

async function checkInput(episode){
    let star1 = document.getElementById(episode+"-star1");
    let star2 = document.getElementById(episode+"-star2");
    let star3 = document.getElementById(episode+"-star3");
    let star4 = document.getElementById(episode+"-star4");
    let star5 = document.getElementById(episode+"-star5");
    let value = 0;

    star1.setAttribute('disabled', '');
    star2.setAttribute('disabled', '');
    star3.setAttribute('disabled', '');
    star4.setAttribute('disabled', '');
    star5.setAttribute('disabled', '');

    //console.log(star5.checked);
    if (star5.checked){
        value = 5;
    } else if (star4.checked){
        value = 4;
    } else if (star3.checked){
        value = 3;
    } else if (star2.checked){
        value = 2;
    } else {
        value = 1;
    }

    console.log(value);
    update(ref(db, 'users/' + user.uid + '/accountInfo/rating'), {
         [user.uid]: value
         }).then(() => {
           alert('Data stored successfully.');
         }).catch((error) => {
           alert('There was an error. Error: ' + error);
         });

    let newVal = await getValue(episode, value);

    // console.log(newVal);

    update(ref(db, 'ratings/ep' + episode), {
         [value]: newVal+1
         }).then(() => {
           alert('Data stored successfully.');
         }).catch((error) => {
           alert('There was an error. Error: ' + error);
         });
}

async function getData(){
    let epOneRatings = []
    let epTwoRatings = []

    await get(child(dbref, 'ratings/epone')).then((snapshot) => {
        if (snapshot.exists()){
          //console.log(snapshot.val());
    
          snapshot.forEach(child => {
            //console.log(child.key, child.val());
            // Push key value pairs to correspond to their arrays
            epOneRatings.push(child.val());
          })
        } else {
          alert('No data found.');
        }
      }).catch((error) => {
        alert('unsuccessful, error' + error);
      });


      await get(child(dbref, 'ratings/eptwo')).then((snapshot) => {
        if (snapshot.exists()){
          //console.log(snapshot.val());
    
          snapshot.forEach(child => {
            //console.log(child.key, child.val());
            // Push key value pairs to correspond to their arrays
            epTwoRatings.push(child.val());
          })
        } else {
          alert('No data found.');
        }
      }).catch((error) => {
        alert('unsuccessful, error' + error);
      });
    // get(ref(db, 'users/' + user.uid + '/accountInfo/rating/epone')).then((snapshot) => {
    //     if (snapshot.exists()){
    //         //console.log("This is snap" + snapshot.val());
    //         epOneRatings.push(snapshot.val());
    //     } else {
    //         console.log('No rating.');
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // })

    // get(ref(db, 'users/' + user.uid + '/accountInfo/rating/eptwo')).then((snapshot) => {
    //     if (snapshot.exists()){
    //         //console.log(snapshot.val());
    //         epTwoRatings.push(snapshot.val());
    //     } else {
    //         console.log('No rating.');
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // })

    //figure this out!
   return {epOneRatings, epTwoRatings};
}

async function createChart(){
    const data = await getData();
    console.log(data.epOneRatings);
    const episodeOne = document.getElementById('ep-one-rating');
    const episodeTwo = document.getElementById('ep-two-rating');

    Chart.defaults.font.family = "Comic Neue";
    Chart.defaults.color = '#000';

    const epOneChart = new Chart (episodeOne, {
        type: 'pie',
        data: {
            labels: ['1', '2', '3', '4', '5'],
            datasets: [{
                label: 'Episode One Ratings',
                data: data.epOneRatings,
                backgroundColor: ['#ffeac4', '#f5cd84', '#fccb68', '#ffbb54', '#e6a365'],
                hoverOffset: 4,
            }]
        }, 
        options: {
            responsive: false
        }
    })

    const epTwoChart = new Chart (episodeTwo, {
        type: 'pie',
        data: {
            labels: ['1', '2', '3', '4', '5'],
            datasets: [{
                label: 'Episode Two Ratings',
                data: data.epTwoRatings,
                backgroundColor:['#ffeac4', '#f5cd84', '#fccb68', '#ffbb54', '#e6a365'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false
        }
    })
}

window.onload = function(){
    getUserName();

    getData();

    createChart();

    if (!user) {
        navList.removeChild(cartLink)
    }
}

//