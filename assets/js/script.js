// global variables for search
var searchButtonEl = document.querySelector(".search-btn");

// variables for location info
var apiKey = "ffe65789d16418b39e33722ce53e0bb8";
var locationName = "";
var locationState = "";
var locationCountry = "";
var locationLat = "";
var locationLon = "";

//variables and array for all weather related info
var currentTemp = "";
var currentWeather = "";
var weatherIcon = "";
var weatherInfo = [];

// *** potential variables for bells and whistles
// var ingredInputEl = document.querySelector("#ingred-name")
// var resultsArea = document.querySelector("#results-area")



// handle submit event
function formSubmitHandler(event) {
  event.preventDefault();
  var searchInputEl = document.querySelector("#search-city");
  var locateArray = searchInputEl.value.split(/[ ,]+/);

  // Card for liquor options
  const OptionListEl = document.querySelector(".modal-body");
  let choiceArray = [];
  
  for (let i = 0; i < OptionListEl.children.length; i++) {
    let checkbox = OptionListEl.children[i].children[0];
    let label = OptionListEl.children[i].children[1];
  
    if (checkbox.type == "checkbox" && checkbox.checked) {
      choiceArray.push(label.textContent);
    }
  }
  
  console.log(choiceArray);
  localStorage.setItem("choices", JSON.stringify(choiceArray));
  

  if (locateArray) {
    getLatLon(locateArray[0], locateArray[1], "");
    // clear old content
    searchInputEl.value = "";
  } else {
    alert("Please enter an ingredient.");
  }
}

// search will run this function first to grab the locations lat and lon
function getLatLon(city, state, country) {
  var geocodeApi = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${apiKey}`;

  fetch(geocodeApi)
    .then(function (response) {
      if (!response.ok) {
        console.log(response.json());
        var alertEl = document.createElement("div");
        alertEl.classList = "modal";
        alertEl.style.display = "block";
        var messageEl = document.createElement("h3");
        messageEl.classList = "modal-content";
        messageEl.textContent = "Failed to fetch weather for this location";
        alertEl.appendChild(messageEl);
        document.querySelector("main").appendChild(alertEl);

        window.onclick = function (event) {
          if (event.target == alertEl) {
            alertEl.style.display = "none";
          }
        };
      }

      return response.json();
    })
    .then(function (data) {
      locationName = data[0].name;
      locationState = data[0].state;
      locationCountry = data[0].country;
      locationLat = data[0].lat;
      locationLon = data[0].lon;

      // after getting the lat and lon this function runs a fetch request to get the actual weather
      getWeather();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getWeather() {
  var weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationLat}&lon=${locationLon}&exclude={part}&appid=${apiKey}&units=imperial`;
  fetch(weatherApiUrl)
    .then(function (response) {
      if (!response.ok) {
        console.log(response.json());
        alert("failed to fetch weather data");
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data.current.temp);
      console.log(data.current.weather[0].description);
      console.log(data.current.weather[0].icon);

      currentTemp = data.current.temp;
      currentWeather = data.current.weather[0].description;
      weatherIcon = data.current.weather[0].icon;

      weatherInfo = [currentTemp, currentWeather, weatherIcon];

      localStorage.setItem("weather", JSON.stringify(weatherInfo));

      window.location = "./pages/recommendation.html";
    })
    .catch(function (error) {
      console.log(error);
    });
}

searchButtonEl.addEventListener("click", formSubmitHandler);
