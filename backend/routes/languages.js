// routes/languages.js
const express = require('express');
const router = express.Router();
const languagesController = require('../controllers/languagesController');
const { ensureAuthenticated } = require('../middleware/auth_middleware');

router.get('/breakdown/:username', ensureAuthenticated, languagesController.getBreakdown);

module.exports = router;