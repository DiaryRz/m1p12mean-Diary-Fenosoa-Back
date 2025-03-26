const serviceService = require("../services/ServiceService");

class ServiceController {
  async createService(req, res) {
    try {
      // Check if service  already exist;
      let service = await serviceService.getService({
        service_name: req.body.service_name,
      });
      if (service) {
        return res.status(409).json({ exist: true, service: service });
      }
      service = await serviceService.createService(req.body);
      return res.status(201).json({ success: true, service: service });
    } catch (error) {
      res.status(400).json({
        message: "Erreur lors de la création du service",
        error,
      });
    }
  }

  async getAllServices(req, res) {
    try {
      const services = await serviceService.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Erreur dans le controller:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des services",
        error: error.message,
      });
    }
  }

  async getServiceById(req, res) {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service non trouvé" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du service",
        error,
      });
    }
  }

  async updateService(req, res) {
    try {
      const service = await serviceService.updateService(
        req.params.id,
        req.body,
      );
      if (!service) {
        return res.status(404).json({ message: "Service non trouvé" });
      }
      res.json(service);
    } catch (error) {
      res.status(400).json({
        message: "Erreur lors de la mise à jour du service",
        error,
      });
    }
  }

  async deleteService(req, res) {
    try {
      const service = await serviceService.deleteService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service non trouvé" });
      }
      res.json({ message: "Service supprimé avec succès" });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la suppression du service",
        error,
      });
    }
  }
}

module.exports = ServiceController;
