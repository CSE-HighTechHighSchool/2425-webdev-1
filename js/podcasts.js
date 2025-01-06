function checkInput(){
    let star1 = document.getElementById("star1");
    let star2 = document.getElementById("star2");
    let star3 = document.getElementById("star3");
    let star4 = document.getElementById("star4");
    let star5 = document.getElementById("star5");

    star1.setAttribute('disabled', '');
    star2.setAttribute('disabled', '');
    star3.setAttribute('disabled', '');
    star4.setAttribute('disabled', '');
    star5.setAttribute('disabled', '');
}

async function getData(){
    const response = await fetch('');
    const data = await response.text();

    //figure this out!
    return response;
}

async function createChart(){
    const data = await getData();
    const episodeOne = document.getElementById('ep-one-rating');
    const episodeTwo = document.getElementById('ep-two-rating');

    Chart.defaults.font.family = "Comic Neue";
    Chart.defaults.color = '#000';

    const epOneChart = new Chart (episodeOne, {
        type: ''
    })
}