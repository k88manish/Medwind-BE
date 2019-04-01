const express = require("express");
const locationApi = require("./location");
const router = new express.Router();

router.route("/location").post(locationApi.postLocation.bind(locationApi));
router.route("/location/:id").put(locationApi.putLocation.bind(locationApi));
router.route("/location").get(locationApi.getLocations.bind(locationApi));
router.route("/location/:id").delete(locationApi.deleteLocation.bind(locationApi));

module.exports = router;
