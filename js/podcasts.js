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

let user = null;

let navList = document.getElementById("nav-list");
let cartLink = document.getElementById("nav-cart");


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

    // grabs star values
    let star1 = document.getElementById(episode+"-star1");
    let star2 = document.getElementById(episode+"-star2");
    let star3 = document.getElementById(episode+"-star3");
    let star4 = document.getElementById(episode+"-star4");
    let star5 = document.getElementById(episode+"-star5");
    let value = 0;

    // disables star rating selection
    star1.setAttribute('disabled', '');
    star2.setAttribute('disabled', '');
    star3.setAttribute('disabled', '');
    star4.setAttribute('disabled', '');
    star5.setAttribute('disabled', '');

    //console.log(star5.checked);
    // sets value based on which star is selected
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

    //console.log(value);
    // adds rating to user's information in firebase
    update(ref(db, 'users/' + user.uid + '/accountInfo/rating'), {
         ['ep'+episode]: value
         }).then(() => {
           alert('Thank you for rating!');
         }).catch((error) => {
           alert('There was an error. Error: ' + error);
         });

    
    let newVal = await getValue(episode, value);
    // console.log(newVal);

    // adds one to the rating count for pie chart
    update(ref(db, 'ratings/ep' + episode), {
         [value]: newVal+1
         }).then(() => {
           console.log('data stored successfully.');
         }).catch((error) => {
           alert('There was an error. Error: ' + error);
         });
}

async function getData(){
    let epOneRatings = []
    let epTwoRatings = []

    // grabs ratings for episode 1
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


      // grabs ratings for episode 2
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
   // returns number of people who gave 1 star ratings, 2 star ratings, etc. for each episode
   return {epOneRatings, epTwoRatings};
}

function checkRatingExist(episode){
    const dbref = ref(db);

    // if user already rated, doesn't let them rate again
    get(child(dbref, 'users/' + user.uid + '/accountInfo/rating/ep' + episode)).then((snapshot) => {
        if (snapshot.exists()){
            //console.log(snapshot.val());
            disableStars(episode, snapshot.val());
        }
        else { // if user didn't rate, let them select a rating
            if (episode === "one"){
                document.getElementById("submit-but").onclick = function(){checkInput("one")};
                console.log('one triggered');
            } else {
                document.getElementById("submit-but-two").onclick = function(){checkInput("two")};
            }
        }
      }).catch((error) => {
        alert('unsuccessful, error' + error);
      });
    }

function disableStars(episode, value){
    let star1 = document.getElementById(episode+"-star1");
    let star2 = document.getElementById(episode+"-star2");
    let star3 = document.getElementById(episode+"-star3");
    let star4 = document.getElementById(episode+"-star4");
    let star5 = document.getElementById(episode+"-star5");

    // checks what rating the user already gave so we can set it back to that
    if (value === 2) {
        star2.checked = true;
    } else if (value === 3) {
        star2.checked = true;
        star3.checked = true;
    } else if (value === 4) {
        star2.checked = true;
        star3.checked = true;
        star4.checked = true;
    } else {
        //console.log('i made it here!');
        star2.checked = true;
        star3.checked = true;
        star4.checked = true;
        star5.checked = true;
    }

    // disables stars so user can't rate again
    star1.setAttribute('disabled', '');
    star2.setAttribute('disabled', '');
    star3.setAttribute('disabled', '');
    star4.setAttribute('disabled', '');
    star5.setAttribute('disabled', '');
    //console.log(star5.checked);
}

async function createChart(){
    const data = await getData();
    //console.log(data.epOneRatings);
    const episodeOne = document.getElementById('ep-one-rating');
    const episodeTwo = document.getElementById('ep-two-rating');

    Chart.defaults.font.family = "Comic Neue";

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
            aspectRatio: 3 // makes chart smaller
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
            aspectRatio: 3 // makes chart smaller
        }
    })
}

window.onload = function(){

    // gets user information
    getUserName();

    getData();

    // draws pie charts
    createChart();

    // deletes cart page if user is not signed in
    if (!user) {
        navList.removeChild(cartLink)
    }

    // checks if user already rated
    checkRatingExist("one");
    checkRatingExist("two");

}