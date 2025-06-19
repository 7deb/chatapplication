const { Server } = require("socket.io");

let io;
let userSocketMap = {};

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      for (let id in userSocketMap) {
        if (userSocketMap[id] === socket.id) {
          delete userSocketMap[id];
          break;
        }
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// ✅ Add a getter for `io` that always returns the latest reference
const getIO = () => io;

module.exports = { initSocket, getReceiverSocketId, getIO };
