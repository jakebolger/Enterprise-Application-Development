//Author: Jake Bolger, C18395341
//TUD

const express = require("express");
const session = require("express-session");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const nconf = require("nconf");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const path = require("path");
const app = express();
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/vendor'));

nconf
  .argv()
  .env()
  .file({
    file: __dirname + "/config.json",
  });


const redisSessionStore = redis.createClient(
  nconf.get("redisPort"),
  nconf.get("redisHost"),
  {
    db: 0,
  }
);

redisSessionStore.on("connect", () => {
  console.log(
    `${chalk.green("✓")} Connected to ${chalk.green("Redis")} Session Store`
  );
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(
  session({
    secret: nconf.get("sessionSecret"),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    },
    store: new redisStore({ client: redisSessionStore }),
    resave: false,
    saveUninitialized: false,
  })
);


app.set("views", path.join(__dirname, "/views"));
app.engine("html", require("ejs").renderFile);


app.use("/", require("./routes/static"));
app.use("/users", require("./routes/users"));


app.listen(nconf.get("port") || 8080);
console.log("App Started...");
