const axios = require("axios");

const getCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;

  // Construct the URL to make the API request
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
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
  if (
    pickupLat == null ||
    pickupLng == null ||
    dropLat == null ||
    dropLng == null
  ) {
    throw new Error("Pickup and drop coordinates are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  try {
    const response = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: {
          location: {
            latLng: {
              latitude: pickupLat,
              longitude: pickupLng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: dropLat,
              longitude: dropLng,
            },
          },
        },
        travelMode: "DRIVE",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          // IMP :
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
        },
      },
    );

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = response.data.routes[0];
    console.log(route);

    return {
      distance: route.distanceMeters,
      duration: parseInt(route.duration), // "1023s" -> 1023
      polyline: route.polyline.encodedPolyline,
    };
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};

const getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input,
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(autocompleteUrl);
    const predictions = response.data.predictions;

    // console.log(response);

    if (predictions.length === 0) {
      console.error("Google API Response when 0 predictions:", response.data);
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
    console.error("Error fetching suggestions:", e);
    throw e;
  }
};

module.exports = {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
};
