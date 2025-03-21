const express = require("express");
const ServicesController = require("../controllers/ServicesController");
const { verifyToken } = require("../services/AuthService");

const serviceController = new ServicesController();

const router = express.Router();
router.post("/", verifyToken, serviceController.addService);
router.get("/", verifyToken, serviceController.getAllServices);

module.exports = router;
