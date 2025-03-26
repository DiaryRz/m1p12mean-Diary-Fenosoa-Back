const CarCategory = require("../models/CarCategory");

const CarCategoryService = {
  async createMany(carCategoryData) {
    try {
      return await CarCategory.insertMany(carCategoryData);
    } catch (error) {
      throw error;
    }
  },

  async create(carCategoryData) {
    try {
      const carCategory = new CarCategory(carCategoryData);
      return await carCategory.save();
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      return await CarCategory.find();
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      return await CarCategory.findById(id);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = CarCategoryService;
