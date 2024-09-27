const http = require('http');
const socketIo = require('socket.io');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { sendMessage } = require("./features/chat/chatService");

const app = require("./app");


const connection = require("./config/connection");

// connection to database
connection.check();

const port = process.env.PORT || 7500;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200", // Your Angular app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});


// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendMessage', async ({senderId, receiverId, message,id }) => {
    try {
      // Create chat entry in the database
   
      const createdAt = new Date().toISOString();
      
      await sendMessage(senderId, receiverId, message);
      console.log("send message succesfully stored in db");
       const roomId = `${senderId} - ${receiverId}`;
      
      // Emit the message to the receiver
      io.emit('receiveMessage', {
        id,
        senderId,
        receiverId,
        message,
        createdAt
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Listen for joining a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
