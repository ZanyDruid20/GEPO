// tests/services/wrapped_service.test.js
const axios = require('axios');
const WrappedService = require('../../services/wrapped_service');
const { getRepos, countCommitsForRepo } = require('../../services/commit_service');
const LanguageService = require('../../services/language_service');
const ScoresService = require('../../services/scores_service');
const { mockGitHubRepoResponse, mockLanguageResponse, mockCommitResponse, clearAllMocks } = require('../utils/testHelpers');

jest.mock('axios');
jest.mock('../../services/commit_service');
jest.mock('../../services/language_service');
jest.mock('../../services/scores_service');
jest.mock('../../utils/cache', () => ({
  withCache: jest.fn((key, ttl, fetcher) => fetcher()),
  tokenKey: jest.fn(token => token ? 'auth' : 'anon')
}));

describe('Wrapped Service', () => {
  beforeEach(() => {
    clearAllMocks();
    jest.clearAllMocks();
  });

  describe('getUserReport', () => {
    it('should aggregate all user data into wrapped report', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      LanguageService.getRepoLanguages.mockResolvedValue(mockLanguageResponse());
      countCommitsForRepo.mockResolvedValue(25);
      ScoresService.calculateScores.mockResolvedValue({ score: 150 });

      const result = await WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN);

      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('totalRepos', mockRepos.length);
      expect(result).toHaveProperty('totalBytes');
      expect(result).toHaveProperty('totalCommits');
      expect(result).toHaveProperty('score', 150);
      expect(result).toHaveProperty('languages');
    });

    it('should calculate totalCommits from all repositories', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      LanguageService.getRepoLanguages.mockResolvedValue(mockLanguageResponse());
      countCommitsForRepo
        .mockResolvedValueOnce(50) // First repo
        .mockResolvedValueOnce(30); // Second repo
      ScoresService.calculateScores.mockResolvedValue({ score: 150 });

      const result = await WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN);

      expect(result.totalCommits).toBe(80);
    });

    it('should calculate totalBytes from all repositories', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      const langs = mockLanguageResponse();
      LanguageService.getRepoLanguages.mockResolvedValue(langs);
      countCommitsForRepo.mockResolvedValue(25);
      ScoresService.calculateScores.mockResolvedValue({ score: 150 });

      const result = await WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN);

      const expectedBytes = Object.values(langs).reduce((a, b) => a + b, 0) * mockRepos.length;
      expect(result.totalBytes).toBeGreaterThan(0);
    });

    it('should aggregate languages and calculate percentages', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      LanguageService.getRepoLanguages.mockResolvedValue(mockLanguageResponse());
      countCommitsForRepo.mockResolvedValue(25);
      ScoresService.calculateScores.mockResolvedValue({ score: 150 });

      const result = await WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN);

      expect(typeof result.languages).toBe('object');
      expect(result.languages).not.toBeNull();
    });

    it('should handle user with no repositories', async () => {
      getRepos.mockResolvedValue([]);
      ScoresService.calculateScores.mockResolvedValue({ score: 0 });

      const result = await WrappedService.getUserReport('newuser', process.env.GITHUB_TOKEN);

      expect(result.totalRepos).toBe(0);
      expect(result.totalCommits).toBe(0);
      expect(result.totalBytes).toBe(0);
      expect(result.score).toBe(0);
      expect(result.languages).toEqual({});
    });

    it('should include user score in report', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      LanguageService.getRepoLanguages.mockResolvedValue(mockLanguageResponse());
      countCommitsForRepo.mockResolvedValue(25);
      ScoresService.calculateScores.mockResolvedValue({ score: 425 });

      const result = await WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN);

      expect(result.score).toBe(425);
    });

    it('should handle missing score result gracefully', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      LanguageService.getRepoLanguages.mockResolvedValue(mockLanguageResponse());
      countCommitsForRepo.mockResolvedValue(25);
      ScoresService.calculateScores.mockResolvedValue({}); // No score property

      const result = await WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN);

      expect(result.score).toBe(0);
    });

    it('should pass token parameter through to services', async () => {
      const mockRepos = mockGitHubRepoResponse();
      const testToken = 'test-token-123';
      getRepos.mockResolvedValue(mockRepos);

      LanguageService.getRepoLanguages.mockResolvedValue(mockLanguageResponse());
      countCommitsForRepo.mockResolvedValue(25);
      ScoresService.calculateScores.mockResolvedValue({ score: 150 });

      await WrappedService.getUserReport('testuser', testToken);

      expect(getRepos).toHaveBeenCalledWith('testuser', testToken);
      expect(ScoresService.calculateScores).toHaveBeenCalledWith('testuser', testToken);
    });
  });
});
