// tests/routes/commits.test.js
const request = require('supertest');
const express = require('express');
const commitsRoutes = require('../../routes/commits');
const commitsController = require('../../controllers/commitsController');
const { ensureAuthenticated } = require('../../middleware/auth_middleware');

jest.mock('../../controllers/commitsController');
jest.mock('../../middleware/auth_middleware', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => {
    if (req.session?.userId) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  })
}));

describe('Commits Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.use((req, res, next) => {
      req.session = { userId: 'test-user', githubAccessToken: 'test-token' };
      next();
    });
    
    app.use('/api/commits', commitsRoutes);
  });

  describe('GET /api/commits/summary/:username', () => {
    it('should return commit summary for authenticated user', async () => {
      const mockData = {
        username: 'testuser',
        repoCount: 5,
        totalCommits: 150
      };

      commitsController.getSummary.mockImplementation((req, res) => {
        res.status(200).json(mockData);
      });

      const response = await request(app)
        .get('/api/commits/summary/testuser')
        .expect(200);

      expect(response.body).toEqual(mockData);
      expect(response.body.totalCommits).toBeGreaterThan(0);
    });

    it('should reject unauthenticated requests', async () => {
      const app2 = express();
      app2.use(express.json());
      
      app2.use((req, res, next) => {
        req.session = {};
        next();
      });
      
      app2.use('/api/commits', commitsRoutes);

      await request(app2)
        .get('/api/commits/summary/testuser')
        .expect(401);
    });

    it('should return zero commits for new user', async () => {
      const mockData = {
        username: 'newuser',
        repoCount: 0,
        totalCommits: 0
      };

      commitsController.getSummary.mockImplementation((req, res) => {
        res.status(200).json(mockData);
      });

      const response = await request(app)
        .get('/api/commits/summary/newuser')
        .expect(200);

      expect(response.body.totalCommits).toBe(0);
      expect(response.body.repoCount).toBe(0);
    });

    it('should handle service errors', async () => {
      commitsController.getSummary.mockImplementation((req, res) => {
        res.status(500).json({ 
          message: 'Error fetching commit summary', 
          error: 'GitHub API unavailable' 
        });
      });

      const response = await request(app)
        .get('/api/commits/summary/testuser')
        .expect(500);

      expect(response.body.message).toBe('Error fetching commit summary');
    });

    it('should pass username to controller', async () => {
      commitsController.getSummary.mockImplementation((req, res) => {
        res.status(200).json({ username: req.params.username });
      });

      await request(app)
        .get('/api/commits/summary/testuser123')
        .expect(200);

      expect(commitsController.getSummary).toHaveBeenCalled();
    });
  });
});
