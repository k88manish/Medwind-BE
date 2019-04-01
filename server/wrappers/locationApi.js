const config = require("../config");
const googleMapsClient = require("@google/maps").createClient({
  key: config.googleApiKey,
  Promise: Promise
});

module.exports = {
  getGeoLocation: async place => {
    let response;
    let toReturn = {};
    try {
      response = await googleMapsClient.geocode({ address: place }).asPromise();
    } catch (err) {
      throw Error(err);
    }

    const { results, status } = response.json;
    const foundLoc = results[0];

    // Prepare Locations document
    if (status === "OK" && results.length > 0) {
      Object.assign(toReturn, {
        lat: foundLoc.geometry.location.lat,
        lng: foundLoc.geometry.location.lng,
        address: foundLoc.formatted_address
      });
    }

    return toReturn;
  }
};
