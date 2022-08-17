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

function displayLocationTemp(response) { 
    let currentCityEl = document.querySelector("#current-city");
    let currentCity = response.data.name;
    currentCityEl.innerHTML = currentCity;
    console.log(currentCity);
    return displayCurrentTemp(response);
}

function showLocationTemp(position) {
    let latitude = Math.round(position.coords.latitude);
    let longitude = Math.round(position.coords.longitude);
    console.log(`My position is latitude: ${latitude} and longitude:${longitude}`);
    let apiKey = "cff0f825ec363b6c795a4f1421098130";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayLocationTemp);
    axios.get(apiUrl).then(displayCurrentCloud);
    axios.get(apiUrl).then(displayCurrentHumidity);
    axios.get(apiUrl).then(displayCurrentWind);
}
function findLocation() {
    return navigator.geolocation.getCurrentPosition(showLocationTemp);
}
function displayCurrentTemp(response) {
    console.log(response.data);
    let currentTempEl = document.querySelector("#current-temp");
    let temperature = Math.round(response.data.main.temp);
    currentTempEl.innerHTML = temperature;
}

function displayCurrentCloud(response) {
    let currentCloudEl = document.querySelector("#cloudiness");
    let description = response.data.weather[0].description;
    currentCloudEl.innerHTML = description.charAt(0).toUpperCase() + description.slice(1);
}

function displayCurrentHumidity(response) {
    let currentHumidityEl = document.querySelector("#humidity");
    currentHumidityEl.innerHTML = Math.round(response.data.main.humidity);
}

function displayCurrentWind(response) {
    let currentWindEl = document.querySelector("#wind");
    currentWindEl.innerHTML = Math.round(response.data.wind.speed);
}

function findCityTemp(city) {
    let apiKey = "cff0f825ec363b6c795a4f1421098130";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayCurrentTemp);
    axios.get(apiUrl).then(displayCurrentCloud);
    axios.get(apiUrl).then(displayCurrentHumidity);
    axios.get(apiUrl).then(displayCurrentWind);
}

function findCity(event) { 
    event.preventDefault();
    let currentCityEl = document.querySelector("#current-city");
    let searchFormInput = document.querySelector("#input-form");
    let currentCity = searchFormInput.value;
    currentCityEl.innerHTML = currentCity;
    return findCityTemp(currentCity);
}

function changeCurrentUnits(convertedTemp, currentTemp) { 
    let links = document.querySelectorAll("a .temp-units a")
    currentTemp.innerHTML = convertedTemp;
    links.classList.add("actual-units");
}

function convertToCels(event) { 
    event.preventDefault();
    let currentTemp = document.querySelector("#current-temp");
    let currentTempValue = parseInt(currentTemp.textContent);
    let convertedTemp = Math.round((currentTempValue - 32) * 5 / 9);
    return changeCurrentUnits(convertedTemp, currentTemp);   
}

function convertToFhrt(event) { 
    event.preventDefault();
    let currentTemp = document.querySelector("#current-temp");
    let currentTempValue = parseInt(currentTemp.textContent);
    let convertedTemp = Math.round((currentTempValue * 9) / 5 + 32);
    return changeCurrentUnits(convertedTemp, currentTemp);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", findCity);

let celsBtn = document.querySelector(".celsius");
celsBtn.addEventListener("click", convertToCels);

let fhrtBtn = document.querySelector(".fahrenheits");
fhrtBtn.addEventListener("click", convertToFhrt);

let currentLocationBtn = document.querySelector("#current-location");
currentLocationBtn.addEventListener("click", findLocation);