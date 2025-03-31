const suggestionsBox = document.querySelector(".suggestions");
const inputBox = document.querySelector("#input-box");
const button = document.querySelector(".search-button");
const searchBox = document.querySelector(".search-input");

inputBox.onkeyup = async function () {
  try {
    const response = await axios.get(`/search-suggestions?q=${inputBox.value}`);
    const result = response.data;
    if (inputBox.value.length > 1) {
      searchBox.style.borderBottomLeftRadius = "0px";
    } else {
      searchBox.style.borderBottomLeftRadius = "7px";
    }
    display(result);
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
  });

  if (content.length == 0) {
    searchBox.style.borderBottomLeftRadius = "7px";
  } else {
    suggestionsBox.style.display = "block";
  }
  suggestionsBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

function selectInput(list) {
  inputBox.value = list.innerHTML;
  suggestionsBox.style.display = "none";
  searchBox.style.borderBottomLeftRadius = "7px";
}
