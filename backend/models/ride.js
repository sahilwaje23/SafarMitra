const { Schema, model } = require("mongoose");

const driverSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    docs: {
      profileImageUrl: {
        type: String,
        required: true,
      },
      aadharImageUrl: {
        type: String,
      },
    },
    details: {
      vehicleNo: { type: String, required: true },
      chassisNo: { type: String, required: true },
      registrationCertificateUrl: { type: String, required: true },
      licenseImageUrl: {
        type: String,
        required: true,
      },
    },
    ridesAcceptedUrl: {
      type: [Schema.Types.ObjectId],
      ref: "ride",
    },
    rating: {
      type: Number,
      default: 0,
    },
    currentLocation: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Driver = model("driver", driverSchema);