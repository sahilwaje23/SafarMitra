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
  endRide,
} = require("../controllers/ridesController");
const { query, body } = require("express-validator");

router.post("/create-room", authUser, validatePickUpDrop, handleCreateRoom);

router.post(
  "/close-room",
  authUser,
  body("roomId")
    .isString()
    .isLength({ min: 3 })
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
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("PickUp is required"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Destination is required"),
  handleGetFare
);

router.post(
  "/confirm-ride",
  authDriver,
  body("rideId")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Ride Id is required"),
  handleConfirmRide
);

router.get("/get-all-open-rooms", authUser, getAllOpenRooms);

// driver route :
router.get("/get-all-closed-rooms", authDriver, getAllWaitingClosedRooms);

// this is doubtfull :
router.get("/join-room", authUser, query("roomId").isString(), handleJoinRoom);

router.get("/get-ride-details", query("rideId").isString(), getRideDetails);

router.post("/end-ride", authDriver, body("rideId").isString(), endRide);

module.exports = router;
