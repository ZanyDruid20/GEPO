const axios = require('axios');

// Authentication Services using GitHub OAuth API

class AuthService {
    // Verify that the access token is valid by fetching user data from GitHub
    async verifyAccess(accessToken)  {
        try {
            // making request to GitHub Oauth API to get authentication.
            const response = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${accessToken}`
                }
            });
            return response.data;
            // if successful, return user data
        } catch (error) {
            // else throw error
            throw new Error('Failed to authenticate user');
        
        }
    }
    // After authentication, fetch user repositories.
    async getUserRepos(accessToken) {
        try {
            // making request to GitHub API to get user repositories
            const response = await axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `token ${accessToken}`
                }
            });
            // if successful, return user data
            return response.data;
        } catch (error) {
            // else throw error
            throw new Error('Failed to fetch user repositories');
        }
    }
    // Get user profile information
    async getUserProfile(accessToken){
        try {
            // making request to GitHub API to get user profile information
            const response = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${accessToken}`
                }
            });
            // if successful, return user data
            return response.data;
        } catch (error) {
            // else throw error
            throw new Error('Failed to fetch user profile');
        }
    }
}
module.exports = new AuthService();