const driverService = require("../services/driverService");
const prisma = require("../config/prisma");
const { validationResult } = require("express-validator");

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

    const { token, newDriver } = await driverService.addDriverAndGenerateToken({
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
    const { token, driver } = await driverService.findDriverAndGenerateToken(
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
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await prisma.$transaction([
      prisma.blacklistToken.create({ data: { token, expiresAt } }),
      prisma.driver.update({
        where: { id: req.driver.id },
        data: { status: "OFFLINE" }
      })
    ]);

    res.clearCookie("token");
    res.status(200).json({ msg: "success" });
  } catch (err) {
    res.status(400).json({ msg: `${err.message} logout failed` });
  }
};

const handleGetDriverProfile = async (req, res) => {
  const driverWithRides = await prisma.driver.findUnique({
    where: { id: req.driver.id },
    omit: { password: true, salt: true }
  });
  return res.status(200).json(driverWithRides);
};

const handleGetDriverPastRides = async (req, res) => {
  try {
    const rides = await prisma.driver.findUnique({
      where: { id: req.driver.id },
      include: {
        acceptedRides: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    return res.status(200).json(rides?.acceptedRides || []);
  } catch (err) {
    console.error("Error fetching driver past rides", err);
    return res.status(500).json({ error: "Failed to fetch past rides" });
  }
};

const handleGetAllClosedRooms = async (req, res) => {
  try {
    const rooms = await prisma.ride.findMany({ where: { status: "CLOSED" } });
    return res.status(200).json(rooms);
  } catch (e) {
    return res.status(500).json({ rideError: e.message });
  }
};

const handleGetDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rides = await prisma.ride.findMany({
      where: {
        driverId: req.driver.id,
        status: "COMPLETED",
        updatedAt: { gte: today }
      }
    });

    const ridesAcceptedCnt = rides.length;
    const totalEarning = rides.reduce((acc, ride) => acc + Number(ride.fare), 0);

    return res.status(200).json({ ridesAcceptedCnt, totalEarning });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const handleToggleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["ONLINE", "OFFLINE"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const updatedDriver = await prisma.driver.update({
      where: { id: req.driver.id },
      data: { status }
    });
    return res.status(200).json({ status: updatedDriver.status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  handleDriverSignup,
  handleDriverSignin,
  handleDriverLogOut,
  handleGetDriverProfile,
  handleGetDriverPastRides,
  handleGetAllClosedRooms,
  handleGetDashboard,
  handleToggleStatus,
};
