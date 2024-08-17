const http = require('http');
const socketIo = require('socket.io');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

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

  // Listen for chat messages
  socket.on('sendMessage', (data) => {
    const { senderId, receiverId, message } = data;

    // Emit the message to the receiver
    socket.to(receiverId).emit('receiveMessage', {
      senderId,
      message,
      timestamp: new Date(),
    });
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
