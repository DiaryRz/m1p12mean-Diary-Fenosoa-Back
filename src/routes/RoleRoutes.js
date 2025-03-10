const express = require("express");
const RoleController = require("../controllers/RoleController");

const router = express.Router();

const roleController = new RoleController();

router.post("/add", roleController.addRole);
router.get("/all", roleController.getAllRole);
router.get("/get", roleController.getRoleById);
router.patch("/edit", roleController.editRole);

module.exports = router;
