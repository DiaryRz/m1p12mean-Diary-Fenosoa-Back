const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/AppointmentController");
const authService = require("../services/AuthService");
const verifyToken = authService.verifyToken;

router.get(
  "/available-slots",
  verifyToken,
  AppointmentController.getAvailableSlots,
);
router.post("/adddate", verifyToken, AppointmentController.addDateAppointment);
// router.get("/pending-with-date", verifyToken, AppointmentController.getPendingWithDate);

// Routes CRUD pour les rendez-vous
router.post("/", authService.verifyToken, AppointmentController.create);
router.get("/", authService.verifyToken, AppointmentController.getAll);
// router.get('/client/:id', authService.verifyToken, AppointmentController.getClientAppoitments);
router.get("/:id", authService.verifyToken, AppointmentController.getById);
router.put("/:id", authService.verifyToken, AppointmentController.update);
router.patch(
  "/:id/status",
  authService.verifyToken,
  AppointmentController.updateStatus,
);
router.delete("/:id", authService.verifyToken, AppointmentController.delete);

module.exports = router;
