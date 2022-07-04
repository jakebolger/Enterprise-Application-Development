/*Author: Jake Bolger - C18395341
--This is the Server file that uses express to create a http server.  listens on the port 8080.
*/

/*variable for requiring "express" and "path"*/
//
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

//getting public folder path
//
const publicDirPath = path.join(__dirname, "/public");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//using index.html
//
app.get("/", function (req, res) {
  res.sendFile(path.join(publicDirPath, "/index.html"));
});
require("./routes/coloursMain")(app);

//using errorPage.html
//
app.use("*", function (req, res) {
  res.status(404).sendFile(publicDirPath + "/errorPage.html");
});

//listening on port 8080
  //
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
