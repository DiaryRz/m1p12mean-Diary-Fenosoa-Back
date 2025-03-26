const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { verifyToken } = require('../services/AuthService');

// Route pour effectuer un paiement
router.post('/moitie', verifyToken, PaymentController.pay);
router.post('/total', verifyToken, PaymentController.paytotal);

module.exports = router; 