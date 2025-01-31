const { getDistanceTime } = require("./map");
const { fare } = require("../utilities/fare");
const Drivers = require("../models/driver");
const Ride = require("../models/ride");

const getFare = async (pickupLat, pickupLng, dropLat, dropLng) => {
  if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
    throw new Error("Pickup and destination coordinates are required");
  }

  if (pickupLat === dropLat && pickupLng === dropLng) {
    throw new Error("Pickup and destination cannot be the same");
  }

  const { distance, duration } = await getDistanceTime(
    pickupLat,
    pickupLng,
    dropLat,
    dropLng
  );

  // console.log({distance,duration})
  const distanceCharge = Math.max(distance - 2000, 0) * fare.perMetre;
  const fareOfRide = fare.baseFare + distanceCharge;

  return {
    fare: Math.ceil(fareOfRide),
    distance,
    duration,
  };
};

const getOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

const getCaptainsInTheRadius = async (lat, lng, radius) => {
  try {
    const captains = await Drivers.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lat, lng], radius / 6371],
        },
      },
    });

    return captains;
  } catch (error) {
    throw new Error(`Error fetching captains: ${error.message}`);
  }
};

const confirmRide = async (rideId, driver) => {
  const ride = await Ride.findOneAndUpdate(
    { _id: rideId },
    { driver: driver._id, status: "ongoing" }
  )
    .populate("creatorId", "-password -salt -ridesBooked")
    .populate("driver", "-password -salt -ridesAcceptedUrl");

  await Drivers.findByIdAndUpdate(driver._id, {
    $push: { ridesAcceptedUrl: ride._id },
  });

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports = { getFare, getOtp, getCaptainsInTheRadius, confirmRide };
