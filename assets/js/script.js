//global variables
var userInput = document.querySelector("#search-name");
var userFormEl = document.querySelector("#weather-form");
var weatherEl = document.querySelector("#weather-display");
var searchList = document.querySelector("#search-list");
var date = moment().format("L");

// function that collects the data from the input and sends it to cityData() and searchButtons()
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = userInput.value.trim();
  if (cityName) {
    cityData(cityName);
    var city = cityName;
    searchButtons(city);
    userInput.value = "";
  } else {
    alert("Please enter a city.");
  }
};
userFormEl.addEventListener("submit", formSubmitHandler);

// take the input value and calls the lat and lon from the api 
var cityData = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=1a475907f14462be5a51f330f5a3465a";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeatherData(lat, lon, city);
        searchButtons(city);
      });
    }
  });
};

// creates buttons from the input data and starts the savesearch()
var searchButtons = function (city) {

  searchRepeat = document.getElementById(city);
  if (!searchRepeat) {
  searchResultButton = document.createElement("button");
  searchResultButton.setAttribute("class", "search-btns click btn btn-outline-info");
  searchResultButton.setAttribute("id", city);
  searchResultButton.textContent = city;
  searchList.appendChild(searchResultButton)
  saveSearch(city);
  }
}

// uses the lon and lat to get weather data
var getWeatherData = function (lat, lon, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=1a475907f14462be5a51f330f5a3465a";
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var temp = data.current.temp;
          var humidity = data.current.humidity;
          var uvi = data.current.uvi;
          var wind = data.current.wind_speed;
          var iconCode = data.current.weather[0].icon;
          var forecast = data.daily;
    
          displayForecast(city, temp, humidity, uvi, wind, iconCode);
          fiveDayForecast(city, forecast, iconCode);
        });
      } else {
        alert("Error: Data Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

// displays the current weather 
var displayForecast = function (city, temp, humidity, uvi, wind, iconCode) {
  var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  weatherEl.innerHTML = "";

  var titleEl = document.createElement("div");
  titleEl.setAttribute("class", "card mb-20 col-12");
  weatherEl.append(titleEl);

  var weatherCity = document.createElement("h3");
  weatherCity.setAttribute("class", "card-header current-header");
  weatherCity.innerHTML =
    city + " (" + date + ")" + "<img class='icon' src=' " + iconUrl + " '>";
  titleEl.append(weatherCity);

  var forecastInfo = document.createElement("div");
  forecastInfo.setAttribute("class", "card-body");
  titleEl.appendChild(forecastInfo);

  var temperature = Math.floor((parseInt(temp) - 273.15) * (9 / 5) + 32);
  var forecastArray = [
    "Temp: " + temperature + "°F",
    "Wind: " + wind + "mph",
    "Humidity: " + humidity + "%",
  ];
  for (var i = 0; i < forecastArray.length; i++) {
    var displayData = document.createElement("p");
    displayData.setAttribute("class", "card-text");
    displayData.innerHTML = forecastArray[i];
    forecastInfo.appendChild(displayData);
  }

  var uviInfo = document.createElement("p");
  uviInfo.innerHTML = "UV Index: " + "<span>" + uvi + "</span>";
  uviInfo.setAttribute("class", "card-text");
  forecastInfo.appendChild(uviInfo);
  var uviColors = document.querySelector("span");
  if (uvi <= 3) {
    uviColors.setAttribute("class", "fav-uvi");
  } else if (uvi > 3 && uvi < 7) {
    uviColors.setAttribute("class", "moderate-uvi");
  } else if (uvi >= 7) {
    uviColors.setAttribute("class", "extreme-uvi");
  }
};

// displays the 5 day forecast
var fiveDayForecast = function (city, forecast, iconCode) {

  var fiveDayEL = document.createElement("div");
  fiveDayEL.setAttribute("class", "col-12 mt-20");
  fiveDayEL.innerHTML = "<h4 'class=forecast-header'> Five Day Forecast: </h4>";
  weatherEl.appendChild(fiveDayEL);

  for (var i = 0; i < forecast.length - 3; i++) {
    var fiveDayCards = document.createElement("div");
    fiveDayCards.setAttribute(
      "class",
      "card col-sm-12 col-lg-2 mb-2 five-card"
    );
    weatherEl.appendChild(fiveDayCards);

    var eachDay = document.createElement("h4");
    eachDay.setAttribute("class", "five-header");
    var dailyMoment = moment().add([i], "d").format("l");
    eachDay.textContent = dailyMoment;
    fiveDayCards.append(eachDay);

    var dailyForecast = document.createElement("div");
    dailyForecast.setAttribute("class", "card-body");
    fiveDayCards.appendChild(dailyForecast);

    var forecastIcon = document.createElement("img");
    var fiveDayIcon = forecast[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + fiveDayIcon + ".png";
    forecastIcon.setAttribute("class", "icon");
    forecastIcon.setAttribute("src", iconUrl);
    dailyForecast.append(forecastIcon);

    var temperature = Math.floor(
      (parseInt(forecast[i].temp.day) - 273.15) * (9 / 5) + 32
    );
    var wind = forecast[i].wind_speed;
    var humidity = forecast[i].humidity;
    var fiveDayArray = [
      "Temp: " + temperature + "°F",
      "Wind: " + wind + "mph",
      "Humidity: " + humidity + "%",
    ];
    for (var j = 0; j < fiveDayArray.length; j++) {
      var fiveDayData = document.createElement("p");
      fiveDayData.setAttribute("class", "card-text");
      fiveDayData.innerHTML = fiveDayArray[j];
      dailyForecast.appendChild(fiveDayData);
    }
  }
};


// saves the input data to local storage
var saveSearch = function (city) {
    var searchArray = JSON.parse(window.localStorage.getItem("searchArray")) || [];
    var searchResult = city;
    if (!searchArray.includes(searchResult)) {
        searchArray.push(searchResult);
    }
    localStorage.setItem("searchArray", JSON.stringify(searchArray));
};

// loads the city buttons from loacal storage
var loadSearch = function () {
    var savedSearches = JSON.parse(localStorage.getItem("searchArray")) || [];
    for (var i=0; i < savedSearches.length; i++) {
        cityData(savedSearches[i]);
    }
};


loadSearch();

// click event that takes that data from the buttons and loads it into the cityData function
$("body").on("click", ".click", function(){
  console.log("click!");
  var buttonText = $(this).text();
  console.log(buttonText);
  cityData(buttonText)
});