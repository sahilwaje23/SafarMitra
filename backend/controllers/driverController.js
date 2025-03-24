const Driver = require("../models/driver");
const Ride = require("../models/ride");
const { validationResult } = require("express-validator");
const BlackList = require("../models/blacklistToken");

const handleDriverSignup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (
      !req.files ||
      !req.files.profileImage ||
      !req.files.aadharImage ||
      !req.files.registrationCertificate ||
      !req.files.licenseImage
    ) {
      throw new Error("All images are required");
    }

    const profileImagePath = req.files.profileImage[0].path;
    const aadharImagePath = req.files.aadharImage[0].path;
    const registrationCertificatePath =
      req.files.registrationCertificate[0].path;
    const licenseImagePath = req.files.licenseImage[0].path;

    const { token, newDriver } = await Driver.addDriverAndGenerateToken({
      ...req.body,
      profileImageUrl: profileImagePath,
      aadharImageUrl: aadharImagePath,
      registrationCertificateUrl: registrationCertificatePath,
      licenseImageUrl: licenseImagePath,
    });
    res.cookie("token", token);
    res.status(201).json({ msg: "success", token, newDriver });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const handleDriverSignin = async (req, res) => {
  let { email, password } = req.body;
  try {
    const { token, driver } = await Driver.findDriverAndGenerateToken(
      email,
      password
    );
    res.cookie("token", token);
    res.status(200).json({ msg: "success", token, driver });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const handleDriverLogOut = async (req, res) => {
  const token =
    req.cookies.token || req.headers.authorization?.split("Bearer ")[1];

  try {
    await BlackList.create({ token });
    res.clearCookie("token");
    res.status(200).json({ msg: "success" });
  } catch (err) {
    res.status(400).json({ msg: `${err.message} logout failed` });
  }
};

const handleGetDriverProfile = async (req, res) => {
  const driver = req.driver;
  return res.status(200).json(driver);
};

const handleGetAllClosedRooms = async (req, res) => {
  try {
    const rooms = await Ride.find({ status: "closed" });
    return res.status(200).json(rooms);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

module.exports = {
  handleDriverSignup,
  handleDriverSignin,
  handleDriverLogOut,
  handleGetDriverProfile,
  handleGetAllClosedRooms,
};
