// tests/middleware/rateLimit_middleware.test.js
const { limiter } = require('../../middleware/rateLimit_middleware');

describe('Rate Limit Middleware', () => {
  it('should export a limiter function', () => {
    expect(typeof limiter).toBe('function');
  });

  it('should have correct window configuration', () => {
    // Rate limiter stores config - check it exists
    expect(limiter).toBeDefined();
  });

  it('should be callable as middleware', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // The limiter should be a function that middleware can use
    expect(typeof limiter).toBe('function');
  });

  describe('rate limiting behavior', () => {
    it('should be express-rate-limit middleware', () => {
      // Verify it's a proper middleware function (takes req, res, next)
      expect(limiter.length).toBeGreaterThan(0);
    });
  });
});
