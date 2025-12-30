// tests/services/language_service.test.js
const axios = require('axios');
const LanguageService = require('../../services/language_service');
const { getRepos } = require('../../services/commit_service');
const { mockGitHubRepoResponse, mockLanguageResponse, clearAllMocks } = require('../utils/testHelpers');

jest.mock('axios');
jest.mock('../../services/commit_service');
jest.mock('../../utils/cache', () => ({
  withCache: jest.fn((key, ttl, fetcher) => fetcher()),
  tokenKey: jest.fn(token => token ? 'auth' : 'anon')
}));

describe('Language Service', () => {
  beforeEach(() => {
    clearAllMocks();
    jest.clearAllMocks();
  });

  describe('getRepoLanguages', () => {
    it('should fetch language breakdown for a repository', async () => {
      const mockLanguages = mockLanguageResponse();
      axios.get.mockResolvedValue({ data: mockLanguages });

      const result = await LanguageService.getRepoLanguages('testuser', 'test-repo');

      expect(result).toEqual(mockLanguages);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('repos/testuser/test-repo/languages'),
        expect.any(Object)
      );
    });

    it('should return empty object if repository has no languages', async () => {
      axios.get.mockResolvedValue({ data: {} });

      const result = await LanguageService.getRepoLanguages('testuser', 'empty-repo');

      expect(result).toEqual({});
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      axios.get.mockRejectedValue(error);

      await expect(LanguageService.getRepoLanguages('testuser', 'test-repo')).rejects.toThrow('API Error');
    });
  });

  describe('getLanguageBreakDown', () => {
    it('should aggregate languages across all user repositories', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      const mockLanguages = mockLanguageResponse();
      axios.get.mockResolvedValue({ data: mockLanguages });

      const result = await LanguageService.getLanguageBreakDown('testuser');

      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('totalRepos', mockRepos.length);
      expect(result).toHaveProperty('totalBytes');
      expect(result).toHaveProperty('languages');
      expect(Array.isArray(result.languages)).toBe(true);
    });

    it('should calculate percentages correctly', async () => {
      getRepos.mockResolvedValue(mockGitHubRepoResponse());
      axios.get.mockResolvedValue({ data: mockLanguageResponse() });

      const result = await LanguageService.getLanguageBreakDown('testuser');

      const totalPercentage = result.languages.reduce((sum, lang) => sum + lang.percentage, 0);
      
      // Should sum to 100% (allowing for floating point precision)
      expect(Math.abs(totalPercentage - 100)).toBeLessThan(1);
    });

    it('should sort languages by bytes in descending order', async () => {
      getRepos.mockResolvedValue(mockGitHubRepoResponse());
      axios.get.mockResolvedValue({ data: mockLanguageResponse() });

      const result = await LanguageService.getLanguageBreakDown('testuser');

      for (let i = 0; i < result.languages.length - 1; i++) {
        expect(result.languages[i].bytes).toBeGreaterThanOrEqual(result.languages[i + 1].bytes);
      }
    });

    it('should handle user with no repositories', async () => {
      getRepos.mockResolvedValue([]);

      const result = await LanguageService.getLanguageBreakDown('newuser');

      expect(result.totalRepos).toBe(0);
      expect(result.totalBytes).toBe(0);
      expect(result.languages).toEqual([]);
    });

    it('should handle repositories with no language data', async () => {
      getRepos.mockResolvedValue(mockGitHubRepoResponse());
      axios.get.mockResolvedValue({ data: {} }); // No languages

      const result = await LanguageService.getLanguageBreakDown('testuser');

      expect(result.totalBytes).toBe(0);
      expect(result.languages).toEqual([]);
    });

    it('should handle mixed repositories with and without languages', async () => {
      const mockRepos = mockGitHubRepoResponse();
      getRepos.mockResolvedValue(mockRepos);

      // First repo has languages, second doesn't
      axios.get
        .mockResolvedValueOnce({ data: mockLanguageResponse() })
        .mockResolvedValueOnce({ data: {} });

      const result = await LanguageService.getLanguageBreakDown('testuser');

      // Should still aggregate correctly
      expect(result.totalRepos).toBe(2);
      expect(result.languages.length).toBeGreaterThan(0);
    });
  });

  describe('Language calculations', () => {
    it('should have percentage field for each language', async () => {
      getRepos.mockResolvedValue(mockGitHubRepoResponse());
      axios.get.mockResolvedValue({ data: mockLanguageResponse() });

      const result = await LanguageService.getLanguageBreakDown('testuser');

      result.languages.forEach(lang => {
        expect(lang).toHaveProperty('language');
        expect(lang).toHaveProperty('bytes');
        expect(lang).toHaveProperty('percentage');
        expect(typeof lang.percentage).toBe('number');
        expect(lang.percentage).toBeGreaterThanOrEqual(0);
        expect(lang.percentage).toBeLessThanOrEqual(100);
      });
    });
  });
});
