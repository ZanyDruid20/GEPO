require('dotenv').config();
const { totalCommitsForUser } = require('../services/commit_service');

(async () => {
  try {
    const username = 'ZanyDruid20';
    const since = undefined; // e.g., new Date('2024-01-01').toISOString()
    const result = await totalCommitsForUser(username, { since });
    console.log(`User: ${result.username}`);
    console.log(`Repos: ${result.repoCount}`);
    console.log(`Total commits: ${result.totalCommits}`);
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error('Smoke test failed:', status ? `${status} ${JSON.stringify(data)}` : err.message);
  }
})();