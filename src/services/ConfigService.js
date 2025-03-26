const Config = require('../models/dtos/appointementsConfig');

class ConfigService {
  async create(configData) {
    try {
      // Chercher une configuration existante
      const existingConfig = await Config.findOne();
      
      if (existingConfig) {
        // Si une configuration existe, la mettre à jour
        return await Config.findByIdAndUpdate(
          existingConfig._id,
          configData,
          { new: true }
        );
      } else {
        // Si aucune configuration n'existe, en créer une nouvelle
        const config = new Config(configData);
        return await config.save();
      }
    } catch (error) {
      throw error;
    }
  }
  
  async getLatest() {
    try {
      return await Config.findOne().sort({ _id: -1 }).limit(1);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ConfigService();
