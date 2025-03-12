const { Schema, model } = require("mongoose");

const rideSchema = new Schema(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    mitra: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
    ],

    pickup: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },

    destination: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },

    driver: {
      type: Schema.Types.ObjectId,
      ref: "driver",
    },

    distance: {
      // in meters
      type: String,
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
      enum: ["open", "ongoing", "accepted", "completed", "cancelled", "closed"],
      // open -> closed -> driver coming??? -> accepted -> ongoing -> completed 
      //   basic lifecycle
      default: "open",
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
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Ride = model("ride", rideSchema);
module.exports = Ride;
