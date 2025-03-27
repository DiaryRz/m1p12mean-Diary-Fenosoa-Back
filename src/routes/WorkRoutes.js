const express = require('express');
const router = express.Router();
const WorkController = require('../controllers/WorkController');
const { verifyToken } = require('../services/AuthService');

// Routes CRUD
router.post('/', WorkController.create);
router.get('/', verifyToken, WorkController.getAll);
router.get('/:id', verifyToken, WorkController.getById);
router.put('/:id', verifyToken, WorkController.update);
router.delete('/:id', verifyToken, WorkController.delete);

// Route supplémentaire pour les travaux par employé
router.get('/employee/:employeeId', verifyToken, WorkController.getByEmployee);

module.exports = router; 