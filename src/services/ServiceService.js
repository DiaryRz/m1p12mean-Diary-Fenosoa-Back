const Service = require("../models/Services");

const serviceService = {
  async createService(serviceData) {
    try {
      const service = new Service(serviceData);
      return await service.save();
    } catch (error) {
      throw error;
    }
  },

  async getAllServices() {
    try {
      const services = await Service.find();
      return services;
    } catch (error) {
      console.error("Erreur dans le service:", error);
      throw error;
    }
  },

  async getServiceById(id) {
    try {
      return await Service.findById(id).populate();
    } catch (error) {
      throw error;
    }
  },

  async getService(data) {
    try {
      return await Service.findOne(data).populate();
    } catch (error) {
      throw error;
    }
  },

  async updateService(id, serviceData) {
    try {
      return await Service.findByIdAndUpdate(id, serviceData, { new: true });
    } catch (error) {
      throw error;
    }
  },

  async deleteService(id) {
    try {
      return await Service.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = serviceService;
