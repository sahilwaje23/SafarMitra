const { Router } = require("express");
const router = Router();
const { validatePickUpDrop } = require("../utilities/validation");
const { authUser, authDriver } = require("../middlewares/auth");
const {
  handleCreateRoom,
  handleGetFare,
  handleConfirmRide,
  handleJoinRoom,
  handleCloseRoom,
  searchRoom,
  getAllOpenRooms,
  getAllWaitingClosedRooms,
  getRideDetails,
  handleStartRide,
  endRide,
  cancelRide,
} = require("../controllers/ridesController");
const { query, body } = require("express-validator");

router.post("/create-room", authUser, validatePickUpDrop, handleCreateRoom);

router.post(
  "/close-room",
  authUser,
  body("roomId")
    .notEmpty()
    .withMessage("Ride Id is required"),
  handleCloseRoom
);

router.post(
  "/search-room",
  authUser,
  body("pickup").isString(),
  body("destination").isString(),
  searchRoom
);

router.get(
  "/get-fare",
  authUser,
  query("pickupLat").isNumeric().withMessage("pickupLat is required"),
  query("pickupLng").isNumeric().withMessage("pickupLng is required"),
  query("dropLat").isNumeric().withMessage("dropLat is required"),
  query("dropLng").isNumeric().withMessage("dropLng is required"),
  handleGetFare
);

router.post(
  "/confirm-ride",
  authDriver,
  body("rideId")
    .notEmpty()
    .withMessage("Ride Id is required"),
  handleConfirmRide
);

router.get("/get-all-open-rooms", authUser, getAllOpenRooms);

router.post("/user-cancel-ride", authUser, body("rideId").notEmpty(), cancelRide);

// driver route :
router.get("/get-all-closed-rooms", authDriver, getAllWaitingClosedRooms);

// this is doubtfull :
router.get("/join-room", authUser, query("roomId").notEmpty(), handleJoinRoom);

router.get("/get-ride-details", query("rideId").notEmpty(), getRideDetails);

router.post("/start-ride", authDriver, body("rideId").notEmpty(), body("otp").notEmpty(), handleStartRide);

router.post("/end-ride", authDriver, body("rideId").notEmpty(), endRide);

router.post("/driver-cancel-ride", authDriver, body("rideId").notEmpty(), cancelRide);

module.exports = router;
