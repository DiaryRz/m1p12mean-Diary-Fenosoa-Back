const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

const { verifyToken } = require('../services/AuthService');

// Route pour obtenir les créneaux disponibles
router.get('/available-slots', verifyToken, AppointmentController.getAvailableSlots);

// Routes CRUD pour les rendez-vous
router.post('/', verifyToken, AppointmentController.create);
router.get('/', verifyToken, AppointmentController.getAll);
router.get('/:id', verifyToken, AppointmentController.getById);
router.put('/:id', verifyToken, AppointmentController.update);
router.patch('/:id/status', verifyToken, AppointmentController.updateStatus);
router.delete('/:id', verifyToken, AppointmentController.delete);

module.exports = router; 