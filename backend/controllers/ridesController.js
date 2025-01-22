const { validationResult } = require("express-validator");
const { getFare, getOtp } = require("../services/ride");
const Ride = require("../models/ride");
const User = require("../models/user");

const handleCreateRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  const { pickup, destination } = req.body;
  const { fare, distance } = await getFare(pickup, destination);
  try {
    const newRoom = await Ride.create({
      creatorId: req.user._id,
      pickup,
      destination,
      fare,
      distance: distance.text,
      otp: getOtp(),
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
      $push: { ridesBooked: newRoom._id },
    });

    return res.status(200).json(newRoom);
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

module.exports = { handleCreateRide };
