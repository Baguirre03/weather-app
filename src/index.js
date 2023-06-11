import "./style.css";
import format from "date-fns/format";

const weatherHeader = document.querySelector(".weather-header");
let typeOfTemp = "C";
let currentPlace;
defaultSearch();

const searchFromForm = (() => {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateCurrentPlace(input.value);
    searchWeather(currentPlace);
  });

  const checkbox = document.querySelector("#switch");
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      //is Celcius - Changing to Farenheight
      updateTypeOfTemp("F");
      changeWeatherTypeDisplay();
      searchWeather(currentPlace);
    } else {
      //is Farenheight - Changing to Celcius
      updateTypeOfTemp("C");
      changeWeatherTypeDisplay();
      searchWeather(currentPlace);
    }
  });
})();

function changeWeatherTypeDisplay() {
  const display = document.querySelector(".tempDisplay");
  if (display.textContent.includes("C")) {
    display.textContent = "F";
  } else {
    display.textContent = "C";
  }
}

function updateCurrentPlace(place) {
  currentPlace = place;
}

function updateTypeOfTemp(type) {
  typeOfTemp = type;
}

async function defaultSearch() {
  try {
    const weatherData = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=61a80c65e68244318ae200949231005&q=auto:ip&days=4`,
      { mode: "cors" }
    );
    const formattedData = await weatherData.json();
    updateCurrentPlace(formattedData.location.name);
    dataIntoObject(formattedData);
  } catch (err) {
    throw new Error(err);
  }
}

async function searchWeather(search) {
  try {
    const weatherData = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=61a80c65e68244318ae200949231005&q=${search}&days=4`,
      { mode: "cors" }
    );
    const formattedData = await weatherData.json();
    dataIntoObject(formattedData);
  } catch (err) {
    defaultSearch();
    throw new Error(err);
  }
}

function dataIntoObject(data) {
  const forecast = data.forecast.forecastday;
  const location = data.location;
  let weather = collectAllData(
    locationDataIntoObj(location),
    forecastDataIntoObj(forecast)
  );
  displayContent(weather);
}

function locationDataIntoObj(locationData) {
  let location = {
    country: locationData.country,
    city: locationData.name,
    region: locationData.region,
  };
  return location;
}

function forecastDataIntoObj(forecastArray) {
  let forecastContent = [];
  forecastArray.forEach((forecast) => {
    let days = {
      date: forecast.date,
      avgtemp_c: forecast.day.avgtemp_c,
      avgtemp_f: forecast.day.avgtemp_f,
      condition: forecast.day.condition.text,
      maxtemp_f: forecast.day.maxtemp_f,
      maxtemp_c: forecast.day.maxtemp_c,
    };
    forecastContent.push(days);
  });
  return forecastContent;
}

function collectAllData(locationInfo, weatherInfo) {
  let allData = { location: locationInfo, weather: weatherInfo };
  return allData;
}

function clearContainer() {
  const container = document.querySelector(".weather");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

let weatherEmojis = {
  cloudy: "☁️",
  sunny: "☀️",
  rainy: "🌧",
  storm: "⛈",
};

function changeHeaderEmoji(weatherEmoji) {
  weatherHeader.textContent = weatherEmoji;
}

function changeEmojis(weatherType) {
  if (weatherType.includes("rain")) {
    return weatherEmojis.rainy;
  } else if (weatherType.includes("cloud")) {
    return weatherEmojis.cloudy;
  } else if (weatherType.includes("sun")) {
    return weatherEmojis.sunny;
  } else if (weatherType.includes("storm")) {
    return weatherEmojis.storm;
  }
}

function displayContent(data) {
  clearContainer();
  console.log(data);
  displayDays();

  //location
  const cityState = document.querySelector(".city");
  const country = document.querySelector(".country");
  cityState.textContent = data.location.city + ", " + data.location.region;
  country.textContent = data.location.country;

  //forecast
  let forecast = data.weather;
  //for header emoji
  changeHeaderEmoji(changeEmojis(forecast[0].condition));

  //for rest of forecast
  forecast.forEach((weather) => {
    const weatherHolder = document.querySelector(".weather");

    const eachWeather = document.createElement("div");
    weatherHolder.appendChild(eachWeather);

    const date = document.createElement("div");
    date.textContent = weather.date;

    const currentTemp = document.createElement("div");
    const maxTemp = document.createElement("div");
    if (typeOfTemp === "C") {
      currentTemp.textContent = "Current Temp Celcius: " + weather.avgtemp_c;
      maxTemp.textContent = "Max Temp Celcius: " + weather.maxtemp_c;
    } else if (typeOfTemp === "F") {
      currentTemp.textContent =
        "Current Temperature Farenheight: " + weather.avgtemp_f;
      maxTemp.textContent = "Max Temperature Farenheight: " + weather.maxtemp_f;
    }
    const condition = document.createElement("div");
    condition.textContent = "condition: " + weather.condition;

    const emoji = document.createElement("h1");
    emoji.textContent = changeEmojis(weather.condition);

    eachWeather.append(date, emoji, currentTemp, maxTemp, condition);
  });
}

function displayDays() {
  const today = document.querySelector(".today");
  const date = document.querySelector(".date");
  const dayOfWeek = format(new Date(), "EEEE");
  const dateFormatted = format(new Date(), "PP");
  today.textContent = "Happy " + dayOfWeek + "! ";
  date.textContent = dateFormatted;
}
