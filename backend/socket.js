const { Server } = require("socket.io");
const cors = require("cors");
const User = require("./models/user");

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


    // server will listen for join from this server
    socket.on("join", async (data) => {
      const { userType, userId } = data;

      if (userType === "user") {
        await User.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "driver") {
        await Driver.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected ", socket.id);
    });
  });
}

const sendMessageToSocketId = (socketId, data) => {
  if (io) {
    io.to(socketId).emit("message", data);
  } else {
    console.log("Socket is not initialized");
  }
};

module.exports = { initialiseSocket, sendMessageToSocketId };
