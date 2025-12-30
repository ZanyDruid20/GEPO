const wrappedService = require('../services/wrapped_service');

// Wrapped Controller to call the service and return the response
class WrappedController {
  async getWrapped(req, res) {
    try {
      const username = req.params.username;
      const token = req.session?.githubAccessToken;
      const result = await wrappedService.getUserReport(username, token);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching wrapped data', error: error.message });
    }
  }
}

module.exports = new WrappedController();