const express = require('express');
const CarController = require('../controllers/CarController');
const { verifyToken } = require('../services/AuthService');

const router = express.Router();
const carController = new CarController();

// Routes CRUD
router.post('', verifyToken, carController.createCar.bind(carController));
router.get('', verifyToken, carController.getAllCars.bind(carController));
router.get('/:id', verifyToken, carController.getCarById.bind(carController));

module.exports = router;