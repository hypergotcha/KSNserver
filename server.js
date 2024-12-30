// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create an Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Add a route in Express to serve the default page
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Initialize Socket.IO
const io = new Server(server);

// Handle client connections
io.on('connection', (socket) => {
  console.log('A client connected');

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});