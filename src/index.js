import "./style.css";

class Weather {
  async defaultSearch() {
    try {
      const weatherData = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=61a80c65e68244318ae200949231005&q=new york`
      );
      const formattedData = await weatherData.json();
      this.dataIntoObject(formattedData);
    } catch (err) {
      throw new Error(err);
    }
  }

  async searchWeather(search) {
    try {
      const weatherData = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=61a80c65e68244318ae200949231005&q=${search}`
      );
      const formattedData = await weatherData.json();
      this.dataIntoObject(formattedData);
    } catch (err) {
      this.defaultSearch();
      throw new Error(err);
    }
  }

  dataIntoObject(data) {
    let newData = {
      cloud: data.current.cloud,
      condition: data.current.condition.text,
      feelslike_c: data.current.feelslike_c,
      feelslike_f: data.current.feelslike_f,
      temp_c: data.current.temp_c,
      temp_f: data.current.temp_f,
      uv: data.current.uv,
      wind_kph: data.current.wind_kph,
      wind_mph: data.current.wind_mph,
      location_name: data.location.name,
      country: data.location.country,
      time: data.location.localtime,
    };
    return this.changeText(newData);
  }

  changeText(data) {
    const location = document.querySelector(".location");
    console.log(data);
    location.textContent = data.location_name;

    const cloud = document.querySelector(".cloud");
    cloud.textContent = "cloud: " + data.cloud;

    const condition = document.querySelector(".condition");
    condition.textContent = "condition: " + data.condition;

    const feelsLike = document.querySelector(".feels-like");
    feelsLike.textContent = "feels like: " + data.feelslike_f;
  }
}

const searchFromForm = (() => {
  const form = document.querySelector("form");
  const input = document.querySelector("input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const weather = new Weather();
    weather.searchWeather(input.value);
    // searchWeather(input.value);
  });
})();

// async function defaultSearch() {
//   try {
//     const weatherData = await fetch(
//       `http://api.weatherapi.com/v1/current.json?key=61a80c65e68244318ae200949231005&q=new york`
//     );
//     const formattedData = await weatherData.json();
//     dataIntoObject(formattedData);
//   } catch (err) {
//     throw new Error(err);
//   }
// }

// async function searchWeather(search) {
//   try {
//     const weatherData = await fetch(
//       `http://api.weatherapi.com/v1/current.json?key=61a80c65e68244318ae200949231005&q=${search}`
//     );
//     const formattedData = await weatherData.json();
//     dataIntoObject(formattedData);
//   } catch (err) {
//     defaultSearch();
//     throw new Error(err);
//   }
// }

// function dataIntoObject(data) {
//   let newData = {
//     cloud: data.current.cloud,
//     condition: data.current.condition.text,
//     feelslike_c: data.current.feelslike_c,
//     feelslike_f: data.current.feelslike_f,
//     temp_c: data.current.temp_c,
//     temp_f: data.current.temp_f,
//     uv: data.current.uv,
//     wind_kph: data.current.wind_kph,
//     wind_mph: data.current.wind_mph,
//     location_name: data.location.name,
//     country: data.location.country,
//     time: data.location.localtime,
//   };
//   return changeText(newData);
// }

// function changeText(data) {
//   const location = document.querySelector(".location");
//   console.log(data);
//   location.textContent = data.location_name;

//   const cloud = document.querySelector(".cloud");
//   cloud.textContent = "cloud: " + data.cloud;

//   const condition = document.querySelector(".condition");
//   condition.textContent = "condition: " + data.condition;

//   const feelsLike = document.querySelector(".feels-like");
//   feelsLike.textContent = "feels like: " + data.feelslike_f;
// }
