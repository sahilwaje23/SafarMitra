const { validationResult } = require("express-validator");
const { getFare, getOtp, confirmRide } = require("../services/ride");
const Ride = require("../models/ride");
const User = require("../models/user");
const { getCaptainsInTheRadius } = require("../services/ride");
const { sendMessageToSocketId } = require("../socket");

const handleCreateRoom = async (req, res) => {
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
      pickup: {
        lat: pickupLat,
        lng: pickupLng,
        text: pickupText,
      },
      destination: {
        lat: dropLat,
        lng: dropLng,
        text: dropText,
      },
      fare,
      distance: Math.ceil(distance / 1000),
      otp: getOtp(),
      duration: Math.ceil(duration / 60),
      status: "open",
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
      $push: { ridesBooked: newRoom._id },
    }).select("-password -salt -ridesBooked");

    res.status(200).json({ newRoom });
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

const handleCloseRoom = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { roomId } = req.body;
    const roomData = await Ride.findById(roomId).populate("creatorId");
    if (!roomData) {
      throw new Error("Room not found");
    }

    try {
      const captians = await getCaptainsInTheRadius(
        roomData.pickup.lat,
        roomData.pickup.lng,
        300
      );
      // console.log(captians);

      roomData.status = "closed";
      await roomData.save();

      // remove otp
      roomData.otp = null;

      captians.forEach((captain) => {
        sendMessageToSocketId("new-ride", captain.socket_id, {
          roomData,
          user: req.user,
        });
      });

      res.status(200).json({ roomData });
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

    // Ensure both pickup & destination are not empty before querying
    if (!pickup && !destination) {
      return res.status(400).json({ message: "Pickup or destination is required" });
    }

    // Construct dynamic query
    let query = {};
    if (pickup) {
      query["pickup.text"] = { $regex: pickup, $options: "i" };
    }
    if (destination) {
      query["destination.text"] = { $regex: destination, $options: "i" };
    }

    const rooms = await Ride.find({ $or: [query] });

    return res.status(200).json(rooms);
  } catch (e) {
    res.status(400).json({ rideError: e.message });
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

    if (!ride) {
      throw new Error("Ride not found");
    }

    ride.status = "ongoing";
    await ride.save();

    sendMessageToSocketId("confirm-ride", ride.creatorId.socket_id, {
      ride,
      user: req.driver,
    });

    room.mitra.forEach((m) => {
      if (m.userId.socket_id) {
        sendMessageToSocketId("confirm-ride", m.userId.socket_id, {
          room,
          user: req.user,
        });
      }
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

const getAllOpenRooms = async (req, res) => {
  try {
    const rooms = await Ride.find({ status: "open" });
    return res.status(200).json(rooms);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

const getAllWaitingClosedRooms = async (req, res) => {
  try {
    const rooms = await Ride.find({ status: "closed" });
    return res.status(200).json(rooms);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

module.exports = {
  handleCreateRoom,
  handleGetFare,
  handleConfirmRide,
  searchRoom,
  handleJoinRoom,
  handleCloseRoom,
  getAllOpenRooms,
  getAllWaitingClosedRooms,
};