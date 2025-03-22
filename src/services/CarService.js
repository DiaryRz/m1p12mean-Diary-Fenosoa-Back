const Car = require("../models/Cars");

const CarService = {
  async createCar(carData) {
    try {
      const car = new Car(carData);
      return await car.save();
    } catch (error) {
      throw error;
    }
  },

  async getAllCars() {
    try {
      return await Car.find().populate("category_id").populate("user_id");
    } catch (error) {
      throw error;
    }
  },

  async getCarById(id) {
    try {
      return await Car.findById(id).populate("category_id").populate("user_id");
    } catch (error) {
      throw error;
    }
  },

  async updateCar(id, carData) {
    try {
      return await Car.findByIdAndUpdate(id, carData, { new: true });
    } catch (error) {
      throw error;
    }
  },

  async deleteCar(id) {
    try {
      return await Car.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = CarService;
