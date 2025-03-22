const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

// Routes CRUD pour les rendez-vous
router.post('/', AppointmentController.create);
router.get('/', AppointmentController.getAll);
router.get('/:id', AppointmentController.getById);
router.put('/:id', AppointmentController.update);
router.patch('/:id/status', AppointmentController.updateStatus);
router.delete('/:id', AppointmentController.delete);

module.exports = router; 