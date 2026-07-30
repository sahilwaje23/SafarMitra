const { validationResult } = require("express-validator");
const { getFare, getOtp, confirmRide, createRide, closeRide, searchRides, joinRide, getOpenRidesWithinDistance, endRide: endRideService, cancelRide: cancelRideService } = require("../services/ride");
const prisma = require("../config/prisma");
const { getCaptainsInTheRadius } = require("../services/ride");
const { sendMessageToSocketId } = require("../socket");
const { getIO } = require("../socket");
const DispatchService = require("../services/dispatchService");

const handleCreateRoom = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  const { pickupText, pickupLat, pickupLng, dropText, dropLat, dropLng, maxPassengerCount } =
    req.body;

  const { fare, distance, duration } = await getFare(
    pickupLat,
    pickupLng,
    dropLat,
    dropLng,
  );

  try {
    const otp = getOtp();
    const newRoom = await createRide(
      req.user.id,
      pickupText, pickupLat, pickupLng,
      dropText, dropLat, dropLng,
      fare, distance, duration, otp, maxPassengerCount
    );

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
    
    try {
      const roomData = await closeRide(roomId, req.user.id);

      getIO().to(`ride:${roomId}`).emit("room-closed", roomData);

      // Start asynchronous dispatch flow
      DispatchService.dispatchRide(roomData.id); // Prisma uses id

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
    // The frontend must now pass coordinates instead of address text strings
    const { pickupLat, pickupLng, dropLat, dropLng } = req.body;

    if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
      return res
        .status(400)
        .json({ message: "Pickup and destination coordinates are required for spatial search" });
    }

    const rooms = await searchRides(pickupLat, pickupLng, dropLat, dropLng);

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

    // Atomic acceptance transaction inside the service
    const ride = await confirmRide(rideId, req.driver.id); // Prisma uses .id

    getIO().to(`ride:${rideId}`).emit("confirm-ride", {
      ride,
      driver: req.driver, // Send the driver details that made the request
    });

    // Notify other drivers in dispatch room that the ride is taken
    getIO().to(`dispatch:${rideId}`).emit("ride-expired", { rideId });
    getIO().in(`dispatch:${rideId}`).socketsLeave(`dispatch:${rideId}`);

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

    // Optimistic Concurrency check inside controller (since it's a single operation)
    const result = await prisma.ride.updateMany({
      where: { 
        id: parseInt(rideId, 10), 
        otp: parseInt(otp, 10), 
        status: "ACCEPTED",
        driverId: req.driver.id // Ensure only the assigned driver can start it
      },
      data: { status: "ONGOING"}
    });

    if (result.count === 0) {
      throw new Error("Invalid OTP, ride not accepted, or unauthorized driver");
    }

    const ride = await prisma.ride.findUnique({
      where: { id: parseInt(rideId, 10) },
      include: {
        creator: { omit: { password: true, salt: true } },
        driver: { omit: { password: true, salt: true } },
        mitras: { include: { user: { omit: { password: true, salt: true } } } }
      }
    });

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

    // Atomic join operation managed by service
    const room = await joinRide(roomId, req.user.id);

    getIO().to(`ride:${roomId}`).emit("new-userJoin", {
      room,
      user: req.user,
    });

    return res.status(200).json(room);
  } catch (e) {
    console.log(e)
    return res.status(500).json({ rideError: e.message });
  }
};

const getAllOpenRooms = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropLat, dropLng } = req.query;

    if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
      // Fallback: Return all open rooms
      const rooms = await prisma.ride.findMany({
        where: { 
          status: "OPEN",
          currentPassengerCount: { lt: prisma.ride.fields.maxPassengerCount }
        },
        include: {
          creator: { omit: { password: true, salt: true } },
          mitras: { include: { user: { omit: { password: true, salt: true } } } }
        }
      });
      const formattedRooms = rooms.map(room => ({
        ...room,
        distance: room.distanceMeters ? (parseFloat(room.distanceMeters) / 1000).toFixed(1) : 0,
        duration: room.durationSeconds ? Math.round(parseFloat(room.durationSeconds) / 60) : 0,
      }));
      return res.status(200).json(formattedRooms);
    }

    // Use highly efficient PostGIS spatial query from service
    const rawRooms = await getOpenRidesWithinDistance(
      parseFloat(pickupLat),
      parseFloat(pickupLng),
      parseFloat(dropLat),
      parseFloat(dropLng)
    );

    if (!rawRooms || rawRooms.length === 0) {
      return res.status(200).json([]);
    }

    const roomIds = rawRooms.map(r => r.id);

    // Fetch the fully populated Prisma models
    const rooms = await prisma.ride.findMany({
      where: { id: { in: roomIds } },
      include: {
        creator: { omit: { password: true, salt: true } },
        mitras: { include: { user: { omit: { password: true, salt: true } } } }
      }
    });

    // Re-sort the populated models based on the rawRooms order
    const sortedRooms = rooms.sort((a, b) => {
      return roomIds.indexOf(a.id) - roomIds.indexOf(b.id);
    });

    const formattedRooms = sortedRooms.map(room => ({
      ...room,
      distance: room.distanceMeters ? (parseFloat(room.distanceMeters) / 1000).toFixed(1) : 0,
      duration: room.durationSeconds ? Math.round(parseFloat(room.durationSeconds) / 60) : 0,
    }));

    return res.status(200).json(formattedRooms);
  } catch (e) {
    console.log(e)
    return res.status(500).json({ rideError: e.message });
  }
};

const getAllWaitingClosedRooms = async (req, res) => {
  try {
    const rooms = await prisma.ride.findMany({
      where: { status: "CLOSED" }
    });
    return res.status(200).json(rooms);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

const getRideDetails = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  try {
    const { rideId } = req.query;

    if (!rideId) {
      return res.status(400).json({ rideError: "rideId is required" });
    }

    const parsedId = parseInt(rideId, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ rideError: "Invalid rideId format" });
    }

    const [ride, locations] = await Promise.all([
      prisma.ride.findUnique({
        where: { id: parsedId },
        include: {
          creator: { omit: { password: true, salt: true } },
          driver: { omit: { password: true, salt: true } },
          mitras: { include: { user: { omit: { password: true, salt: true } } } }
        }
      }),
      prisma.$queryRaw`
        SELECT ST_Y("pickup_location"::geometry) AS "pickupLat", 
               ST_X("pickup_location"::geometry) AS "pickupLng",
               ST_Y("drop_location"::geometry) AS "dropLat", 
               ST_X("drop_location"::geometry) AS "dropLng"
        FROM "rides" 
        WHERE "id" = ${parsedId}
      `
    ]);

    if (!ride) {
      return res.status(200).json(null);
    }

    if (locations && locations.length > 0) {
      ride.pickup = {
        lat: locations[0].pickupLat,
        lng: locations[0].pickupLng,
        text: ride.pickupAddress
      };
      ride.destination = {
        lat: locations[0].dropLat,
        lng: locations[0].dropLng,
        text: ride.dropAddress
      };
    }

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

    const ride = await endRideService(rideId);

    // Socket broadcasts happen outside the transaction
    getIO().to(`ride:${rideId}`).emit("ride-ended", { ride });

    return res.status(200).json(ride);
  } catch (e) {
    res.status(400).send({ rideError: e.message });
  }
};

const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    
    const isCreator = req.user ? true : false;
    const isDriver = req.driver ? true : false;
    const userId = req.user ? req.user.id : req.driver.id;

    if (!rideId) {
      return res.status(400).json({ rideError: "Ride ID is required" });
    }

    const result = await cancelRideService(rideId, userId, isCreator, isDriver);

    const io = getIO();
    const DispatchService = require("../services/dispatchService");

    // Side effects (sockets, dispatching) must happen AFTER transaction commits
    if (result.status === "CANCELLED") {
      io.to(`ride:${rideId}`).emit("ride-cancelled", { message: "The ride has been cancelled by the creator." });
      return res.status(200).json({ message: "Ride successfully cancelled." });
    } else if (result.status === "CLOSED") {
      io.to(`ride:${rideId}`).emit("driver-cancelled-redispatch", { message: "The driver cancelled the ride. Searching for a new driver..." });
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
