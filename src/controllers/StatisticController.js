const statisticsService = require("../services/stat/statisticService");

class StatisticsController {
    async getAppointmentsByMonth(req, res) {
        try {
            const { year } = req.query;
            console.log("Année reçue:", year); // Pour le débogage
            const statistics = await statisticsService.getAppointmentsByMonth(
                year ? Number(year) : undefined
            );
            console.log("Statistiques envoyées:", statistics); // Pour le débogage
            res.status(200).json(statistics);
        } catch (error) {
            console.error("Erreur dans le contrôleur:", error); // Pour le débogage
            res.status(500).json({ message: error.message });
        }
    }

    async getAmountByMonth(req, res) {
        try {
            const { year } = req.query;
            console.log("Année reçue pour les montants:", year);
            const amounts = await statisticsService.getAmountByMonth(
                year ? Number(year) : undefined
            );
            console.log("Montants envoyés:", amounts);
            res.status(200).json(amounts);
        } catch (error) {
            console.error("Erreur dans le contrôleur:", error);
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = new StatisticsController(); 