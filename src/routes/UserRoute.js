const express = require("express");
const UserController = require("../controllers/UserController");
const { verifyToken } = require("../services/AuthService");

const router = express.Router();
const userController = new UserController();

router.get("/employee", verifyToken, userController.getAllEmployee);
router.get("/manager", verifyToken, userController.getAllManager);
router.get("/client", verifyToken, userController.getAllUsers);
router.get("/mecanicien", verifyToken, userController.getAllMecanic);

router.put("/fire/:id", verifyToken, userController.fireUser);

router.post("/", verifyToken, userController.createUser);
router.get("/", verifyToken, userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);

module.exports = router;
