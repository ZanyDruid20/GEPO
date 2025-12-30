const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/github', authController.githubLogin); // redirect to GitHub
router.get('/github/callback', authController.githubCallback); // handle GitHub code
router.post('/logout', authController.logout); // no ensureAuthenticated

module.exports = router;
