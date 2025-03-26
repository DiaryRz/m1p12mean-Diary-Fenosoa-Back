const carCategoryService = require("../services/CarCategoryService");

class CarCategoryController {
  async createCarCategory(req, res) {
    try {
      const carCategory = await carCategoryService.create(req.body);
      res.status(201).json(carCategory);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating car category", error: error.message });
    }
  }

  async getAllCarCategory(req, res) {
    try {
      const carCategories = await carCategoryService.getAll();
      res.json(carCategories);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching car categories",
        error: error.message,
      });
    }
  }

  async getCarCategoryById(req, res) {
    try {
      const carCategory = await carCategoryService.getById(req.params.id);
      if (!carCategory) {
        return res.status(204).json({ message: "Car category not found" });
      }
      res.json(carCategory);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching car category", error: error.message });
    }
  }
}

module.exports = CarCategoryController;
