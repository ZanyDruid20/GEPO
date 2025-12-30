const languageService = require('../services/language_service');

class LanguagesController {
  async getBreakdown(req, res) {
    try {
      const username = req.params.username;
      const token = req.session?.githubAccessToken;
      const result = await languageService.getLanguageBreakDown(username, token);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching language breakdown', error: error.message });
    }
  }
}

module.exports = new LanguagesController();