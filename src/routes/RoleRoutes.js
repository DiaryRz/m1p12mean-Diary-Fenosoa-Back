const express = require('express');
const RoleController = require('../controllers/RoleController');

const router = express.Router();

roleController = new RoleController();

router.post('/add', roleController.addRole);
router.get('/all', roleController.getRole);

module.exports = router;
