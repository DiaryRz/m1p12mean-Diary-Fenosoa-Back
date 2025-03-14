const Service = require('../models/Services');

class ServiceService {
    async create(serviceData) {
        try {
            const service = new Service(serviceData);
            return await service.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await Service.find(); 
        } catch (error) {
            throw new Error('Error fetching services: ' + error.message);
        }
    }

    async getById(id) {
        try {
            return await Service.findById(id);
        } catch (error) {
            throw error;
        }
    }

}   

module.exports = new ServiceService();