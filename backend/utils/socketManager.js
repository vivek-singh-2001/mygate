// socketManager.js
const socketIo = require("socket.io");
const { sendMessage } = require("../features/chat/chatService");

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:4200", // Your Angular app URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("sendMessage", async ({ senderId, receiverId, message, id }) => {
      try {
        // Create chat entry in the database

        const createdAt = new Date().toISOString();

        await sendMessage(senderId, receiverId, message);
        console.log("send message succesfully stored in db");
        const roomId = `${senderId} - ${receiverId}`;

        // Emit the message to the receiver
        io.emit("receiveMessage", {
          id,
          senderId,
          receiverId,
          message,
          createdAt,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Listen for joining a room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getSocket };
