const express = require('express');
const RoleController = require('../controllers/RoleController');
const { verifyToken } = require('../services/AuthService');

const router = express.Router();

roleController = new RoleController();

router.post('/add', verifyToken , roleController.addRole);
router.get('/all', verifyToken , roleController.getRole);

module.exports = router;
