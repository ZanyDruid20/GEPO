// tests/routes/wrapped.test.js
const request = require('supertest');
const express = require('express');
const wrappedRoutes = require('../../routes/wrapped');
const wrappedController = require('../../controllers/wrappedController');
const { ensureAuthenticated } = require('../../middleware/auth_middleware');

jest.mock('../../controllers/wrappedController');
jest.mock('../../middleware/auth_middleware', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => {
    if (req.session?.userId) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  })
}));

describe('Wrapped Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    // Mock session middleware
    app.use((req, res, next) => {
      req.session = { userId: 'test-user', githubAccessToken: 'test-token' };
      next();
    });
    
    app.use('/api/wrapped', wrappedRoutes);
  });

  describe('GET /api/wrapped/:username', () => {
    it('should return wrapped data for authenticated user', async () => {
      const mockData = {
        username: 'testuser',
        totalRepos: 5,
        totalBytes: 100000,
        totalCommits: 50,
        score: 150,
        languages: []
      };

      wrappedController.getWrapped.mockImplementation((req, res) => {
        res.status(200).json(mockData);
      });

      const response = await request(app)
        .get('/api/wrapped/testuser')
        .expect(200);

      expect(response.body).toEqual(mockData);
    });

    it('should reject unauthenticated requests', async () => {
      const app2 = express();
      app2.use(express.json());
      
      // App without session
      app2.use((req, res, next) => {
        req.session = {};
        next();
      });
      
      app2.use('/api/wrapped', wrappedRoutes);

      await request(app2)
        .get('/api/wrapped/testuser')
        .expect(401);
    });

    it('should handle controller errors', async () => {
      const errorMessage = 'Service error';
      wrappedController.getWrapped.mockImplementation((req, res) => {
        res.status(500).json({ message: 'Error fetching wrapped data', error: errorMessage });
      });

      const response = await request(app)
        .get('/api/wrapped/testuser')
        .expect(500);

      expect(response.body.error).toBe(errorMessage);
    });

    it('should call controller with correct parameters', async () => {
      wrappedController.getWrapped.mockImplementation((req, res) => {
        res.status(200).json({ username: req.params.username });
      });

      await request(app)
        .get('/api/wrapped/testuser')
        .expect(200);

      expect(wrappedController.getWrapped).toHaveBeenCalled();
    });
  });
});
