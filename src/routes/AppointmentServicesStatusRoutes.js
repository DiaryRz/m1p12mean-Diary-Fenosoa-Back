const express = require('express');
const router = express.Router();
const AppointmentServicesStatusController = require('../controllers/AppointmentServicesStatusController');
const { verifyToken } = require('../services/AuthService');

// Routes pour la vue
router.get('/all',  AppointmentServicesStatusController.getAll);
router.get('/user/:userId', verifyToken, AppointmentServicesStatusController.getByUserId);
router.get('/status/:status', verifyToken, AppointmentServicesStatusController.getByStatus);
router.get('/date-range', verifyToken, AppointmentServicesStatusController.getByDateRange);
router.get('/appointment/:appointmentId', AppointmentServicesStatusController.getByAppointmentId);

module.exports = router; 