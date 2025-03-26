const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/AppointmentController");
const authService = require("../services/AuthService");
const verifyToken = authService.verifyToken;
const PaymentController = require("../controllers/PaymentController");

router.get('/available-slots', verifyToken, AppointmentController.getAvailableSlots);
router.post('/adddate', verifyToken, AppointmentController.addDateAppointment);
router.get("/pending-with-date", verifyToken, AppointmentController.getPendingWithDate);
router.post("/confirm", verifyToken ,  AppointmentController.confirmAppointment);
router.get("/date/between" , verifyToken ,AppointmentController.getAppointmentsCountBetweenDates);

router.get("/date/with_appointments", verifyToken , AppointmentController.getAppointmentsInWhichDay);

router.get("/dates/occupees", verifyToken, AppointmentController.getDateCompletementOccupe);

router.get("/:appointmentId/payments", PaymentController.getPaymentsByAppointment);

router.get("/user/:userId", AppointmentController.getAppointmentsByUser);

// Routes CRUD pour les rendez-vous
router.post("/", verifyToken, AppointmentController.create);
router.get("/", verifyToken, AppointmentController.getAll);
// router.get('/client/:id', verifyToken, AppointmentController.getClientAppoitments);
router.get("/byid", AppointmentController.getById);
router.put("/:id", verifyToken, AppointmentController.update);
router.patch(
  "/:id/status",
  verifyToken,
  AppointmentController.updateStatus,
);
router.delete("/:id", verifyToken, AppointmentController.delete);

module.exports = router;
