const http = require('http');
const socketIo = require('socket.io');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const{ initSocket, getSocket } = require("./utils/socketManager")
const app = require("./app");
const connection = require("./config/connection");

// connection to database
connection.check();

const port = process.env.PORT || 7500;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io

initSocket(server)

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});


