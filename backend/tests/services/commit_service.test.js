// tests/services/commit_service.test.js
const axios = require('axios');
const { getRepos, countCommitsForRepo, totalCommitsForUser, summarizeCommits } = require('../../services/commit_service');
const { mockGitHubRepoResponse, mockCommitResponse, clearAllMocks } = require('../utils/testHelpers');

jest.mock('axios');
jest.mock('../../utils/cache', () => ({
  withCache: jest.fn((key, ttl, fetcher) => fetcher()),
  tokenKey: jest.fn(token => token ? 'auth' : 'anon')
}));

describe('Commit Service', () => {
  beforeEach(() => {
    clearAllMocks();
    jest.clearAllMocks();
  });

  describe('getRepos', () => {
    it('should fetch user repositories', async () => {
      const mockRepos = mockGitHubRepoResponse();
      axios.get.mockResolvedValue({ data: mockRepos });

      const result = await getRepos('testuser');

      expect(result).toEqual(mockRepos);
      expect(axios.get).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('users/testuser/repos'),
        expect.any(Object)
      );
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      axios.get.mockRejectedValue(error);

      await expect(getRepos('testuser')).rejects.toThrow('API Error');
    });

    it('should return empty array if no repos', async () => {
      axios.get.mockResolvedValue({ data: [] });

      const result = await getRepos('newuser');

      expect(result).toEqual([]);
    });
  });

  describe('countCommitsForRepo', () => {
    it('should count commits for a repository', async () => {
      const mockCommits = mockCommitResponse(25);
      axios.get.mockResolvedValue({ data: mockCommits });

      const result = await countCommitsForRepo('testuser', 'test-repo', { author: 'testuser' });

      expect(result).toBe(25);
    });

    it('should handle pagination correctly', async () => {
      // First page: 100 commits
      axios.get
        .mockResolvedValueOnce({ data: mockCommitResponse(100) })
        .mockResolvedValueOnce({ data: mockCommitResponse(50) });

      const result = await countCommitsForRepo('testuser', 'test-repo', { author: 'testuser' });

      expect(result).toBe(150);
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it('should support optional since parameter', async () => {
      const mockCommits = mockCommitResponse(15);
      axios.get.mockResolvedValue({ data: mockCommits });

      const sinceDate = '2024-01-01';
      await countCommitsForRepo('testuser', 'test-repo', { since: sinceDate });

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            since: sinceDate
          })
        })
      );
    });
  });

  describe('totalCommitsForUser', () => {
    it('should sum commits across all user repositories', async () => {
      const mockRepos = mockGitHubRepoResponse();
      
      // Mock getRepos call
      axios.get.mockResolvedValueOnce({ data: mockRepos });
      // Mock commit counts for each repo
      axios.get.mockResolvedValue({ data: mockCommitResponse(25) });

      const result = await totalCommitsForUser('testuser');

      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('repoCount');
      expect(result).toHaveProperty('totalCommits');
      expect(result.totalCommits).toBeGreaterThan(0);
    });

    it('should return zero commits for new user with no repos', async () => {
      axios.get.mockResolvedValue({ data: [] });

      const result = await totalCommitsForUser('newuser');

      expect(result.totalCommits).toBe(0);
      expect(result.repoCount).toBe(0);
    });
  });

  describe('summarizeCommits', () => {
    it('should provide per-repo commit summary', async () => {
      const mockRepos = mockGitHubRepoResponse();
      axios.get.mockResolvedValueOnce({ data: mockRepos });
      axios.get.mockResolvedValue({ data: mockCommitResponse(20) });

      const result = await summarizeCommits('testuser');

      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('totalCommits');
      expect(result).toHaveProperty('repos');
      expect(Array.isArray(result.repos)).toBe(true);
      expect(result.repos.length).toBeGreaterThan(0);
      expect(result.repos[0]).toHaveProperty('repo');
      expect(result.repos[0]).toHaveProperty('commitCount');
      expect(result.repos[0]).toHaveProperty('url');
    });

    it('should sort repos and track individual commit counts', async () => {
      const mockRepos = mockGitHubRepoResponse();
      axios.get.mockResolvedValueOnce({ data: mockRepos });
      
      // Different commit counts per repo
      axios.get.mockResolvedValueOnce({ data: mockCommitResponse(50) });
      axios.get.mockResolvedValueOnce({ data: mockCommitResponse(30) });

      const result = await summarizeCommits('testuser');

      expect(result.repos[0].commitCount).toBeGreaterThan(0);
      expect(result.repos[1].commitCount).toBeGreaterThan(0);
      expect(result.totalCommits).toBe(80);
    });
  });
});
