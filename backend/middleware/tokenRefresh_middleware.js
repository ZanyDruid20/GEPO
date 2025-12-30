const axios = require('axios');

async function refreshTokenIfNeeded(req, res, next) {
  if (!req.session?.githubAccessToken) return next();
  
  try {
    // Quick check: ping GitHub API to see if token is valid
    await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${req.session.githubAccessToken}` }
    });
    return next();
  } catch (err) {
    if (err.response?.status === 401) {
      // Token expired - user should re-auth
      return res.status(401).json({ error: 'Token expired - please login again' });
    }
    return next();
  }
}

module.exports = { refreshTokenIfNeeded };