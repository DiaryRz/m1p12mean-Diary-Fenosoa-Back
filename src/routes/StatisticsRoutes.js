const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/StatisticController");

// Route pour obtenir les statistiques par mois (avec filtres optionnels)
router.get("/appointments-by-month", statisticsController.getAppointmentsByMonth);

// Route pour obtenir les montants par mois
router.get("/amount-by-month", statisticsController.getAmountByMonth);


module.exports = router; 