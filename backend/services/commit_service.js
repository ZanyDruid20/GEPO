require('dotenv').config();
const axios = require('axios');
const { withCache, tokenKey } = require('../utils/cache');

const GITHUB_API = 'https://api.github.com';
const TOKEN = process.env.GITHUB_TOKEN;
const PER_PAGE = 100;

// Fetch recent repos for a given user
async function getRepos(username, token = TOKEN) {
  return withCache(`repos:${username}:${tokenKey(token)}`, 300, async () => {
    try {
      const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        params: { per_page: PER_PAGE, sort: 'updated' }
      });
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      console.error('getRepos failed', { status, data, message: err.message });
      throw err;
    }
  });
}

// Fetch commits for a given repository (with pagination)
async function getCommits(owner, repo, author) {
  let page = 1;
  const per_page = PER_PAGE;
  let commits = [];

  while (true) {
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/commits`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {})
      },
      params: { author, per_page, page }
    });
    // we collect the commits in a batch
    const batch = response.data || [];
    // then we concatenate them to the main array
    commits = commits.concat(batch);
    // if the batch is less than per_page, we are done
    if (batch.length < per_page) break;
    page++;
  }

  return commits; // ensure we return the collected commits
}

// Convenience: fetch commits for a single repo (used by your smoke test)
async function getCommitsForRepo(owner, repo) {
  return getCommits(owner, repo);
}

// Count commits for a single repo (paginates)
async function countCommitsForRepo(owner, repo, { author, token = TOKEN, since } = {}) {
  const cacheKey = `commitCount:${owner}:${repo}:${author || 'any'}:${since || 'all'}:${tokenKey(token)}`;
  return withCache(cacheKey, 300, async () => {
    // initialize page and total count
    let page = 1;
    let total = 0;

    while (true) {
      // make request to the GitHub API
      const res = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/commits`, {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        params: {
          per_page: PER_PAGE,
          page,
          ...(author ? { author } : {}),
          ...(since ? { since } : {})
        }
      }).catch(err => {
        const status = err.response?.status;
        const data = err.response?.data;
        console.error('countCommitsForRepo failed', { owner, repo, status, data, message: err.message });
        throw err;
      });

      const batch = res.data || [];
      total += batch.length;
      if (batch.length < PER_PAGE) break;
      page += 1;
    }

    return total;
  });
}

// Total commits across all repos for a username
async function totalCommitsForUser(username, { token = TOKEN, since } = {}) {
  try {
    // get all of the repos for the user and initialize grand total
    const repos = await getRepos(username, token);
    let grandTotal = 0;
    // we iterate over each repo to count commits
    for (const repo of repos) {
      // add up the commits from each repo to the grand total
      grandTotal += await countCommitsForRepo(username, repo.name, { author: username, token, since });
    }
    // return the final object
    return { username, repoCount: repos.length, totalCommits: grandTotal };
  } catch (err) {
    console.error(`Failed to fetch commits for ${username}:`, err.message);
    // Return empty data instead of crashing
    return { username, repoCount: 0, totalCommits: 0 };
  }
}
// Per-repo summary
async function summarizeCommits(username, { token = TOKEN, since, author } = {}) {
  // we use getRepos to fetch all repos for the user
  const repos = await getRepos(username, token);
  const summaries = [];
  let total = 0;
  // we iterate over each repo to count commits
  for (const r of repos) {
    // count commits and then add it to the total
    const count = await countCommitsForRepo(username, r.name, { token, since, author });
    total += count;
    // push the values into summaries array
    summaries.push({ repo: r.name, commitCount: count, url: r.html_url });
  }
  // return the final object
  return { username, totalCommits: total, repos: summaries };
}


// Only run when this file is executed directly, not when required
if (require.main === module) {
  (async () => {
    try {
      const summary = await summarizeCommits('ZanyDruid20');
      console.log(summary);
    } catch (err) {
      console.error('Summarize failed:', err.message);
    }
  })();
}

module.exports = {
  getCommits,
  getCommitsForRepo,
  summarizeCommits,
  getRepos,
  countCommitsForRepo,
  totalCommitsForUser
};



