/*Author: Jake Bolger - C18395341
--This is the Server file that uses JavaScript to create a http server. It uses fs for requests and listens on the port 3000.
The link to the html file is http://localhost:3000/index.html
*/

/*variable for requiring "fs" and "http"*/
//
var fs = require("fs"),
  http = require("http");

//Code for creatin the http server
//
http
  .createServer(function (req, res) {
    //Using fs to send the request for the data
    //
    fs.readFile(__dirname + req.url, function (error, data) {
      //if statement for error handling
      //
      if (error) {
        //if theres an error send message 404
        //
        res.writeHead(404);
        res.end(JSON.stringify(error));
        //returns
        //
        return;
      }
      
      res.writeHead(200);
      res.end(data);
    });
  })
  //listening on port 3000
  //
  .listen(3000);
console.log("View homepage at: http://localhost:3000/index.html");
