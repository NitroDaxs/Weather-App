import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const APIid = "154ef6b2bbe1b6115aea8e0f50c32f4f";

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    res.render("index.ejs");
  } catch (err) {
    console.log(err);
  }
});

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIid}`
    );
    const data = response.data;
    res.render("index.ejs", { data });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
