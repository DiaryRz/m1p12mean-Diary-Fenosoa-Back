const configService = require('../services/ConfigService');

class ConfigController {
  async create(req, res) {
    try {
      const config = await configService.create(req.body);
      res.status(201).json(config);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getLatest(req, res) {
    try {
      const config = await configService.getLatest();
      if (!config) {
        return res.status(404).json({ message: 'Aucune configuration trouvée' });
      }
      res.status(200).json(config);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ConfigController(); 