const { Router } = require("express");
const { query } = require("express-validator");
const {
  handleGetCoordinates,
  handleGetDistTime,
  handleGetAutoCompleteSuggestions,
} = require("../controllers/mapController");
const { authUser } = require("../middlewares/auth");

const router = Router();

router.get(
  "/get-cord",
  authUser,
  query("address").isString().isLength({ min: 3 }),
  handleGetCoordinates
);

router.get(
  "/get-dist-time",
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
  authUser,
  handleGetDistTime
);

router.get(
  "/get-suggestion",
  query("input").isString().isLength({ min: 3 }),
  authUser,
  handleGetAutoCompleteSuggestions
);

module.exports = router;
