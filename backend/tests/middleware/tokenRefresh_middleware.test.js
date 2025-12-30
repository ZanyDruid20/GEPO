// tests/middleware/tokenRefresh_middleware.test.js
const axios = require('axios');
const { refreshTokenIfNeeded } = require('../../middleware/tokenRefresh_middleware');

jest.mock('axios');

describe('Token Refresh Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      session: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() if no session token exists', async () => {
    await refreshTokenIfNeeded(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', async () => {
    req.session.githubAccessToken = 'valid-token';
    axios.get.mockResolvedValue({ status: 200 });

    await refreshTokenIfNeeded(req, res, next);

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.github.com/user',
      expect.objectContaining({
        headers: { Authorization: 'Bearer valid-token' }
      })
    );
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 if token is expired', async () => {
    req.session.githubAccessToken = 'expired-token';
    axios.get.mockRejectedValue({
      response: { status: 401 }
    });

    await refreshTokenIfNeeded(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token expired - please login again' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() on other API errors', async () => {
    req.session.githubAccessToken = 'some-token';
    axios.get.mockRejectedValue({
      response: { status: 500 }
    });

    await refreshTokenIfNeeded(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next() if no session property exists', async () => {
    req = {};
    await refreshTokenIfNeeded(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should handle network errors gracefully', async () => {
    req.session.githubAccessToken = 'some-token';
    axios.get.mockRejectedValue(new Error('Network error'));

    await refreshTokenIfNeeded(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
