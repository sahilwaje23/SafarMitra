const { Server } = require("socket.io");
const cors = require("cors");
const prisma = require("./config/prisma");
const driverService = require("./services/driverService");

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
      console.log("JOIN EVENT", socket.id, data);
      if (!userId) return;
      const parsedUserId = parseInt(userId, 10);
      socket.data.userId = parsedUserId;
      socket.data.userType = userType;

      if (userType === "USER") {
        try {
          socket.join(`user:${userId}`);
          
          // Fetch user to see if they need to automatically rejoin a ride room
          const user = await prisma.user.findUnique({ where: { id: parsedUserId } });
          if (user?.currentActiveRideId) {
            socket.join(`ride:${user.currentActiveRideId}`);
            socket.data.currentRideId = user.currentActiveRideId.toString();
            console.log("User automatically rejoined ride", user.currentActiveRideId);
          }
        } catch (e) {
          console.log(e);
        }
      } else if (userType === "DRIVER") {
        // socket.join(`driver:${parsedUserId}`);
        socket.join(`driver:${userId}`);

        // Fetch driver to see if they need to automatically rejoin a ride room
        const driver = await prisma.driver.findUnique({ where: { id: parsedUserId } });

        if (driver?.currentAcceptedRideId) {
          socket.join(`ride:${driver.currentAcceptedRideId}`);
          socket.data.currentRideId = driver.currentAcceptedRideId.toString();
          console.log("Driver automatically rejoined ride", driver.currentAcceptedRideId);
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

      // Update PostGIS geography using the service layer
      await driverService.updateLocation(driverId, location.lng, location.ltd);
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
