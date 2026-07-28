const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("./auth");
const prisma = require("../config/prisma");

const addUserAndGenerateToken = async (data) => {
  const {
    fullName,
    email,
    password,
    mobileNo,
    gender,
    profileImagePath,
    idImagePath,
  } = data;

  try {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        salt,
        mobileNo,
        gender: gender.toUpperCase(),
        profileImageUrl: profileImagePath || "/images/defaultUser.png",
        idImageUrl: idImagePath,
      },
      omit: {
        password: true,
        salt: true,
      }
    });

    // Generate token
    const token = createToken(newUser);
    return { newUser, token };
  } catch (e) {
    throw new Error(e.message);
  }
};

const checkPasswordAndGenerateToken = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Email Not Found");

  const hashedPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== user.password) throw new Error("Wrong Password");

  const { password: _, salt: __, ...userWithoutPassword } = user;

  const token = createToken(userWithoutPassword);
  return { user: userWithoutPassword, token };
};

module.exports = {
  addUserAndGenerateToken,
  checkPasswordAndGenerateToken,
};
