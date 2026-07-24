const { validationResult } = require("express-validator");
const { getFare, getOtp, confirmRide } = require("../services/ride");
const Ride = require("../models/ride");
const User = require("../models/user");
const { getCaptainsInTheRadius } = require("../services/ride");
const { sendMessageToSocketId } = require("../socket");
const { getIO } = require("../socket");
const DispatchService = require("../services/dispatchService");

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
    dropLng,
  );

  try {
    const newRoom = await Ride.create({
      creatorId: req.user._id,
      pickup: {
        lat: pickupLat,
        lng: pickupLng,
        text: pickupText,
      },
      pickupLocation: {
        type: "Point",
        coordinates: [pickupLng, pickupLat], // [longitude, latitude]
      },
      destination: {
        lat: dropLat,
        lng: dropLng,
        text: dropText,
      },
      dropLocation: {
        type: "Point",
        coordinates: [dropLng, dropLat],
      },
      fare,
      distance: Math.ceil(distance / 1000),
      otp: getOtp(),
      duration: Math.ceil(duration / 60),
      status: "open",
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
      $push: { ridesBooked: newRoom._id },
      currActiveRide: newRoom._id,
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
      getIO().to(`ride:${roomId}`).emit("room-closed", roomData);

      roomData.status = "closed";
      await roomData.save();

      // remove otp
      roomData.otp = null;

      // Start asynchronous dispatch flow
      DispatchService.dispatchRide(roomData._id);

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
      return res
        .status(400)
        .json({ message: "Pickup or destination is required" });
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

  try {
    const { pickupLat, pickupLng, dropLat, dropLng } = req.query;
    const fareData = await getFare(pickupLat, pickupLng, dropLat, dropLng);
    return res.status(200).json(fareData);
  } catch (error) {
    return res.status(400).json({ rideError: error.message });
  }
};

const handleConfirmRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { rideId } = req.body;

    let ride = await confirmRide(rideId, req.driver);

    if (!ride) {
      throw new Error("Ride not found");
    }

    ride.status = "accepted";
    await ride.save();

    getIO().to(`ride:${rideId}`).emit("confirm-ride", {
      ride,
      driver: req.driver,
    });

    // Notify other drivers in dispatch room that the ride is taken
    getIO().to(`dispatch:${rideId}`).emit("ride-expired", { rideId });
    getIO().in(`dispatch:${rideId}`).socketsLeave(`dispatch:${rideId}`);

    // if (ride.creatorId?.socket_id) {
    //   sendMessageToSocketId("confirm-ride", ride.creatorId.socket_id, {
    //     ride,
    //     user: req.driver,
    //   });
    // }

    // ride.mitra.forEach((m) => {
    //   if (m.userId?.socket_id) {
    //     sendMessageToSocketId("confirm-ride", m.userId.socket_id, {
    //       ride,
    //       user: req.user,
    //     });
    //   }
    // });

    return res.status(200).json(ride);
  } catch (e) {
    console.log(e);
    res.status(400).send({ rideError: e.message });
  }
};

const handleStartRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { rideId, otp } = req.body;

    const ride = await Ride.findById(rideId).select("+otp")
      .populate("creatorId", "-password -salt -ridesBooked")
      .populate("driver", "-password -salt -ridesAcceptedUrl")
      .populate("mitra.userId", "-password -salt -ridesBooked");

    if (!ride) {
      throw new Error("Ride not found");
    }

    if (ride.otp !== Number(otp)) {
      throw new Error("Invalid OTP");
    }

    ride.status = "ongoing";
    await ride.save();

    getIO().to(`ride:${rideId}`).emit("ride-started", ride);

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
      "socket_id",
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

    await User.findByIdAndUpdate(req.user._id, {
      $push: { ridesBooked: roomId },
      currActiveRide: roomId,
    });

    room.mitra.push({ userId: req.user._id });
    await room.save();

    await room.populate("creatorId", "-password -salt -ridesBooked");
    console.log(room);

    getIO().to(`ride:${roomId}`).emit("new-userJoin", {
      room,
      user: req.user,
    });

    // Notify all mitra members
    // room.mitra.forEach((m) => {
    //   if (m.userId.socket_id) {
    //     sendMessageToSocketId("new-userJoin", m.userId.socket_id, {
    //       room,
    //       user: req.user,
    //     });
    //   }
    // });

    return res.status(200).json(room);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

const { getDistance } = require("../utils/distance");

const getAllOpenRooms = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropLat, dropLng } = req.query;

    if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
      // Fallback to returning all open rooms if no location is provided
      const rooms = await Ride.find({ status: "open" })
        .populate("creatorId", "-password -salt -ridesBooked")
        .populate("mitra.userId", "-password -salt -ridesBooked");
      return res.status(200).json(rooms);
    }

    const pLat = parseFloat(pickupLat);
    const pLng = parseFloat(pickupLng);
    const dLat = parseFloat(dropLat);
    const dLng = parseFloat(dropLng);

    const maxDistancePickup = 1000; // 1km
    const maxDistanceDrop = 1000; // 1km

    // 1. Find all open rooms where the pickup location is within 1km
    const rooms = await Ride.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [pLng, pLat] },
          distanceField: "pickupDistance",
          maxDistance: maxDistancePickup,
          query: { status: "open" },
          spherical: true,
          key: "pickupLocation"
        }
      }
    ]);

    // 2. Populate creator and mitra details (aggregation doesn't populate, so we use populate on model)
    const populatedRooms = await Ride.populate(rooms, [
      { path: "creatorId", select: "-password -salt -ridesBooked" },
      { path: "mitra.userId", select: "-password -salt -ridesBooked" }
    ]);

    // 3. Filter by destination distance (within 1km) and calculate score
    const candidateRooms = populatedRooms.map(room => {
      // Calculate distance between user's destination and room's destination
      const destDistance = getDistance(dLat, dLng, room.dropLocation.coordinates[1], room.dropLocation.coordinates[0]);
      return {
        ...room,
        destinationDistance: destDistance,
        score: room.pickupDistance + destDistance
      };
    }).filter(room => room.destinationDistance <= maxDistanceDrop);

    // 4. Sort by score (lowest distance score first)
    candidateRooms.sort((a, b) => a.score - b.score);

    return res.status(200).json(candidateRooms);
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

const getRideDetails = async (req, res) => {
  try {
    const { rideId } = req.query;

    const ride = await Ride.findById(rideId)
      .select("+otp")
      .populate("creatorId", "-password -salt -ridesBooked")
      .populate("driver", "-password -salt -ridesAcceptedUrl")
      .populate("mitra.userId", "-password -salt -ridesBooked");

    return res.status(200).json(ride);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

const endRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId)
      .populate("creatorId", "-password -salt -ridesBooked")
      .populate("driver", "-password -salt -ridesAcceptedUrl")
      .populate("mitra.userId", "-password -salt -ridesBooked");

    if (!ride) {
      throw new Error("Ride not found");
    }

    ride.status = "completed";

    if (ride.creatorId?.socket_id) {
      sendMessageToSocketId("ride-ended", `user:${ride.creatorId}`, {
        ride,
      });
    }

    ride.creatorId.currActiveRide = null;
    await ride.creatorId.save();

    ride.driver.currAcceptedRide = null;
    await ride.driver.save();

    ride.mitra.forEach((m) => {
      m.userId.currActiveRide = null;
      m.userId.save();
    });

    await ride.save();

    // Broadcast to the entire room so the client definitely gets the popup
    getIO().to(`ride:${rideId}`).emit("ride-ended", { ride });

    return res.status(200).json(ride);
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const userId = req.user ? req.user._id : req.driver._id;

    if (!rideId) {
      return res.status(400).json({ rideError: "Ride ID is required" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ rideError: "Ride not found" });
    }

    // Check if user is the creator
    const isCreator = ride.creatorId.toString() === userId.toString();
    
    // Check if user is the assigned driver
    const isDriver = ride.driverId && ride.driverId.toString() === userId.toString();

    if (!isCreator && !isDriver) {
      return res.status(403).json({ rideError: "Unauthorized to cancel this ride" });
    }

    const io = getIO();
    const DispatchService = require("../services/dispatchService");
    const userModel = require("../models/user");

    if (isCreator) {
      // Creator cancels: Cancel ride completely
      ride.status = "cancelled";
      await ride.save();

      // Clear creator's active ride
      await userModel.findByIdAndUpdate(ride.creatorId, { currActiveRide: null });
      
      // Clear all mitras' active rides
      if (ride.mitra && ride.mitra.length > 0) {
        const mitraIds = ride.mitra.map(m => m.userId);
        await userModel.updateMany({ _id: { $in: mitraIds } }, { currActiveRide: null });
      }

      // Clear driver's active ride if assigned
      if (ride.driverId) {
        const driverModel = require("../models/driver");
        await driverModel.findByIdAndUpdate(ride.driverId, { currAcceptedRide: null });
      }

      // Emit event
      io.to(`ride:${rideId}`).emit("ride-cancelled", { message: "The ride has been cancelled by the creator." });
      
      return res.status(200).json({ message: "Ride successfully cancelled." });

    } else if (isDriver) {
      // Driver cancels: Drop driver, reset to closed, and re-dispatch
      ride.status = "closed";
      ride.driverId = null;
      await ride.save();

      // Clear driver's active ride ONLY
      const driverModel = require("../models/driver");
      await driverModel.findByIdAndUpdate(userId, { currAcceptedRide: null });

      // Emit event to notify users that driver cancelled and we are searching again
      io.to(`ride:${rideId}`).emit("driver-cancelled-redispatch", { message: "The driver cancelled the ride. Searching for a new driver..." });

      // Trigger DispatchService to find a new driver
      DispatchService.dispatchRide(rideId);

      return res.status(200).json({ message: "You have cancelled the ride." });
    }

  } catch (err) {
    console.error("Error in cancelRide:", err);
    return res.status(500).json({ rideError: err.message });
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
  getRideDetails,
  handleStartRide,
  endRide,
  cancelRide,
};
