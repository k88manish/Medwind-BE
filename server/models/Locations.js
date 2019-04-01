const mongoose = require("mongoose");

module.exports = mongoose.model("Locations", {
  Lat: String,
  Lng: String,
  Name: String,
  Address: String
});
