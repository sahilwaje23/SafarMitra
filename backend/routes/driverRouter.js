const { Router } = require("express");
const {
  handleDriverSignup,
  handleDriverSignin,
  handleDriverLogOut,
  handleGetDriverProfile,
} = require("../controllers/driverController");
const router = Router();
const { authDriver } = require("../middlewares/auth");
const {
  validateDriverSignUp,
  validateDriverSignIn,
} = require("../utilities/validation");
const uploads = require("../services/utilities");
const { body } = require("express-validator");

router.post(
  "/signup",
  uploads.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "aadharImage",
      maxCount: 1,
    },
    {
      name: "registrationCertificate",
      maxCount: 1,
    },
    {
      name: "licenseImage",
      maxCount: 1,
    },
  ]),
  validateDriverSignUp,
  handleDriverSignup
);

router.post("/login", validateDriverSignIn, handleDriverSignin);

router.get("/logout", authDriver, handleDriverLogOut);

router.get("/my-profile", authDriver, handleGetDriverProfile);

module.exports = router;
