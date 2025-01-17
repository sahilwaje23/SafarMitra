const { Router } = require("express");
const router = Router();
const { validateRideCreation } = require("../utilities/validation");
const { authUser } = require("../middlewares/auth");
const { handleCreateRide } = require("../controllers/ridesController");

router.post("/create-room", authUser, validateRideCreation, handleCreateRide);

module.exports = router;
