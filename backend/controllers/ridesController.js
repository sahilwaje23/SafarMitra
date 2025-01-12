const { validationResult } = require("express-validator");
const { getFare, getOtp } = require("../services/ride");
const Ride = require("../models/ride");

const handleCreateRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  const { pickup, destination } = req.body;
  const fare = await getFare(pickup, destination);

  try {
    const newRide = await Ride.create({
      users: [
        { userId: req.user._id }, // Jugad : Add the first user directly
      ],
      pickup,
      destination,
      fare,
      otp: getOtp(),
    });

    return res.status(200).json(newRide);
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

module.exports = { handleCreateRide };
