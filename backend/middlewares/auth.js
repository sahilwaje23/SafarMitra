const prisma = require("../config/prisma");
const { getUserFromToken } = require("../services/auth");

const authUser = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).json({ msg: "Unauthorised" });

  const isBlacklisted = await prisma.blacklistToken.findUnique({ where: { token } });

  if (isBlacklisted)
    return res.status(401).json({ msg: "Unauthorised , using stolen token " });

  try {
    const decoded_user = getUserFromToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded_user._id },
      omit: { password: true, salt: true }
    });

    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorised" });
  }
};

const authDriver = async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).json({ msg: "Unauthorised" });

  const isBlacklisted = await prisma.blacklistToken.findUnique({ where: { token } });

  if (isBlacklisted)
    return res.status(401).json({ msg: "Unauthorised , using stolen token " });

  try {
    const decoded_driver = getUserFromToken(token);
    
    const driver = await prisma.driver.findUnique({
      where: { id: decoded_driver._id },
      omit: { password: true, salt: true }
    });

    if (!driver) return res.status(401).json({ msg: "Driver not found" });

    req.driver = driver;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorised" });
  }
};

module.exports = { authUser, authDriver };
