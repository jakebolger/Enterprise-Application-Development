//
//Author: Jake Bolger - C18395341
//finding all data from json file
//controllers
//
//
exports.findAll = (req, res) => {
  const data = require("../data/data.json");
  res.send(data);
};

//find one from data.json
//
exports.findOne = (req, res) => {
  const data = require("../data/data.json");
  let id = req.params.id;
  //
  res.send(data[id]);
};

//create from data.json
//
exports.create = (req, res) => {
  const data = require("../data/data.json");
  console.log(req.body);
  //
  res.send(data);
};
