const suggestionsBox = document.querySelector(".suggestions");
const inputBox = document.querySelector("#input-box");

inputBox.onkeyup = async function () {
  try {
    const response = await axios.get(`/search-suggestions?q=${inputBox.value}`);
    const result = response.data;
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
    console.log(content);
  });

  suggestionsBox.innerHTML = "<ul>" + content.join("") + "</ul>";
  console.log(content);
}

function selectInput(list) {
  inputBox.value = list.innerHTML;
}
