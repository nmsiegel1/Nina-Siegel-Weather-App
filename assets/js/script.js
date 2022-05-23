//global variables

var userInputEl = document.querySelector("#city-name");
var userFromEl = document.querySelector("#weather-form");
var weatherEl = document.querySelector("#weather-display");

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
  userFromEl.addEventListener("submit", formSubmitHandler);

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
          var icon = data.current.weather[0].icon;
          var forecast = data.daily;
          console.log("temp", temp, "humidity", humidity, "uvi", uvi, "wind", wind, "icon", icon, "forecast", forecast);
          displayForecast(city, humidity, uvi, wind, icon, forecast);
        });
      } else {
        alert("Error: Data Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

var displayForecast = function () {
  weatherEl.innerHTML = "";

  var titleEl = document.createElement("div");
  titleEl.setAttribute("class", "card forecast col-12");
  weatherEl.append(titleEl);
};
