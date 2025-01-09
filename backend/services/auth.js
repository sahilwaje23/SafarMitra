require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

function createToken(entity) {
  // console.log("secret", secret);
  const payload = {
    _id: entity.id,
    name: entity.fullName,
    email: entity.email,
    mobileNo: entity.mobileNo,
    gender: entity.gender,
    profileImageUrl: entity.docs.profileImageUrl,
    rating: entity.rating,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "15d" });
  return token;
}

function getUserFromToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { createToken, getUserFromToken };
