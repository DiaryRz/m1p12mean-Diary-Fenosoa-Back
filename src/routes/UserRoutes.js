const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();

const userController = new UserController();

router.post("/add", userController.addUser);
router.get("/all", userController.getAllUser);
router.get("/get", userController.getUserById);
router.delete("/delete", userController.deleteUser);

module.exports = router;
