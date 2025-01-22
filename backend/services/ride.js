const { getDistanceTime } = require("./map");
const { fare } = require("../utilities/fare");

const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  if (pickup === destination) {
    throw new Error("Pickup and destination cannot be same");
  }
  const { distance } = await getDistanceTime(pickup, destination);

  const fareOfRide = (distance.value - 2000) * fare.perMetre + fare.baseFare;

  return {fare : Math.ceil(fareOfRide), distance};
};

const getOtp = () => {
  return Math.floor(1000000 + Math.random() * 9000000);
};

module.exports = { getFare, getOtp };
