const axios = require("axios");

const getCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;

  // Construct the URL to make the API request
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("No results found for the given address");
    }
  } catch (err) {
    throw err;
  }
};

const getDistanceTime = async (pickupLat, pickupLng, dropLat, dropLng) => {
  if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
    throw new Error("Pickup and drop coordinates are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  // Construct the URL using latitude and longitude values
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupLat},${pickupLng}&destinations=${dropLat},${dropLng}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];

      if (element.status === "ZERO_RESULTS") {
        throw new Error("No routes found between the given coordinates");
      }

      return {
        distance: element.distance.value,
        duration: element.duration.value,
      };
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (err) {
    throw err;
  }
};

const getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(autocompleteUrl);
    const predictions = response.data.predictions;

    if (predictions.length === 0) {
      throw new Error("No suggestions found");
    }

    // Fetch lat/lng for each prediction using Place Details API
    const detailsPromises = predictions.map(async (place) => {
      const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${apiKey}`;
      const detailsResponse = await axios.get(placeDetailsUrl);
      const location = detailsResponse.data.result.geometry.location;

      return {
        description: place.description,
        place_id: place.place_id,
        lat: location.lat,
        lng: location.lng,
      };
    });

    const results = await Promise.all(detailsPromises);
    return results;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
};
