const express = require('express');
const { verifyToken } = require('../services/AuthService');
const ServiceController = require("../controllers/ServiceController")

const router = express.Router();

router.post('/', verifyToken, ServiceController.createService);
router.get('/', verifyToken, ServiceController.getAllService);
router.get('/:id', verifyToken, ServiceController.getServiceById);

module.exports = router;