const suggestionsBox = document.querySelector(".suggestions");
const inputBox = document.querySelector("#input-box");

inputBox.onkeyup = async function () {
  try {
    if (inputBox.value.length > 1) {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${inputBox.value}&limit=5&appid=${APIid}`
      );

      result = response.data.map((city) => {
        return {
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon,
        };
      });

      display(result);
    } else {
      suggestionsBox.innerHTML = "";
    }
  } catch (err) {
    console.log(err);
  }
};

function display(result) {
  const content = result.map((suggestion) => {
    return (
      "<li onclick=selectInput(this)>" +
      suggestion.name +
      ", " +
      suggestion.country +
      "</li>"
    );
    console.log(content);
  });

  suggestionsBox.innerHTML = "<ul>" + content.join("") + "</ul>";
  console.log(content);
}

function selectInput(list) {
  inputBox.value = list.innerHTML;
}
