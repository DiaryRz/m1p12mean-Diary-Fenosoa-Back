const carService = require("../services/CarService.");

class CarCategoryController {
  async createCar(req, res) {
    try {
      const carCategory = await carService.create(req.body);
      res.status(201).json(carCategory);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating car", error: error.message });
    }
  }

  async getAllCar(req, res) {
    try {
      const carCategories = await carService.getAll();
      res.json(carCategories);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching car", error: error.message });
    }
  }

  async getCarByUserId(req, res) {
    try {
      const car = await carService.getByUserId(req.body.id);
      if (!car) {
        return res.status(204).json({ message: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error car category", error: error.message });
    }
  }
  async getCarById(req, res) {
    try {
      const car = await carService.getById(req.params.id);
      if (!car) {
        return res.status(204).json({ message: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error car category", error: error.message });
    }
  }
}

module.exports = CarCategoryController;

