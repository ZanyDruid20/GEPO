const passport = require('passport');
const User = require('../models/User');
require('../config/passport'); // Ensure passport strategies are configured

// GitHub OAUTH Controllers
// GitHub login: It accepts a browser request and redirects to github for authentication
exports.githubLogin = passport.authenticate('github', {scope: ['user:email']});

// GitHub callback: It handles the callback from GitHub after authentication
exports.githubCallback = (req, res, next) => {
    passport.authenticate('github', async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        
        try {
            // Save or update user in MongoDB
            const dbUser = await User.findOneAndUpdate(
                { githubId: user.id },
                {
                    githubId: user.id,
                    username: user.username,
                    email: user.emails?.[0]?.value || null,
                    avatarUrl: user.photos?.[0]?.value || null,
                    accessToken: user.accessToken
                },
                { upsert: true, new: true }
            );

            // log the user in
            req.login(dbUser, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                // Successful authentication
                req.session.githubAccessToken = dbUser.accessToken;
                // Redirect to frontend dashboard
                return res.redirect('http://localhost:3000/dashboard');
            });
        } catch (error) {
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
    })(req, res, next)
};

// Logout controller
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session.destroy();
        res.status(200).json({ message: 'Logout successful' });
    });
};

