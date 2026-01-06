const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist.controller');

router.post('/', playlistController.createPlaylist);          // Create
router.get('/', playlistController.getUserPlaylists);         // List All
router.get('/:id', playlistController.getPlaylistDetails);    // Get One
router.post('/add-track', playlistController.addTrackToPlaylist); // Add Song

module.exports = router;