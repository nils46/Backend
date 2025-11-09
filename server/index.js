const express = require('express');
const cors = require('cors');
const http = require('http'); // 1. Import http
const { Server } = require("socket.io"); // 2. Import socket.io

const app = express();
const PORT = process.env.PORT || 8080;

// 3. Create an HTTP server from the Express app
const server = http.createServer(app);

// 4. Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for a hackathon)
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// 5. Make the 'io' object available to our routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import routes
const postRoutes = require('./routes/posts');

// API Routes
app.use('/api/posts', postRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Discussion Forum API is running!');
});

// 6. Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 7. Start the 'server' (which includes Express and socket.io)
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});