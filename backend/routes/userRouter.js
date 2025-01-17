const { Router } = require("express");
const {
  handleSignUp,
  handleSignIn,
  handleGetUserProfile,
  handleLogOutUser,
} = require("../controllers/userController");
const upload = require("../services/utilities");
const {
  validateUserSignUp,
  validateUserSignIn,
} = require("../utilities/validation");
const { authUser } = require("../middlewares/auth");
const router = Router();

router.post(
  "/signup",
  upload.fields([
    { name: "profileImageUrl", maxCount: 1 },
    { name: "idImageUrl", maxCount: 1 },
  ]),
  validateUserSignIn,
  handleSignUp
);

router.post("/login", validateUserSignIn, handleSignIn);

router.get("/my-profile", authUser, handleGetUserProfile);

router.get("/logout", authUser, handleLogOutUser);

module.exports = router;
