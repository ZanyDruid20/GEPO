const express = require('express');
const router = express.Router();
const scoresController = require('../controllers/scoresController');
const { ensureAuthenticated } = require('../middleware/auth_middleware');

// Route to get score for a user
router.get('/:username', ensureAuthenticated, scoresController.getScores);

module.exports = router;