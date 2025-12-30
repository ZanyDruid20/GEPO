// tests/routes/languages.test.js
const request = require('supertest');
const express = require('express');
const languagesRoutes = require('../../routes/languages');
const languagesController = require('../../controllers/languagesController');
const { ensureAuthenticated } = require('../../middleware/auth_middleware');

jest.mock('../../controllers/languagesController');
jest.mock('../../middleware/auth_middleware', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => {
    if (req.session?.userId) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  })
}));

describe('Languages Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.use((req, res, next) => {
      req.session = { userId: 'test-user', githubAccessToken: 'test-token' };
      next();
    });
    
    app.use('/api/languages', languagesRoutes);
  });

  describe('GET /api/languages/breakdown/:username', () => {
    it('should return language breakdown for authenticated user', async () => {
      const mockData = {
        username: 'testuser',
        totalRepos: 3,
        totalBytes: 100000,
        languages: [
          { language: 'JavaScript', bytes: 50000, percentage: 50 },
          { language: 'Python', bytes: 30000, percentage: 30 },
          { language: 'TypeScript', bytes: 20000, percentage: 20 }
        ]
      };

      languagesController.getBreakdown.mockImplementation((req, res) => {
        res.status(200).json(mockData);
      });

      const response = await request(app)
        .get('/api/languages/breakdown/testuser')
        .expect(200);

      expect(response.body).toEqual(mockData);
      expect(response.body.languages).toHaveLength(3);
    });

    it('should reject unauthenticated requests', async () => {
      const app2 = express();
      app2.use(express.json());
      
      app2.use((req, res, next) => {
        req.session = {};
        next();
      });
      
      app2.use('/api/languages', languagesRoutes);

      await request(app2)
        .get('/api/languages/breakdown/testuser')
        .expect(401);
    });

    it('should handle empty language list', async () => {
      const mockData = {
        username: 'newuser',
        totalRepos: 0,
        totalBytes: 0,
        languages: []
      };

      languagesController.getBreakdown.mockImplementation((req, res) => {
        res.status(200).json(mockData);
      });

      const response = await request(app)
        .get('/api/languages/breakdown/newuser')
        .expect(200);

      expect(response.body.languages).toHaveLength(0);
    });

    it('should return 500 on service error', async () => {
      languagesController.getBreakdown.mockImplementation((req, res) => {
        res.status(500).json({ 
          message: 'Error fetching language breakdown', 
          error: 'Service unavailable' 
        });
      });

      const response = await request(app)
        .get('/api/languages/breakdown/testuser')
        .expect(500);

      expect(response.body.message).toBe('Error fetching language breakdown');
    });

    it('should call controller with correct username parameter', async () => {
      languagesController.getBreakdown.mockImplementation((req, res) => {
        res.status(200).json({ username: req.params.username });
      });

      await request(app)
        .get('/api/languages/breakdown/myuser')
        .expect(200);

      expect(languagesController.getBreakdown).toHaveBeenCalled();
    });
  });
});
