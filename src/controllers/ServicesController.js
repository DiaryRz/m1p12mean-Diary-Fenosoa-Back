const serviceService = require("../services/ServicesService.js");

class ServicesController {
  async addService(req, res) {
    try {
      const service = await serviceService.addService(req.body);
      res.status(201).json(service);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error addding service", error: error.message });
    }
  }

  async getAllServices(req, res) {
    try {
      const services = await serviceService.getAllServices();
      res.json(services);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching services", error: error.message });
    }
  }
}

module.exports = ServicesController;
