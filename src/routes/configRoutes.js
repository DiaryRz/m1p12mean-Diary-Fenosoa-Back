const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { verifyToken } = require("../services/AuthService");

// Création d'une nouvelle configuration
router.post('/', verifyToken, configController.create);

// Récupération de la dernière configuration
router.get('/', verifyToken, configController.getLatest);

module.exports = router; 