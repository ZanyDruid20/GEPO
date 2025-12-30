const Commit = require('../models/CommitModel');
const { totalCommitsForUser } = require('../services/commit_service');

// Save Commits to the Database
class CommitsController {
    async getSummary(req, res) {
        try {
            const username = req.params.username; // Added 'const'
            const summary = await totalCommitsForUser(username, { token: req.session.githubAccessToken });
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching commit summary', error: error.message });
        }
    }
}

module.exports = new CommitsController(); // Export instance