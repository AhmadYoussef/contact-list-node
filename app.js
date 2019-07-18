const express = require("express");
const app = express();
const port = 5000;
// const passport = require('passport');
const router = require("./controller/router");
// Passport Config
// require('./config/passport')(passport);

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// app.use(express.static("public"));
app.use("/", router);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
