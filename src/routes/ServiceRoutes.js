const express = require('express');
const ServiceController = require('../controllers/ServiceController');
const { verifyToken } = require('../services/AuthService');

const router = express.Router();
const serviceController = new ServiceController();

// Routes CRUD avec middleware express-async-handler
router.post('/', verifyToken, serviceController.createService);
router.get('/', verifyToken, serviceController.getAllServices);
router.get('/:id', verifyToken, serviceController.getServiceById);
router.put('/:id', verifyToken, serviceController.updateService);
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router; 