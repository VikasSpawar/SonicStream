const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Import Routes
const musicRoutes = require('./routes/music.routes');
const playlistRoutes = require('./routes/playlist.routes');
const likeRoutes = require('./routes/like.routes');
// const podcastRoutes = require('./routes/podcast.routes'); // Uncomment later

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow Frontend to hit Backend
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Route Middleware
app.use('/api/music', musicRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/likes', likeRoutes);
// app.use('/api/podcasts', podcastRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'SonicStream API is live 🎵' });
});



// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = app;