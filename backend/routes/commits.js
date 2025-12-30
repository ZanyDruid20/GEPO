const express = require('express');
const router = express.Router();
const commitsController = require('../controllers/commitsController');
const { ensureAuthenticated } = require('../middleware/auth_middleware');

// Route to get commit summary for a user
router.get('/summary/:username', ensureAuthenticated, commitsController.getSummary);

module.exports = router;