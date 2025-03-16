const express = require('express');
const CarCategoryController = require('../controllers/CarCategoryController');
const { verifyToken } = require('../services/AuthService');

const router = express.Router();

const carCategoryController = new CarCategoryController();

router.post('/', verifyToken, carCategoryController.createCarCategory);
router.get('/', verifyToken, carCategoryController.getAllCarCategory);
router.get('/:id', verifyToken, carCategoryController.getCarCategoryById);

module.exports = router;