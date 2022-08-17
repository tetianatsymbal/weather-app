function getDate() {
let newDate = new Date();
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let currentDay = days[newDate.getDay()]; 
    let currentHour = newDate.getHours();
    let currentMinutes = newDate.getMinutes();
return (`${currentDay} ${currentHour}:${currentMinutes}`);
}
let dateInfo = document.querySelector(".date-info");
dateInfo.innerHTML = getDate();

function displayLocation(response) { 
    let currentCityEl = document.querySelector("#current-city");
    currentCityEl.innerHTML = response.data.name;
}

function showLocation(position) {
    let latitude = Math.round(position.coords.latitude);
    let longitude = Math.round(position.coords.longitude);
    console.log(`My position is latitude: ${latitude} and longitude:${longitude}`);
    let apiKey = "cff0f825ec363b6c795a4f1421098130";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayLocation);

    axios.get(apiUrl).then(displayCurrentWeatherDisc);
}

function findLocation() {
    return navigator.geolocation.getCurrentPosition(showLocation);
}
function displayCurrentWeatherDisc(response) {
    let currentTempEl = document.querySelector("#current-temp");
    let temperature = Math.round(response.data.main.temp);
    let currentCloudEl = document.querySelector("#cloudiness");
    let description = response.data.weather[0].description;
    let currentHumidityEl = document.querySelector("#humidity");
    let currentWindEl = document.querySelector("#wind");
    let iconEl = document.querySelector("#weather-icon");

    celsiusTemp = response.data.main.temp;

    currentTempEl.innerHTML = temperature;
    currentCloudEl.innerHTML = description.charAt(0).toUpperCase() + description.slice(1);
    currentHumidityEl.innerHTML = Math.round(response.data.main.humidity);
    currentWindEl.innerHTML = Math.round(response.data.wind.speed);
    iconEl.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconEl.setAttribute("alt", `${response.data.weather[0].description}`);
}

function findCityDescription(city) {
    let apiKey = "cff0f825ec363b6c795a4f1421098130";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayCurrentWeatherDisc);
}

function findCity(event) { 
    event.preventDefault();
    let currentCityEl = document.querySelector("#current-city");
    let searchFormInput = document.querySelector("#input-form");
    let currentCity = searchFormInput.value;
    currentCityEl.innerHTML = currentCity.charAt(0).toUpperCase() + currentCity.slice(1);
    return findCityDescription(currentCity);
}

function convertToCels(event) { 
    event.preventDefault();
    celsBtn.classList.add("active");
    fhrtBtn.classList.remove("active");
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = Math.round(celsiusTemp);
}

function convertToFhrt(event) { 
    event.preventDefault();
    celsBtn.classList.remove("active");
    fhrtBtn.classList.add("active");
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
}

let celsiusTemp = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", findCity);

let celsBtn = document.querySelector(".celsius");
celsBtn.addEventListener("click", convertToCels);

let fhrtBtn = document.querySelector(".fahrenheits");
fhrtBtn.addEventListener("click", convertToFhrt);

let currentLocationBtn = document.querySelector("#current-location");
currentLocationBtn.addEventListener("click", findLocation);

findCityDescription("Kyiv");