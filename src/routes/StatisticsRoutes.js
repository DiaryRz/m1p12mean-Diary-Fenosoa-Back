const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/StatisticController");

// Route pour obtenir les statistiques par mois (avec filtres optionnels)
router.get("/appointments-by-month", statisticsController.getAppointmentsByMonth);

// Route pour obtenir les montants par mois
router.get("/amount-by-month", statisticsController.getAmountByMonth);

// Route pour obtenir le nombre de services par mois
router.get("/services-by-month", statisticsController.getNbServicesByMonth);

module.exports = router; 