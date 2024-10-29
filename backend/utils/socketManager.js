// socketManager.js
const socketIo = require("socket.io");
const { sendMessage } = require("../features/chat/chatService");
const notificationCountRepository = require("../features/notificationCount/notificationCountRepository");
const userRepository = require("../features/users/userRepository");

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
      

        // Emit the message to the receiver
        io.emit("receiveMessage", {
          id,
          senderId,
          receiverId,
          message,
          createdAt,
        });

        const reciever = await userRepository.getUserById(receiverId);

        const messageCount = await notificationCountRepository.incrementCount(
          reciever.Houses[0].Floor.Wing.Society.id || null,
          receiverId,
          "chat",
          senderId
        );
        io.to(receiverId).emit("updatedChatCount", {
          senderId,
          count: messageCount,
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
    console.log("Attempted to get io but it's not initialized");
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getSocket };
