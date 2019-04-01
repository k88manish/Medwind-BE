var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
const apiRoutes = require("./server/routes");

// Configuration
mongoose.connect("mongodb://manishkumar:mydb123@ds113606.mlab.com:13606/demo");

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(cors());
//app.use(express.static("./server/static/"));

app.use(apiRoutes);

// listen
app.listen(8080, () => {
  console.log("App listening on port 8080");
});

module.exports = app;
