//
//Author: Jake Bolger - C18395341
//index.js file for working with buttons, functions and JSON Data
//
//
// creating an array for the table, this case its 7
//
var table_master = new Array(7);
//creating arrays to hold JSON file data
//
var capital_cities;
//continents arr
//
var continents_arr;

//costlines arr
//
var costlines__arr;

//currencies arr
//
var currencies__arr;

//domains arr
//
var domains_arr;

//flags arr
//
var flags_arr;

//using values of the elements that are hidden
//
let bs,
  ls,
  ps,
  ts = true;


//changing cell colour
//
var cell_c;
//
//
var cell_p;

//css them mode
//
let d_mast = true;


//function for table, cell selection and colour change, and hide button
//
$(document).ready(function () {
  $(".data-table").hide();
  $("#p_master").hide();
  $("#collapse_b").hide();

  $("#collapse_b").click(function () {
    if (!ls) {
      //view 20 rows funcion
      //
      $("#collapse_b").html("View 20 rows");
    } else {
      //view the full table
      //
      $("#collapse_b").html("View full table");
    }
    //making sure it works
    //
    ls = !ls;
  });

  $("#dark_mode_b").click(function () {
    toggleTheme();
  });

  //for cell colour change and selection
  //
  $("#hide_paragraph_b").click(function () {
    if (!ps) {
      $("#I_box").hide();
      $("#hide_paragraph_b").html("Show Paragraph");
    } else {
      //for paragraph box
      //
      $("#I_box").show();
      $("#hide_paragraph_b").html("Hide Paragraph");
    }
    ps = !ps;
  });

  //hiding the table function
  //
  $("#hide_table_b").click(function () {
    if (!ts) {
      $("#table").hide();
      $("#hide_table_b").html("Show Table");
    } else {
      $("#table").show();
      $("#hide_table_b").html("Hide Table");
    }
    ts = !ts;
  });

  //fading button function
  //
  $("#fade_nav_b").click(function () {
    $("#header_nav").fadeToggle();
    $("#hide_table_b").html("Hide Table");
  });

  //fade table function
  //
  $("#fade_table_b").click(function () {
    $("#table").fadeToggle();
  });


  //load button function
  //
  $("#load_table_button").click(function () {
    $("#load_table_button").hide();
    $("#p_master").show();
    $("#p_master").append("THE FOLDER 'country-objects' HAS BEEN READ");
    getData();
    setTimeout(function () {
      createArray();
      populateTable();
      $(".data-table").show();
      $("#p_master").html("");
      $("#p_master").append("THE TABLE HAS BEEN CREATED");
      $("#collapse_b").show();
    }, 5000);
  });

  //for body and table function with cell change colour 
  //
  $("body").on("click", "#country_table tr td", function () {
    cell_c = $(this);

    if (cell_p) {
      cell_p.css("background-color", "#d09eda");
      cell_c.css("background-color", "yellow");
    } else {
      cell_c.css("background-color", "yellow");
    }
    cell_p = cell_c;
    console.log(cell_c);
  });
});

//used to toggle the theme from dark to light mode
//
let toggleTheme = () => {
  console.log("test");
  $("#body").toggleClass("dark-mode");
  d_mast = !d_mast;
  if (d_mast) {
    $("#dark_mode_b").html("Light Mode");
  } else {
    $("#dark_mode_b").html("Dark Mode");
  }
};

//populating the table
//
let populateTable = () => {
  var tableBody = document.getElementById("table_body");
  for (let i = 0; i < table_master.length; i++) {
    var tableRow = document.createElement("tr");
    if (i >= 19) {
      tableRow.classList.add("collapse", "row-collapse");
    }
    tableRow.setAttribute("row", i + 1);
    for (let j = 0; j < table_master[i].length; j++) {
      var td = document.createElement("td");

      //if statement for the images
      //
      if (j == 6) {
        td.innerHTML = "<img src='" + table_master[i][j] + "'>";
      } else {
        td.appendChild(document.createTextNode(table_master[i][j]));
      }
      tableRow.appendChild(td);
      td.setAttribute("cell", j + 1);
    }
    //appending
    //
    tableBody.appendChild(tableRow);
  }
};

//populating key row
//
let populateKey = (row) => {
  return capital_cities[row].country;
};

//array population
//
let populateArray = (country, column) => {
  //obj var
  //
  var object;
  //dataset var
  //
  var data_master;
  //element var
  //
  var my_element;

  //switch statements for columns
  //
  switch (column) {
    case 1:
      data_master = capital_cities;
      //
      my_element = "city";
      break;

    case 2:
      data_master = continents_arr;
      //case 2
      //
      my_element = "continent";
      break;

    case 3:
      data_master = costlines__arr;
      //case 3
      //
      my_element = "costline";
      break;

    case 4:
      data_master = currencies__arr;
      //case 4
      //
      my_element = "currency_name";
      break;

    case 5:
      data_master = domains_arr;
      //case 5
      //
      my_element = "tld";
      break;

    case 6:
      data_master = flags_arr;
      my_element = "flag_base64";
      break;
  }

  //try for null values
  //
  try {
    // 
    object = data_master.find((obj) => obj.country == country);
    return object[my_element];
  } catch {
    //
    console.log("error " + my_element + " no data for: " + country);
    return "";
  }
};

let createArray = () => {
  // creating 2d array
  //
  for (let i = 0; i < capital_cities.length; i++) {
    table_master[i] = new Array(7);
  }

  //loop for countries
  //
  for (let i = 0; i < capital_cities.length; i++) {
    table_master[i][0] = populateKey(i);
  }

  // Loop for elements
  //
  for (let i = 0; i < capital_cities.length; i++) {
    for (let j = 1; j < 7; j++) {
      table_master[i][j] = populateArray(table_master[i][0], j);
    }
  }
};

let getData = () => {
  //getting data capital
  //
  $.get(
    "country-objects/country-by-capital-city.json",
    function (data, status) {
      capital_cities = $.parseJSON(data);
    }
  );

  
  //getting all the JSON Files
  //
  //getting data constline
  //
  $.get("country-objects/country-by-costline.json", function (data, status) {
    costlines__arr = $.parseJSON(data);
  });

  //getting data continent
  //
  $.get("country-objects/country-by-continent.json", function (data, status) {
    continents_arr = $.parseJSON(data);
  });

  //getting data currency
  //
  $.get(
    "country-objects/country-by-currency-name.json",
    function (data, status) {
      currencies__arr = $.parseJSON(data);
    }
  );

  //getting data domain
  //
  $.get("country-objects/country-by-domain-tld.json", function (data, status) {
    domains_arr = $.parseJSON(data);
  });

  //getting data flag
  //
  $.get("country-objects/country-by-flag.json", function (data, status) {
    flags_arr = $.parseJSON(data);
  });
};
