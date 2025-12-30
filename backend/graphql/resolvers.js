// In this file we define the resolvers that handles the graphql queries in the backend.
const { totalCommitsForUser } = require('../services/commit_service');
const languageService = require('../services/language_service');
const scoresService = require('../services/scores_service');
const wrappedService = require('../services/wrapped_service');

const resolvers = {
    Query: {
        commits: async (_, { username }, context) => {
            // Ensure the user is authenticated then get the commits
            const token = context.req?.session?.githubAccessToken;
            return await totalCommitsForUser(username, { token });
        },
        languages: async (_, { username}, context) => {
            // Ensure the user is authenticated then get the language breakdown
            const token = context.req?.session?.githubAccessToken;
            return await languageService.getLanguageBreakDown(username, token);
        },
        scores: async (_, { username }, context) => {
            // Ensure the user is authenticated then get the scores
            const token = context.req?.session?.githubAccessToken;
            return await scoresService.calculateScores(username, token);
        },
        wrapped: async (_, { username }, context) => {
            // Ensure the user is authenticated then get the wrapped report
            const token = context.req?.session?.githubAccessToken;
            const report = await wrappedService.getUserReport(username, token);
            const totalBytes = report.totalBytes || Object.values(report.languages || {}).reduce((sum, n) => sum + n, 0);
            const languages = Object.entries(report.languages || {})
                .map(([language, bytes]) => ({
                    language,
                    bytes,
                    percentage: totalBytes ? Number(((bytes / totalBytes) * 100).toFixed(2)) : 0
                }))
                .sort((a, b) => b.bytes - a.bytes);

            return { ...report, totalBytes, languages };
        }
    }
};
module.exports = resolvers;