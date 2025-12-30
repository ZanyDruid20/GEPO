require('dotenv').config();
const axios = require('axios');
const { getRepos } = require('./commit_service');
const { withCache, tokenKey } = require('../utils/cache');

const GITHUB_API = 'https://api.github.com';
const TOKEN = process.env.GITHUB_TOKEN;

class LanguageService {
  async getRepoLanguages(owner, repo, token = TOKEN) {
    return withCache(`repoLang:${owner}:${repo}:${tokenKey(token)}`, 900, async () => {
      const res = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return res.data || {};
    });
  }

  async getLanguageBreakDown(username, token = TOKEN) {
    return withCache(`langSummary:${username}:${tokenKey(token)}`, 600, async () => {
      // Use imported getRepos (not this.getRepos)
      const repos = await getRepos(username, token);

      const totals = {};
      for (const repo of repos) {
        const langMap = await this.getRepoLanguages(username, repo.name, token);
        for (const [lang, bytes] of Object.entries(langMap)) {
          totals[lang] = (totals[lang] || 0) + bytes;
        }
      }

      const totalBytes = Object.values(totals).reduce((sum, n) => sum + n, 0);

      const languages = Object.entries(totals)
        .map(([language, bytes]) => ({
          language,
          bytes,
          percentage: totalBytes ? Number(((bytes / totalBytes) * 100).toFixed(2)) : 0
        }))
        .sort((a, b) => b.bytes - a.bytes);

      return { username, totalRepos: repos.length, totalBytes, languages };
    });
  }
}

module.exports = new LanguageService();