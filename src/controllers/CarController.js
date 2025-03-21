const CarService = require("../services/CarService");

class CarController {
    constructor() {
        this.carService = new CarService();
    }

    async createCar(req, res) {
        try {
            const car = await this.carService.createCar(req.body);
            res.status(201).json(car);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllCars(req, res) {
        try {
            const cars = await this.carService.getAllCars();
            res.status(200).json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCarById(req, res) {
        try {
            const car = await this.carService.getCarById(req.params.id);
            if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
            res.status(200).json(car);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCar(req, res) {
        try {
            const car = await this.carService.updateCar(req.params.id, req.body);
            if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
            res.status(200).json(car);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCar(req, res) {
        try {
            const car = await this.carService.deleteCar(req.params.id);
            if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
            res.status(200).json({ message: 'Voiture supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CarController;

