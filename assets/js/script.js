//global variables

var userInputEl = document.querySelector("#city-name");
var userFormEl = document.querySelector("#weather-form");
var weatherEl = document.querySelector("#weather-display");
var date = moment().format('L');

var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = userInputEl.value.trim();
    if (cityName) {
      cityData(cityName);
      var city = cityName;
      userInputEl.value = "";
    } else {
      alert("Please enter a city.");
    }
  };
  userFormEl.addEventListener("submit", formSubmitHandler);

var cityData = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=1a475907f14462be5a51f330f5a3465a";
  // var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&limit=1&appid=1a475907f14462be5a51f330f5a3465a";
  console.log(apiUrl);
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeatherData(lat, lon, city);
      });
    }
  });
};

var getWeatherData = function (lat, lon, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=1a475907f14462be5a51f330f5a3465a";
  console.log("onecall", apiUrl);
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
          console.log("temp", temp, "humidity", humidity, "uvi", uvi, "wind", wind, "icon", iconCode, "forecast", forecast);
          displayForecast(city, temp, humidity, uvi, wind, iconCode, forecast);
        });
      } else {
        alert("Error: Data Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

var displayForecast = function (city, temp, humidity, uvi, wind, iconCode, forecast) {
  var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

  weatherEl.innerHTML = "";

  var titleEl = document.createElement("div");
  titleEl.setAttribute("class", "card forecast col-12");
  weatherEl.append(titleEl);

  var weatherCity = document.createElement("h3");
  weatherCity.setAttribute("class", "card-header");
  weatherCity.innerHTML = city + " (" + date + ")" + "<img class='icon' src=' " + iconUrl + " '>";
  titleEl.append(weatherCity);

  var forecastInfo = document.createElement("div");
  forecastInfo.setAttribute("class", "card-body");
  titleEl.appendChild(forecastInfo);

var temperature = Math.floor((parseInt(temp) - 273.15) * (9/5) + 32);
var forecastArray = ["Temp: " + temperature + "°F", "Wind: " + wind + "mph", "Humidity: " + humidity + "%"];
console.log(forecastArray);
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
    uviColors.setAttribute("class", "fav-uvi")
} else if (uvi > 3 && uvi < 7) {
    uviColors.setAttribute("class", "moderate-uvi");
} else if (uvi >= 7) {
    uviColors.setAttribute("class", "extreme-uvi");
}
};

var fiveDayForecast = document.createElement("div"); 