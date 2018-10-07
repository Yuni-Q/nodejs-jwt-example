/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

/* =======================
    LOAD THE CONFIG
==========================*/
const config = require("./config");
const port = process.env.PORT || 3000;

/* =======================
    EXPRESS CONFIGURATION
==========================*/
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan("dev"));

// set the secret key variable for jwt
app.set("jwt-secret", config.secret);

// index page, just for testing
app.get("/", (req, res) => {
  res.send("Hello JWT");
});

// configure api router
app.use("/api", require("./routes/api"));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// open the server
app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});

function wrapAsync(fn) {
  return function(req, res, next) {
    // 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달하세요
    // (이 경우에는 오류 처리기)
    fn(req, res, next).catch(next);
  };
}

/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.mongodbUri);
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("connected to mongodb server");
});
