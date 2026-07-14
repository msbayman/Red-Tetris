import express from 'express';
// Import the HTTP server factory so Socket.IO can attach to it.
import { createServer } from 'http';
// Import the Socket.IO Server class using the ESM named export.
import { Server } from 'socket.io';

// Create the Express application.
const app = express();
// Read the port from the environment, or fall back to 3000.
const port = Number(process.env.PORT) || 3000;
// Create a raw HTTP server from the Express app.
const httpServer = createServer(app);
// Attach Socket.IO to the HTTP server.
const io = new Server(httpServer, {
  // Allow browser clients from any origin during development.
  cors: {
    // Permit all origins for local testing.
    origin: '*',
  },
});

// Respond to the root route.
app.get('/', (req, res) => {
  // Send a simple text response.
  res.send('hello world');
});

// Provide a health-check endpoint.
app.get('/health', (req, res) => {
  // Confirm the service is running.
  res.send('working');
});

// Handle websocket connections.
io.on('connection', (socket) => {
  // Log the id of the connected client.
  console.log(`Socket connected: ${socket.id}`);
  // Send a welcome event to the client.
  socket.emit('welcome', 'connected');
  // Listen for chat messages from the client.
  socket.on('chat message', (message) => {
    // Broadcast the message to every connected client.
    io.emit('chat message', message);
  });
  // Log when the client disconnects.
  socket.on('disconnect', () => {
    // Show that the socket has gone away.
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start the HTTP and websocket server.
httpServer.listen(port, () => {
  // Print the listening port for confirmation.
  console.log(`Example app listening on port ${port}`);
});
