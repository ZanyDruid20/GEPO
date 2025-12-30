// tests/middleware/auth_middleware.test.js
const { ensureAuthenticated } = require('../../middleware/auth_middleware');

describe('Auth Middleware', () => {
  describe('ensureAuthenticated', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        isAuthenticated: jest.fn()
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should call next() if user is authenticated', () => {
      req.isAuthenticated.mockReturnValue(true);

      ensureAuthenticated(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', () => {
      req.isAuthenticated.mockReturnValue(false);

      ensureAuthenticated(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle undefined isAuthenticated gracefully', () => {
      req.isAuthenticated = undefined;

      ensureAuthenticated(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should not proceed to next if user is not authenticated', () => {
      req.isAuthenticated.mockReturnValue(false);

      ensureAuthenticated(req, res, next);

      expect(next).not.toHaveBeenCalled();
    });
  });
});
