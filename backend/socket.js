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
      console.log("JOIN EVENT", socket.id, data);
      socket.data.userId = userId;
      socket.data.userType = userType;
      // socket.data.currentRideId = null;
      

      if (userType === "USER") {
        try {
          socket.join(`user:${userId}`);
          await User.findByIdAndUpdate(userId, { socket_id: socket.id });
        } catch (e) {
          console.log(e);
        }
      } else if (userType === "DRIVER") {
        socket.join(`driver:${userId}`);

        const driver = await Driver.findByIdAndUpdate(
          userId,
          { socket_id: socket.id },
          { new: true }
        );

        if (driver?.currAcceptedRide) {
          socket.join(`ride:${driver.currAcceptedRide}`);
          socket.data.currentRideId = driver.currAcceptedRide.toString();
          console.log("Driver automatically rejoined ride",driver.currAcceptedRide);
        }
      }
    });

    // driver online hone pe uski location update hogi
    socket.on("update-location-driver", async (data) => {
      const { location } = data;
      const driverId = socket.data.userId;

      if (socket.data.userType !== "DRIVER") {
        return;
      }

      if (!location || !location.ltd || !location.lng)
        return socket.emit("error", { message: "Location not found" });

      console.log(
        "location",
        socket.id,
        socket.data.currentRideId
    );

      if (socket.data.currentRideId) {
        console.log("driver sendiing location to ", `ride:${socket.data.currentRideId}`);
        socket
          .to(`ride:${socket.data.currentRideId}`)
          .emit("update-location-driver", location);
      }

      await Driver.findByIdAndUpdate(driverId, {
        location: {
          type: "Point",
          coordinates: [location.lng, location.ltd],
        },
      });
    });

    socket.on("ride:join", ({ rideId }) => {
      console.log("ride:join", rideId);
      socket.join(`ride:${rideId}`);
      socket.data.currentRideId = rideId;
      console.log("after setting", socket.id, socket.data.currentRideId);
    });

    socket.on("send-message", (data) => {
      const { rideId, message, senderName, senderId } = data;
      if (rideId) {
        console.log("sending new-chat to room", rideId, data);
        socket.to(`ride:${rideId}`).emit("new-chat", {
          message,
          senderName,
          senderId,
          timestamp: new Date().toISOString()
        });
      }
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

function getIO() {
  return io;
}

module.exports = { initialiseSocket, sendMessageToSocketId, getIO };
