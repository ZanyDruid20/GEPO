const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthenticated } = require('../middleware/auth_middleware');
const User = require('../models/User');

router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);
router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }
  return res.status(401).json({ message: 'Not authenticated' });
});
router.post('/logout', authController.logout);

router.delete('/delete-account', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user from database
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Logout the user
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed during account deletion' });
      }
      
      // Destroy session
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ message: 'Session destruction failed' });
        }
        
        res.status(200).json({ message: 'Account deleted successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account', error: error.message });
  }
});

module.exports = router;
