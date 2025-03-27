const express = require("express");
const CarController = require("../controllers/CarController");
const { verifyToken } = require("../services/AuthService");

const router = express.Router();
const carController = new CarController();

// Route pour obtenir les voitures d'un utilisateur
router.get("/user/:userId", carController.getCarsByUserId.bind(carController));

// Routes CRUD
router.post("", verifyToken, carController.createCar.bind(carController));
router.post("/plate", verifyToken, carController.getCar.bind(carController));
router.get("", verifyToken, carController.getAllCars.bind(carController));
router.get("/:id", verifyToken, carController.getCarById.bind(carController));
router.get(
  "/client/:id",
  verifyToken,
  carController.getClientCars.bind(carController),
);

module.exports = router;
