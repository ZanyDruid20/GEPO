const express = require('express');
const router = express.Router();
const wrappedController = require('../controllers/wrappedController');
const { ensureAuthenticated } = require('../middleware/auth_middleware');

// Route to get wrapped data for a user
router.get('/:username', ensureAuthenticated, wrappedController.getWrapped);

module.exports = router;