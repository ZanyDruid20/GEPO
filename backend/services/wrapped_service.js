/*
    Wrapped Service just Aggregates all the serivces together to tell the full story of the user repository data.
    Steps:
    1. Fetch all repositories for a user.
    2. For each repository, fetch commits, languages, and other metrics.
    3. Aggregate the data into a comprehensive report.
    4. Return the aggregated report.
 */
const { getRepos, countCommitsForRepo } = require('./commit_service');
const LanguageService = require('./language_service');
const ScoresService = require('./scores_service');
const { withCache, tokenKey } = require('../utils/cache');

class WrappedService {
    async getUserReport(username, token) {
        return withCache(`wrapped:${username}:${tokenKey(token)}`, 600, async () => {
            const repos = await getRepos(username, token);
            const report = {
                username,
                totalRepos: repos.length,
                languages: {},
                totalBytes: 0,
                totalCommits: 0,
                score: 0
            };
            
            for (const repo of repos) {
                // Get language breakdown for the repo
                const langMap = await LanguageService.getRepoLanguages(username, repo.name, token);
                for (const [lang, bytes] of Object.entries(langMap)) {
                    report.languages[lang] = (report.languages[lang] || 0) + bytes;
                    report.totalBytes += bytes;
                }
                
                // Get commit count for the repo
                const commitCount = await countCommitsForRepo(username, repo.name, { token });
                report.totalCommits += commitCount;
            }
            
            // Calculate overall score - extract numeric score
            const scoreResult = await ScoresService.calculateScores(username, token);
            report.score = scoreResult?.score || 0;
            return report;
        });
    }
}

module.exports = new WrappedService();