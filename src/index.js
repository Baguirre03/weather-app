import "./style.css";
const searchFromForm = (() => {
  const form = document.querySelector("form");
  const input = document.querySelector("input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchWeather(input.value);
  });
})();

async function defaultSearch() {
  try {
    const weatherData = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=61a80c65e68244318ae200949231005&q=new york&days=5`,
      { mode: "cors" }
    );
    const formattedData = await weatherData.json();
    dataIntoObject(formattedData);
  } catch (err) {
    throw new Error(err);
  }
}

async function searchWeather(search) {
  try {
    const weatherData = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=61a80c65e68244318ae200949231005&q=${search}&days=5`,
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
  // displayWeather(locationDataIntoObj(location), forecastDataIntoObj(forecast));
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

function displayContent(data) {
  console.log(data);
  //location
  const city = document.querySelector(".city");
  const country = document.querySelector(".country");
  const state = document.querySelector(".state");
  city.textContent = data.location.city;
  country.textContent = data.location.country;
  state.textContent = data.location.region;

  //forecast
  let weather = data.weather;
  weather.forEach((weather) => {
    const weatherHolder = document.querySelector(".weather");

    const eachWeather = document.createElement("div");
    weatherHolder.appendChild(eachWeather);

    const date = document.createElement("div");
    date.textContent = "Today: " + weather.date;

    const tempCelc = document.createElement("div");
    tempCelc.textContent = "Average Temp Celcius: " + weather.avgtemp_c;

    const maxTempCelc = document.createElement("div");
    maxTempCelc.textContent = "Max Temp Celcius: " + weather.maxtemp_c;

    const condition = document.createElement("div");
    condition.textContent = "condition: " + weather.condition;

    eachWeather.append(date, tempCelc, maxTempCelc, condition);
  });
}
