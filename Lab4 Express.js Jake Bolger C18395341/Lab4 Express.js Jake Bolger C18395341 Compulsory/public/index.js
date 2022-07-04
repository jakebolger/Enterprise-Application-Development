
//
//Author: Jake Bolger - C18395341
//index.js file for working with buttons, functions and JSON Data
//
document.getElementById("retrieveAll").onclick = function () {
  retrieveAll();
};
//
//get single colour function
//
document.getElementById("getSingle").onclick = function () {
  getSingle();
};

//inset colour function
//
//
document.getElementById("insertSingle").onclick = function () {
  insertSingle();
};

//
//let
//
let retrieveAllTable = document.getElementById("retrieveAllTable");
let boxM = document.getElementById("boxM");
let insertM = document.getElementById("insertM");

//boxM
//
boxM.style.display = "none";
insertM.style.display = "none";


//fuinction insert singles
//
function insertSingle() {
  boxM.style.display = "none";
  retrieveAllTable.style.display = "none";
  insertM.style.display = "";

  let hexV = document.getElementById("insert-colour-hex").innerHTML;
  let rgbV = document.getElementById("insert-colour-rgb").innerHTML;
  let hslV = document.getElementById("insert-colour-hsl").innerHTML;
  let nameV = document.getElementById("name-input").value;

  let json = {
    hex: hexV,
    rgb: rgbV,
    hsl: hslV,
    name: nameV,
  };

  let response = postData(json);
  console.log(response);
}

//postdata function
//
async function postData(data) {
  const response = await fetch("/colours", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

//getsingle
//
function getSingle() {
  retrieveAllTable.style.display = "none";
  boxM.style.display = "";
  insertM.style.display = "none";
  var cColour;
  let inputV = document.getElementById("colourid").value;

  if (inputV) {
    cColour = inputV;
  } else {
    cColour = 0;
  }

  let request = new XMLHttpRequest();
  request.open("GET", `/colours/${cColour}`);
  request.send();
  request.onload = () => {
    if (request.status === 200) {
      let data = JSON.parse(request.response);
      populateOne(data);
    } else {
      console.log("Error fetching all colours");
    }
  };
}

//functions populate data
//
function populateOne(data) {
  let id = document.getElementById("colour-id");
  let hex = document.getElementById("colour-hex");
  let rgb = document.getElementById("colour-rgb");
  let hsl = document.getElementById("colour-hsl");
  let name = document.getElementById("colour-name");
  let box = document.getElementById("colour-display");

  box.style.backgroundColor = data.hexString;
  id.innerHTML = data.colorId;
  hex.innerHTML = data.hexString;
  rgb.innerHTML =
    "rgb(" + data.rgb.r + ", " + data.rgb.g + ", " + data.rgb.b + ")";
  hsl.innerHTML =
    "hsl(" +
    data.hsl.h.toFixed() +
    ", " +
    data.hsl.s +
    "%, " +
    data.hsl.l +
    "%)";
  name.innerHTML = data.name;
}


//retriveing function
//
function retrieveAll() {
  retrieveAllTable.style.display = "";
  insertM.style.display = "none";
  boxM.style.display = "none";
  let request = new XMLHttpRequest();
  request.open("GET", "/colours");
  request.send();
  request.onload = () => {
    if (request.status === 200) {
      let data = JSON.parse(request.response);
      console.log(data);
      retrieveAllTable.innerHTML = generateTable(data);
      setColours(data);
    } else {
      console.log("Error fetching all colours");
    }
  };
}

//function for getting values
//
function getinputVs() {
  let cColour = document.getElementById("colorInput").value;
  cColour = cColour.slice(1);
  let input = document.getElementById("name-input");
  input.value = "";
  let hexV = document.getElementById("insert-colour-hex");
  let rgbV = document.getElementById("insert-colour-rgb");
  let hslV = document.getElementById("insert-colour-hsl");
  rgbArray = convertHexToRgb(cColour);
  hslString = rgbToHSL(rgbArray[0], rgbArray[1], rgbArray[2]);
  rgbV.innerHTML =
    "rgb(" + rgbArray[0] + ", " + rgbArray[1] + ", " + rgbArray[2] + ")";
  hexV.innerHTML = "#" + cColour;
  hslV.innerHTML = hslString;
}

//function for converting to string
//
function convertHexToRgb(hexString) {
  var aRgbHex = hexString.match(/.{1,2}/g);
  return [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
  ];
}

//rgb function
//
function rgbToHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;

  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return "hsl(" + h + "," + s + "%," + l + "%)";
}

//function for generate table
//
function generateTable(data) {
  let cols = Object.keys(data[0]);

  let headerRow = cols.map((col) => `<th>${col}</th>`).join("");
  headerRow += "<th>colour</th>";

  
  data.forEach((element, index) => {
    data[index].rgb =
      "rgb(" +
      element.rgb.r +
      ", " +
      element.rgb.g +
      ", " +
      element.rgb.b +
      ")";

    data[index].hsl =
      "hsl(" +
      element.hsl.h.toFixed() +
      ", " +
      element.hsl.s +
      "%, " +
      element.hsl.l +
      "%)";
  });

  let rows = data
    .map((row) => {
      let tds = cols.map((col) => `<td>${row[col]}</td>`).join("");
      return `<tr>${tds}<td id="colour${row.colorId}"></td></tr>`;
    })
    .join("");

  return `
	<table id="tableMaster" class="table table-light ">
		<thead>
			<tr>${headerRow}</tr>
		<thead>
		<tbody>
			${rows}
		<tbody>
	<table>`;
}

//for setting colours
//
function setColours(data) {
  data.forEach((object) => {
    let current = document.getElementById("colour" + object.colorId);
    current.style.backgroundColor = object.hexString;
  });
}
