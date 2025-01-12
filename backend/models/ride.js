const { Schema, model } = require("mongoose");

const rideSchema = new Schema(
  {
    users: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
    ],
    driver: {
      type: Schema.Types.ObjectId,
      ref: "driver",
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    distance: {
      // in meters
      type: Number,
    },
    duration: {
      // in seconds
      type: Number,
    },
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "accepted", "completed", "cancelled"],
      default: "pending",
    },
    orderId: {
      type: String,
    },
    socketID: {},
    otp: {
      type: Number,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

const Ride = model("ride", rideSchema);
module.exports = Ride;
