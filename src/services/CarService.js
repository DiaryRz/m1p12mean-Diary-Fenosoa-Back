const Car = require("../models/Car");

class CarService {
  static async create(carData) {
    try {
      const car = new Car(carData);
      return await car.save();
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      return await Car.find().populate("category_id");
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      return await Car.findById(id).populate("category_id");
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(user_id) {
    try {
      return await Car.find({ user_id: user_id }).populate("category_id");
    } catch (error) {
      throw error;
    }
  }

  static async update(id, carData) {
    try {
      return await Car.findByIdAndUpdate(id, carData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await Car.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CarService;

