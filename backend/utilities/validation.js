const { body } = require("express-validator");

const validateUserSignUp = [
  body("fullName").notEmpty().withMessage("Full Name is required"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .matches(/@(?:ce|it|elec|extc)\.vjti\.ac\.in$/)
    .withMessage("Email must belong to vjti.ac.in domain."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be alteast 8 chars"),
  body("mobileNo").isMobilePhone().withMessage("Mobile No is not valid"),
  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female."),
];

const validateUserSignIn = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .matches(/@(?:ce|it|elec|extc)\.vjti\.ac\.in$/)
    .withMessage("Email must belong to vjti.ac.in domain."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be alteast 8 chars"),
];

const validateDriverSignUp = [
  body("fullName").notEmpty().withMessage("Full Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 chars"),
  body("mobileNo").isMobilePhone().withMessage("Mobile No is not valid"),
  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female."),
  body("vehicleNo").notEmpty().withMessage("Vehicle Number is required"),
  body("chassisNo").notEmpty().withMessage("Chassis Number is required"),
];

const validateDriverSignIn = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  validateUserSignUp,
  validateUserSignIn,
  validateDriverSignUp,
  validateDriverSignIn,
};
