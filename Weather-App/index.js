import express from "express";
import axios from "axios";
import "dotenv/config";

const APIid = process.env.API_KEY;
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const city = "Sredets";
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIid}`
    );
    const hourlyForecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIid}`
    );
    const data = await manipulateData(response.data);
    const hourlyData = await manipulateHourlyData(hourlyForecast.data);
    const featuredCities = await getFeaturedCities();
    const backGroundImage = await getImage(data);
    const weeklyForecast = await manipulateWeeklyData(hourlyForecast.data);
    res.render("index.ejs", {
      content: data,
      hourly: hourlyData,
      cities: featuredCities,
      image: backGroundImage,
      weekly: weeklyForecast,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/weather", async (req, res) => {
  try {
    if (!req.query.city) {
      res.redirect("/");
      return;
    }
    const query = req.query.city.split(",")[0];

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${APIid}`
    );
    const hourlyForecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${APIid}`
    );
    const data = await manipulateData(response.data);
    const hourlyData = await manipulateHourlyData(hourlyForecast.data);
    const featuredCities = await getFeaturedCities();
    const backGroundImage = await getImage(data);
    const weeklyForecast = await manipulateWeeklyData(hourlyForecast.data);
    console.log(weeklyForecast);
    res.render("index.ejs", {
      content: data,
      hourly: hourlyData,
      cities: featuredCities,
      image: backGroundImage,
      weekly: weeklyForecast,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/search-suggestions", async (req, res) => {
  try {
    const inputBox = req.query.q;
    if (inputBox.length > 1) {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${inputBox}&limit=5&appid=${APIid}`
      );

      const suggestions = response.data.map((city) => {
        return {
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon,
        };
      });

      res.json(suggestions);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.log(err);
  }
});

async function manipulateData(data) {
  data.main.temp = Math.round(data.main.temp - 273.15);
  data.main.feels_like = Math.round(data.main.feels_like - 273.15);
  let date = new Date(data.dt * 1000 + data.timezone * 1000).toDateString();
  data.dt = date;
  return data;
}

async function manipulateHourlyData(data) {
  return data.list.slice(0, 5).map((hour) => {
    return {
      hours: new Date(hour.dt * 1000).getHours(),
      temp: Math.round(hour.main.temp - 273.15),
      icon: hour.weather[0].icon,
    };
  });
}

async function getFeaturedCities() {
  try {
    const cities = [
      "Sofia",
      "Dubai",
      "London",
      "New York",
      "Sidney",
      "Tokyo",
      "Paris",
      "Berlin",
    ];

    let result = [];

    for (let i = 0; i < cities.length; i++) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=${APIid}`
      );
      result[i] = await manipulateData(response.data);
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function manipulateWeeklyData(data) {
  let list = data.list;
  let dailyTemps = {};

  for (let i = 0; i < list.length; i++) {
    let date = list[i].dt_txt.split(" ")[0];
    let temp = Math.round(list[i].main.temp - 273.15);
    if (!dailyTemps[date]) {
      dailyTemps[date] = {
        low: Number.MAX_SAFE_INTEGER,
        high: -Number.MAX_SAFE_INTEGER,
      };
    }

    dailyTemps[date].low = Math.min(dailyTemps[date].low, temp);
    dailyTemps[date].high = Math.max(dailyTemps[date].high, temp);
  }
  let result = Object.keys(dailyTemps).map((date) => ({
    date:
      new Date(date).getDate() +
      "." +
      (new Date(date).getMonth() + 1) +
      "." +
      new Date(date).getFullYear(),
    highTemp: dailyTemps[date].high,
    lowTemp: dailyTemps[date].low,
  }));

  return result;
}
async function getImage(data) {
  try {
    let temp = data.main.temp;
    let weather = data.weather[0].description;
    if (temp <= 0) {
      return "images/snowy.png";
    } else if (weather.includes("rain")) {
      return "images/rain.jpg";
    } else if (weather.includes("cloud")) {
      return "images/clouds.jpg";
    } else if (temp > 0 && temp < 25) {
      return "images/mild.jpg";
    } else if (temp >= 25 && temp < 45) {
      return "images/sunny.jpg";
    }
  } catch (err) {
    console.log(err);
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
