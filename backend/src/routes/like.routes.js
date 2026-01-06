const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller.js');

router.post('/toggle', likeController.toggleLike);
router.get('/', likeController.getLikedSongs);

module.exports = router;