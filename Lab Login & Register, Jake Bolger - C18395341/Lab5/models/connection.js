
//Author: Jake Bolger, C18395341
//TUD

const mongoose = require("mongoose");
const nconf = require("nconf");
const chalk = require("chalk");

mongoose.connect(nconf.get("mongodbURL"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;


db.on("error", () => {
  console.log("MongoDB connection error");
  process.exit(0);
});

db.once("open", function (callback) {
  console.log(
    `${chalk.green("✓")} Connected to ${chalk.green("MongoDB")} Store`
  );
});

module.exports = {
  mongoConnection: db,
};
