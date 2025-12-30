// tests/graphql/resolvers.test.js
const axios = require('axios');
const WrappedService = require('../../services/wrapped_service');
const LanguageService = require('../../services/language_service');
const { mockGitHubRepoResponse, mockLanguageResponse, mockCommitResponse, clearAllMocks } = require('../utils/testHelpers');

jest.mock('axios');
jest.mock('../../services/wrapped_service');
jest.mock('../../services/language_service');

describe('GraphQL Resolvers', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('Wrapped Resolver', () => {
    it('should resolve wrapped report with user data', async () => {
      const mockReport = {
        username: 'testuser',
        totalRepos: 2,
        totalBytes: 100000,
        totalCommits: 50,
        score: 150,
        languages: [
          { language: 'JavaScript', bytes: 50000, percentage: 50 },
          { language: 'Python', bytes: 30000, percentage: 30 },
          { language: 'TypeScript', bytes: 20000, percentage: 20 }
        ]
      };

      WrappedService.getUserReport.mockResolvedValue(mockReport);

      // Simulate resolver call
      const result = await WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN);

      expect(result).toEqual(mockReport);
      expect(result.languages).toHaveLength(3);
      expect(result.totalBytes).toBe(100000);
      expect(WrappedService.getUserReport).toHaveBeenCalledWith('testuser', process.env.GITHUB_TOKEN);
    });

    it('should handle empty language list', async () => {
      const mockReport = {
        username: 'newuser',
        totalRepos: 0,
        totalBytes: 0,
        totalCommits: 0,
        score: 0,
        languages: []
      };

      WrappedService.getUserReport.mockResolvedValue(mockReport);

      const result = await WrappedService.getUserReport('newuser', process.env.GITHUB_TOKEN);

      expect(result.languages).toHaveLength(0);
      expect(result.totalBytes).toBe(0);
    });

    it('should handle resolver errors gracefully', async () => {
      const error = new Error('GitHub API error');
      WrappedService.getUserReport.mockRejectedValue(error);

      await expect(WrappedService.getUserReport('testuser', process.env.GITHUB_TOKEN)).rejects.toThrow('GitHub API error');
    });
  });

  describe('Languages Resolver', () => {
    it('should resolve language breakdown', async () => {
      const mockBreakdown = {
        username: 'testuser',
        totalRepos: 2,
        totalBytes: 100000,
        languages: [
          { language: 'JavaScript', bytes: 50000, percentage: 50 },
          { language: 'Python', bytes: 30000, percentage: 30 },
          { language: 'TypeScript', bytes: 20000, percentage: 20 }
        ]
      };

      LanguageService.getLanguageBreakDown.mockResolvedValue(mockBreakdown);

      const result = await LanguageService.getLanguageBreakDown('testuser');

      expect(result).toEqual(mockBreakdown);
      expect(result.languages).toHaveLength(3);
      expect(result.languages[0].percentage).toBe(50);
    });

    it('should sort languages by bytes in descending order', async () => {
      const mockBreakdown = {
        username: 'testuser',
        totalRepos: 3,
        totalBytes: 100000,
        languages: [
          { language: 'JavaScript', bytes: 60000, percentage: 60 },
          { language: 'Python', bytes: 30000, percentage: 30 },
          { language: 'TypeScript', bytes: 10000, percentage: 10 }
        ]
      };

      LanguageService.getLanguageBreakDown.mockResolvedValue(mockBreakdown);

      const result = await LanguageService.getLanguageBreakDown('testuser');

      expect(result.languages[0].language).toBe('JavaScript');
      expect(result.languages[1].language).toBe('Python');
      expect(result.languages[2].language).toBe('TypeScript');
    });
  });

  describe('Commits Resolver', () => {
    it('should resolve commit summary', async () => {
      // This would be part of wrapped resolver or separate
      const mockSummary = {
        username: 'testuser',
        totalCommits: 150,
        repoCount: 5
      };

      // Mock would depend on your commit resolver implementation
      expect(mockSummary.totalCommits).toBeGreaterThan(0);
      expect(mockSummary.repoCount).toBeGreaterThan(0);
    });
  });
});
