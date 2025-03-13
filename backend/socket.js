const { Server } = require("socket.io");
const cors = require("cors");
const User = require("./models/user");
const Driver = require("./models/driver");

let io; // bahar isliye declare kar rahe hai kyuki niche use karna hai

function initialiseSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected ", socket.id);

    // server yahape listen for join from this server
    socket.on("join", async (data) => {
      const { userType, userId } = data;
      // console.log("Connted user");
      if (userType === "USER") {
        try {
          await User.findByIdAndUpdate(userId, { socket_id: socket.id });
        } catch (e) {
          console.log(e);
        }
      } else if (userType === "DRIVER") {
        await Driver.findByIdAndUpdate(userId, { socket_id: socket.id });
      }
    });

    // driver online hone pe uski location update hogi
    socket.on("update-location-driver", async (data) => {
      const { driverId, location } = data;
      // console.log(location);
      // console.log(driverId)

      if (!location || !location.ltd || !location.lng)
        return socket.emit("error", { message: "Location not found" });

      await Driver.findByIdAndUpdate(driverId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected ", socket.id);
    });
  });
}

const sendMessageToSocketId = (event, socketId, data) => {
  console.log("sending message to ", socketId);
  if (io) {
    io.to(socketId).emit(event, data);
  } else {
    console.log("Socket is not initialized");
  }
};

module.exports = { initialiseSocket, sendMessageToSocketId };
