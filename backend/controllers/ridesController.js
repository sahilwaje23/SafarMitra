const { validationResult } = require("express-validator");
const { getFare, getOtp, confirmRide } = require("../services/ride");
const Ride = require("../models/ride");
const User = require("../models/user");
const { getCaptainsInTheRadius } = require("../services/ride");
const { sendMessageToSocketId } = require("../socket");

const handleCreateRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  const { pickupText, pickupLat, pickupLng, dropText, dropLat, dropLng } =
    req.body;

  const { fare, distance, duration } = await getFare(
    pickupLat,
    pickupLng,
    dropLat,
    dropLng
  );

  try {
    const newRoom = await Ride.create({
      creatorId: req.user._id,
      pickup: pickupText,
      destination: dropText,
      fare,
      distance: Math.ceil(distance / 1000),
      otp: getOtp(),
      duration: Math.ceil(duration / 60),
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
      $push: { ridesBooked: newRoom._id },
    }).select("-password -salt -ridesBooked");

    res.status(200).json({ newRoom });

    try {
      const captians = await getCaptainsInTheRadius(pickupLat, pickupLng, 300);
      // console.log(captians);

      // remove otp
      newRoom.otp = null;

      captians.forEach((captain) => {
        sendMessageToSocketId("new-ride", captain.socket_id, { newRoom, user });
      });
    } catch (e) {
      return res.status(400).send({ rideError: e.message });
    }
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

const searchRoom = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { pickup, destination } = req.body;

    const rooms = await Ride.find({
      $or: [
        { pickup: { $regex: pickup, $options: "i" } },
        { destination: { $regex: destination, $options: "i" } },
      ],
    });

    return res.status(200).json(rooms);
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

const handleGetFare = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  const { pickup, destination } = req.query;
  const { fare } = await getFare(pickup, destination);

  return res.status(200).json(fare);
};

const handleConfirmRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { rideId } = req.body;
    const ride = await confirmRide(rideId, req.driver);

    sendMessageToSocketId("confirm-ride", ride.creatorId.socket_id, {
      ride,
      user: req.driver,
    });

    return res.status(200).json(ride);
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

const handleJoinRoom = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { roomId } = req.query;

    const room = await Ride.findById(roomId).populate(
      "mitra.userId",
      "socket_id"
    );
    if (!room) {
      return res.status(404).json({ rideError: "Room not found" });
    }

    if (
      room.mitra.some((m) => m.userId.toString() === req.user._id.toString())
    ) {
      return res
        .status(400)
        .json({ rideError: "User already joined the room" });
    }

    room.mitra.push({ userId: req.user._id });
    await room.save();

    sendMessageToSocketId(
      "new-userJoin",
      (await room.populate("creatorId", "-password -salt -ridesBooked"))
        .creatorId.socket_id,
      { room, user: req.user }
    );

    // Notify all mitra members
    room.mitra.forEach((m) => {
      if (m.userId.socket_id) {
        sendMessageToSocketId("new-userJoin", m.userId.socket_id, {
          room,
          user: req.user,
        });
      }
    });

    return res.status(200).json(room);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

module.exports = {
  handleCreateRide,
  handleGetFare,
  handleConfirmRide,
  searchRoom,
  handleJoinRoom,
};
