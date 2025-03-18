const express = require("express");
const RoleController = require("../controllers/RoleController");
const { verifyToken } = require("../services/AuthService");

const router = express.Router();

const roleController = new RoleController();

router.post("/add", verifyToken, roleController.addRole);
router.put("/:id", verifyToken, roleController.editRole);
router.get("/", verifyToken, roleController.getRole);

module.exports = router;
