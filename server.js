// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require( 'socket.io' );
const redis = require('redis');

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

// Create a Redis client
const redisClient = redis.createClient({
  url: 'redis://red-ctq0pq5ds78s73d7g73g:6379'
} );

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
} );

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Failed to connect to Redis:', err);
} );

// Handle client connections
io.on('connection', (socket) => {
  console.log('A client connected');

  // Broadcast the updated number of connected clients to all clients
  UpdateClients();
    
  // Handle client disconnection
  socket.on('disconnect', () => {
    UpdateClients();
    console.log('A client disconnected');
  });
});

function UpdateClients() {
  io.emit( 'stats', io.engine.clientsCount );
  updatePlayerCount(io.engine.clientsCount);
}

// Function to update the player count in Redis
async function updatePlayerCount(numClients) {

  // Write the player count to Redis
  try {
      await redisClient.set('playerCount', numClients);
      console.log(`Updated player count in Redis: ${numClients}`);
  } catch (err) {
      console.error('Failed to update player count in Redis:', err);
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});