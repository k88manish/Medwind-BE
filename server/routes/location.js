const constants = require("../constants");
const Utility = require("../Utility");
const locationApiWrapper = require("../wrappers/locationApi");
const Locations = require("../models/Locations");

const locationApi = {
  // Private Make it private variables
  _locationsModel: Locations,
  constants: constants,

  postLocation: async function(req, res) {
    const { place } = req.body;
    // If the input is not provided then send error
    if (!place) {
      return res.status(400).send({ error: constants.MESSAGE.MISSING_PARAMS });
    }

    let response;
    // Get distance from google API
    try {
      response = await locationApiWrapper.getGeoLocation(place);
    } catch (err) {
      return Utility.handleError(res, err);
    }

    if (Object.keys(response).length === 0) {
      return Utility.handleError(res, { message: "Not able to find the Locations" });
    }
    // Prepare Locations document
    const Locations = new this._locationsModel({
      Lat: response.lat,
      Lng: response.lng,
      Address: response.address,
      Name: place
    });
    //Save Locations in database
    try {
      const data = await Locations.save();
      res.json(data);
    } catch (err) {
      return Utility.handleError(res, { message: "Could not able to save Locations." });
    }
  },

  putLocation: async function(req, res) {
    const { id } = req.params;
    const { place } = req.body;
    let data;

    if (!id) {
      return res.status(400).send({ error: "Missing required parameters" });
    }
    try {
      data = await this._locationsModel.findById(id);
    } catch (err) {
      return Utility.handleError(res, err);
    }

    if (!data) {
      res.status(400);
      return res.send({ error: "No Locations found for id: " + id });
    }
    let response;
    try {
      response = await await locationApiWrapper.getGeoLocation(place);
    } catch (err) {
      return Utility.handleError(res, err);
    }

    if (Object.keys(response).length === 0) {
      return Utility.handleError(res, { message: "Not able to find the Locations" });
    }

    // Update Locations document
    Object.assign(data, {
      Lat: response.lat,
      Lng: response.lng,
      Address: response.address,
      Name: place
    });

    try {
      const saveData = await data.save();
      return res.json(saveData);
    } catch (err) {
      return Utility.handleError(res, err);
    }
  },

  getLocations: function(req, res) {
    this._locationsModel
      .find({})
      .then(locations => {
        res.json(locations);
      })
      .catch(err => {
        return Utility.handleError(res, err);
      });
  },

  deleteLocation: async function(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ error: "Missing required parameters: id" });
    }

    try {
      await this._locationsModel.findByIdAndDelete(id);
      return res.json({ status: "SUCCESS" });
    } catch (err) {
      return Utility.handleError(res, err);
    }
  }
};

module.exports = locationApi;
