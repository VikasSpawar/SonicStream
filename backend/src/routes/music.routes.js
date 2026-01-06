const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music.controller');

// GET /api/music/
router.get('/', musicController.getAllTracks);

// GET /api/music/search?query=cyber
router.get('/search', musicController.searchTracks);

// GET /api/music/trending
router.get('/trending', musicController.getTrending);


module.exports = router;