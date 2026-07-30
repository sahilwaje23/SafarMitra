const userService = require("../services/userService");
const { validationResult } = require("express-validator");
const prisma = require("../config/prisma");

const handleSignUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password, mobileNo, gender } = req.body;

    console.log("here")

    if (!req.files || !req.files.profileImageUrl || !req.files.idImageUrl) {
      throw new Error("Both profile and ID images are required.");
    }
    console.log(req.files);

    const profileImagePath = req.files.profileImageUrl[0].path;
    const idImagePath = req.files.idImageUrl[0].path;

    // Add user and generate token (Calling service instead of Mongoose model)
    const { newUser, token } = await userService.addUserAndGenerateToken({
      fullName,
      email,
      password,
      mobileNo,
      gender,
      profileImagePath,
      idImagePath,
    });
    // console.log(token)
    res.cookie("token", token);
    res.status(201).json({ msg: "success", token, newUser });
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message);
  }
};

const handleSignIn = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { email, password } = req.body;
  try {
    // Calling service instead of Mongoose model
    const { user, token } = await userService.checkPasswordAndGenerateToken(
      email,
      password
    );
    // console.log(token);
    res.cookie("token", token);
    return res.status(200).json({ msg: "success", token: token, user });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ err: err.message });
  }
};

const handleGetUserProfile = async (req, res) => {
  const user = req.user;
  const userWithRides = await prisma.user.findUnique({
    where: { id: user.id },
    omit: {
      password: true,
      salt: true,
    },
  });
  // console.log(userWithRides);

  return res.status(200).json(userWithRides);
};

const handleGetUserPastRides = async (req, res) => {
  try {
    const user = req.user;
    const rides = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        createdRides: {
          orderBy: { createdAt: 'desc' }
        },
        rideMitras: {
          include: { ride: true },
          orderBy: { joinedAt: 'desc' }
        }
      }
    });

    // Format all rides into a single array
    const allRides = [
      ...(rides?.createdRides?.map(r => ({ ...r, isMitra: false })) || []),
      ...(rides?.rideMitras?.map(rm => ({ ...rm.ride, isMitra: true })) || [])
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(allRides);
  } catch (err) {
    console.error("Error fetching user past rides", err);
    return res.status(500).json({ error: "Failed to fetch past rides" });
  }
};

const handleLogOutUser = async (req, res) => {
  const token =
    req.cookies?.token || req.headers.authorization?.split("Bearer ")[1];
  
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.blacklistToken.create({
      data: { token, expiresAt },
    });
    res.clearCookie("token");
  } catch (e) {
    return res
      .status(401)
      .json({ error: `error during logout :: ${e.message} ` });
  }

  return res.status(200).json({ msg: "success" });
};

module.exports = {
  handleSignUp,
  handleSignIn,
  handleGetUserProfile,
  handleGetUserPastRides,
  handleLogOutUser,
};
