const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("./auth");
const prisma = require("../config/prisma");

const addDriverAndGenerateToken = async (driverData) => {
  const {
    fullName,
    email,
    password,
    mobileNo,
    gender,
    vehicleNo,
    chassisNo,
    registrationCertificateUrl,
    licenseImageUrl,
    profileImageUrl,
    aadharImageUrl,
  } = driverData;

  try {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const newDriver = await prisma.driver.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        salt,
        mobileNo,
        gender: gender.toUpperCase(),
        vehicleNo,
        chassisNo,
        rcImageUrl: registrationCertificateUrl,
        licenseImageUrl,
        profileImageUrl,
        aadharImageUrl,
      },
      omit: {
        password: true,
        salt: true,
      },
    });

    const token = createToken(newDriver);
    return { token, newDriver };
  } catch (err) {
    throw new Error(err.message);
  }
};

const findDriverAndGenerateToken = async (email, password) => {
  const driver = await prisma.driver.findUnique({ where: { email } });
  if (!driver) {
    throw new Error("Driver not found , pls check email");
  }

  const originalHashedPassword = driver.password;
  const salt = driver.salt;

  const hashedGivenPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (originalHashedPassword !== hashedGivenPassword)
    throw new Error("Wrong Password");

  const { password: _, salt: __, ...driverWithoutPassword } = driver;

  const token = createToken(driverWithoutPassword);
  return { token, driver: driverWithoutPassword };
};

const updateLocation = async (driverId, lng, ltd) => {
  await prisma.$executeRaw`
    UPDATE "drivers" 
    SET "location" = ST_SetSRID(ST_MakePoint(${lng}, ${ltd}), 4326) 
    WHERE "id" = ${driverId}
  `;
};

module.exports = {
  addDriverAndGenerateToken,
  findDriverAndGenerateToken,
  updateLocation,
};
