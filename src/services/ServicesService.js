const Services = require("../models/Services");
const mongoose = require("../connexion/db");

class ServicesService {
  static async addService(ServiceData) {
    try {
      const service = new Services(ServiceData);
      return await service.save();
    } catch (error) {
      console.log(`Couldn't add service`, error);
      throw error;
    }
  }

  static async getAllServices() {
    try {
      const services = await Services.find();
      return services;
    } catch (error) {
      console.log(`Couldn't list service`, error);
      throw error;
    }
  }
}

module.exports = ServicesService;
