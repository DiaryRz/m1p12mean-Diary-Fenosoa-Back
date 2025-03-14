const ServiceService = require('../services/ServiceService');

class ServiceController {
    async createService(req, res) {
        try {
            const service = await ServiceService.create(req.body);
            res.status(201).json(service);
        } catch (error) {
            res.status(500).json({ message: 'Error creating service', error: error.message });
        }
    }

    async getAllService(req, res) {
        try {
            const services = await ServiceService.getAll();
            res.json(services);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching services', error: error.message });
        }
    }

    async getServiceById(req, res) {
        try {
            const service = await ServiceService.getById(req.params.id);
            if (!service) {
                return res.status(204).json({ message: 'Service not found' });
            }
            res.json(service);
        } catch (error) {            
            res.status(500).json({ message: 'Error fetching service', error: error.message });
        }
    }
}

module.exports = new ServiceController();