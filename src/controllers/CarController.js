const CarService = require("../services/CarService");

class CarController {
  async createCar(req, res) {
    try {
      const car = await CarService.createCar(req.body);
      res.status(201).json(car);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllCars(req, res) {
    try {
      const cars = await CarService.getAllCars();
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getClientCars(req, res) {
    try {
      const cars = await CarService.getClientCars(req.params.id);
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  }

  async getCarById(req, res) {
    try {
      const car = await CarService.getCarById(req.params.id);
      if (!car) return res.status(404).json({ message: "Voiture non trouvée" });
      res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCar(req, res) {
    try {
      const car = await CarService.getCar(req.body);
      if (!car)
        return res
          .status(404)
          .json({ message: "Voiture non trouvée", success: false });
      res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  }

  async updateCar(req, res) {
    try {
      const car = await CarService.updateCar(req.params.id, req.body);
      if (!car) return res.status(404).json({ message: "Voiture non trouvée" });
      res.status(200).json(car);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCar(req, res) {
    try {
      const car = await CarService.deleteCar(req.params.id);
      if (!car) return res.status(404).json({ message: "Voiture non trouvée" });
      res.status(200).json({ message: "Voiture supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCarsByUserId(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false,
          message: "L'ID de l'utilisateur est requis" 
        });
      }

      const cars = await CarService.getCarByUserId(userId);
      
      if (!cars || cars.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: "Aucune voiture trouvée pour cet utilisateur" 
        });
      }

      res.status(200).json({
        success: true,
        data: cars,
        message: "Voitures récupérées avec succès"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }
}

module.exports = CarController;
