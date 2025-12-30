/*
    Service for calculating scores based on repository data.
    this is a for scoring logic.
    Steps:
    1. Fetch all repositories for a user.
    2. Analyze commits, languages, and other metrics.
    3. Calculate scores based on predefined criteria.
    4. Return a comprehensive score report.
 */
require('dotenv').config();
const { getRepos } = require('./commit_service');
const LanguageService = require('./language_service');

class ScoresService {
    async calculateScores(username, token) {
        const repos = await getRepos(username, token);
        let totalScore = 0;
        
        for (const repo of repos) {
            const langBreakdown = await LanguageService.getRepoLanguages(username, repo.name, token);
            const langCount = Object.keys(langBreakdown).length;
            const repoSize = repo.size || 0;
            totalScore += langCount * 10 + repoSize / 1000;
        }
        
        return { username, totalRepos: repos.length, score: Math.round(totalScore) };
    }
}

module.exports = new ScoresService();