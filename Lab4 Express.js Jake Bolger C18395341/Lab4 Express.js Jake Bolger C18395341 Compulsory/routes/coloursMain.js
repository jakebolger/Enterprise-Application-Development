//
//Jake Bolger C18395341
//main route for colours object and functions from colours.norm,js
//
//
module.exports = (app) => {
  const colours = require("../controllers/colours.norm.js");
  var router = require("express").Router();

  //findall
  //
  router.get("/colours", colours.findAll);
  //findone
  //
  router.get("/colours/:id", colours.findOne);
  //create
  //
  router.post("/colours", colours.create);
  //router
  //
  app.use("/", router);
};
