require('dotenv').config();

const express = require("express");
const app = express();
const router = require("./controller/router");
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// app.use(express.static("public"));
app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
