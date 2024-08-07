const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const connection = require("./config/connection");


const http = require("http");
const socketIo = require("socket.io");

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"],
    credentials: true
  }
});


io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", async ({ roomId, userId, message }) => {
    // Save message to the database
    const chatMessage = await connection.db.ChatMessage.create({ roomId, userId, message });

    // Broadcast message to the room
    io.to(roomId).emit("receiveMessage", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// connection to database
connection.check();

const port = process.env.PORT || 7500;

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
