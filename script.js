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

function formatForecastDay(timestamp) {
   let date = new Date(timestamp*1000);
   let day = date.getDay();
   let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   return days[day];
}

function dispalyForecast(response) { 
    let dailyForecast = response.data.daily;
   let forecastEl = document.querySelector("#forecast");
   let forecastHTML = "";
    
    dailyForecast.forEach(function (forecastDay, index) {
            if (index < 7) {
                forecastHTML = forecastHTML +
                `<div class="row day-info">
                <div class="day col-6">${formatForecastDay(forecastDay.dt)}</div>
                <div class="icon col-2">
                        <img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="weather-icon" class="weather-icon" width="45px" id="day-weather-icon">
                </div>
                <div class="temperatures-block col-4">
                        <div class="temperatures" id="forecast-temp">
                            <span><span class="min-temp" id="min-temp">${Math.round(forecastDay.temp.min)}</span>${!(fhrtBtn.classList.contains("active"))? "°C": "F"}</span> -
                            <span><span class="max-temp" id="max-temp">${Math.round(forecastDay.temp.max)}</span>${!(fhrtBtn.classList.contains("active"))? "°C": "F"}</span>
                        </div>
                </div>
                </div>`
            }
    });
    forecastEl.innerHTML = forecastHTML;
}
function getForecast(coords) { 
    let apiKey = "cff0f825ec363b6c795a4f1421098130";
    let apiURL = '';
    if (!fhrtBtn.classList.contains("active")) {
        apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
    } else {
        apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=imperial`;
    }
   axios.get(apiURL).then(dispalyForecast);

}

function displayLocation(response) { 
    let currentCityEl = document.querySelector("#current-city");
    currentCityEl.innerHTML = response.data.name;
}

function showLocation(position) {
    let latitude = Math.round(position.coords.latitude);
    let longitude = Math.round(position.coords.longitude);
    let apiKey = "cff0f825ec363b6c795a4f1421098130";
    let apiUrl = '';
    if (!fhrtBtn.classList.contains("active")) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    }
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

    getForecast(response.data.coord);

}

function findCityDescription(city) {
    let apiKey = "cff0f825ec363b6c795a4f1421098130";
    let apiUrl = '';
    if (!fhrtBtn.classList.contains("active")) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    }
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
    findCityDescription("Kyiv");
}

function convertToFhrt(event) { 
    event.preventDefault();
    celsBtn.classList.remove("active");
    fhrtBtn.classList.add("active");
    findCityDescription("Kyiv");
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