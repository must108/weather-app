setTimeout(function() {
    makeVisible();
}, 500);

document.addEventListener("keydown", e => {
    if(e.key === "Enter"){
        boxNotVisible();
        weatherNotVisible();
        inputVal = input.value;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;
        if(time === 0){
            fetchData(url);
            time = 1;
        } else if(time === 1){
        setTimeout(function(){
            fetchData(url);
        }, 1150);
    }
    }
});

if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showCity, showError);
} else {
    showError(error);
}

const fetchData = async (url) => {
    try {
        let response = await fetch(url);

        if(!response.ok){
            throw new Error('response was not ok');
        }

        let data = await response.json();

        const { main, name, sys, weather } = data;
        let icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;


        cityname.innerHTML = name.toLowerCase() + ", " + (sys.country).toLowerCase();
        temp.innerHTML = Math.round(main.temp) + "°F";
        imageElem.src = icon;
        imageElem.alt = weather[0]["main"];
        desc.innerHTML = weather[0]["description"];
        amendBut();
        moveBut();
        boxVisible();
        setTimeout(function() {
            weatherVisible()
        }, 300);
    } catch(error) {
        error1.innerHTML = `please search for a valid city!`;
        errorFunct();
    }
};

const changeTemp = async (url, string) => {
    try {
        let response = await fetch(url);

        if(!response.ok) {
            throw new Error('response was not ok');
        }

        let data = await response.json();
        const { main } = data;

        if(string === "imperial"){
            temp.innerHTML = Math.round(main.temp) + "°F";
        } else if (string === "metric"){
            temp.innerHTML = Math.round(main.temp) + "°C";
        }
    } catch(error){
        error1.innerHTML = `error in temperature conversion`;
        errorFunct();
    }
}

function weatherNotVisible(){
    cityname.style.transition = 0.1 + "s";
    temp.style.transition = 0.1 + "s";
    imageElem.style.transition = 0.1 + "s";
    desc.style.transition = 0.1 + "s";
    cityname.style.opacity = 0;
    temp.style.opacity = 0;
    imageElem.style.opacity = 0;
    desc.style.opacity = 0;
    button1.style.transition = 2 + "s";
    button2.style.transition = 2 + "s";
    moveButBack();
    setTimeout(function(){
        amendBut();
    }, 1000);
}

function Fahrenheit(){
    const newUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`; 
    changeTemp(newUrl, "imperial");
}

function Celsius(){
    const newUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`; 
    changeTemp(newUrl, "metric");
}

function weatherVisible(){
    cityname.style.transition = 2 + "s";
    temp.style.transition = 2 + "s";
    imageElem.style.transition = 2 + "s";
    desc.style.transition = 2 + "s";
    cityname.style.opacity = 1;
    temp.style.opacity = 1;
    imageElem.style.opacity = 1;
    desc.style.opacity = 1;
}

function makeVisible(){
    whole.style.opacity = 1;
}

function moveBut(){
    button1.style.margin = 30 + "px" + " " + 0 + "px" + " " + 0 + "px" + " " + 0 + "px";
    button2.style.margin = 30 + "px" + " " + 0 + "px" + " " + 0 + "px" + " " + 0 + "px";
}

function boxVisible() {
    error1.style.opacity = 0;
    box.style.height = 300 + "px";
    box.style.width = 250 + "px";
}

function boxNotVisible() {
    box.style.height = 0 + "px";
    box.style.width = 0 + "px";
}

function moveButBack(){
    button1.style.margin = 0 + "px" + " " + 0 + "px" + " " + 0 + "px" + " " + 0 + "px";
    button2.style.margin = 0 + "px" + " " + 0 + "px" + " " + 0 + "px" + " " + 0 + "px";
}

function amendBut(){
    button1.style.transition = 0.5 + "s";
    button2.style.transition = 0.5 + "s";
}

function errorFunct(){
    boxNotVisible();
    weatherNotVisible();
    error1.style.opacity = 1;
}


function showCity(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const mapUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapKey}`;
    getMap(mapUrl);
}

const getMap = async (url) => {
    try {
        let response = await fetch(url);

        if(!response.ok){
            throw new Error('FAILED_RESPONSE');
        }

        let data = await response.json();

        const city = data.results[0].address_components.find((component) => 
        component.types.includes('locality')
        ).long_name;

        currCityName = city.toLowerCase();
        searching.value = currCityName;
    } catch (error) {
        showError(error);
    }
};

function showError(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            error1.innerHTML = `location request denied`;
            errorFunct();
            break;
        case error.POSITION_UNAVAILABLE:
            error1.innerHTML = `location info unavailable`;
            errorFunct();
            break;
        case error.TIMEOUT:
            error1.innerHTML = `user location request timed out`;
            errorFunct();
            break;
        case error.FAILED_RESPONSE:
            error1.innerHTML = `failed response error`;
            errorFunct();
            break;
        case error.UNKNOWN_ERROR:
            error1.innerHTML = `unknown error occured`;
            errorFunct();
            break;
    }
}

const title = document.getElementById("title");
const input = document.querySelector("input");
const cityname = document.getElementById("city-name");
const apiKey = 'YOUR_WEATHER_KEY';
const desc = document.getElementById("description");
const temp = document.getElementById("temper");
const imageElem = document.getElementById("image");
const box = document.getElementById("weather-box");
const button1 = document.getElementById("tempbutt1");
const button2 = document.getElementById("tempbutt2");
const error1 = document.getElementById("error");
const whole = document.getElementById("wrapper");
const searching = document.getElementById("search");
let currCityName;
let inputVal;
let time = 0;
const mapKey = `YOUR_GOOGLE_MAPS_KEY`;
