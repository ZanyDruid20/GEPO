// tests/utils/testHelpers.js
const redis = require('../../db/redis');

/**
 * Clear all mocks between tests
 */
function clearAllMocks() {
  jest.clearAllMocks();
  redis.get.mockResolvedValue(null);
  redis.set.mockResolvedValue('OK');
  redis.del.mockResolvedValue(1);
}

/**
 * Mock a successful GitHub API response
 */
function mockGitHubRepoResponse(repos = []) {
  const defaultRepos = repos.length
    ? repos
    : [
        {
          id: 1,
          name: 'test-repo',
          html_url: 'https://github.com/testuser/test-repo',
          size: 1024,
          language: 'JavaScript'
        },
        {
          id: 2,
          name: 'another-repo',
          html_url: 'https://github.com/testuser/another-repo',
          size: 2048,
          language: 'Python'
        }
      ];
  return defaultRepos;
}

/**
 * Mock a language breakdown response
 */
function mockLanguageResponse(languages = {}) {
  return languages.length
    ? languages
    : {
        JavaScript: 50000,
        Python: 30000,
        TypeScript: 20000
      };
}

/**
 * Mock commit data
 */
function mockCommitResponse(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    sha: `abc${i}`,
    commit: {
      message: `Commit ${i + 1}`,
      author: { date: new Date().toISOString() }
    }
  }));
}

module.exports = {
  clearAllMocks,
  mockGitHubRepoResponse,
  mockLanguageResponse,
  mockCommitResponse
};
