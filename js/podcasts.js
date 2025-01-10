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

function checkInput(episode){
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
     set(ref(db, 'users/' + userID + '/accountInfo/rating'), {
         ['ep'+episode]: value
         }).then(() => {
           alert('Data stored successfully.');
         }).catch((error) => {
           alert('There was an error. Error: ' + error);
         });
}

async function getData(){
    const response = await fetch('');
    const data = await response.text();

    //figure this out!
    return epOneRatings, epTwoRatings;
}

async function createChart(){
    const data = await getData();
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
                backgroundColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
                hoverOffset: 4
            }]
        }
    })

    const epTwoChart = new Chart (episodeTwo, {
        type: 'pie',
        data: {
            labels: ['1', '2', '3', '4', '5'],
            datasets: [{
                label: 'Episode Two Ratings',
                data: data.epTwoRatings,
                backgroundColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
                hoverOffset: 4
            }]
        }
    })
}