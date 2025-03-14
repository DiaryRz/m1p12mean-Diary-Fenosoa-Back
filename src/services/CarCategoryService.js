const CarCategory = require('../models/CarCategory');

class CarCategoryService {
    async create(carCategoryData) {
        try {
            const carCategory = new CarCategory(carCategoryData);
            return await carCategory.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await CarCategory.find().populate('car_category');
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            return await CarCategory.findById(id).populate('car_category');
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new CarCategoryService();