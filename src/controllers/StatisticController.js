const statisticsService = require("../services/stat/statisticService");

class StatisticsController {
    async getAppointmentsByMonth(req, res) {
        try {
            const { year } = req.query;
            const statistics = await statisticsService.getAppointmentsByMonth(
                year ? Number(year) : undefined
            );
            res.status(200).json(statistics);
        } catch (error) {
            console.error("Erreur dans le contrôleur:", error); // Pour le débogage
            res.status(500).json({ message: error.message });
        }
    }

    async getAmountByMonth(req, res) {
        try {
            const { year } = req.query;
            const amounts = await statisticsService.getAmountByMonth(
                year ? Number(year) : undefined
            );
            res.status(200).json(amounts);
        } catch (error) {
            console.error("Erreur dans le contrôleur:", error);
            res.status(500).json({ message: error.message });
        }
    }

    async getNbServicesByMonth(req, res) {
        try {
            const { year } = req.query;
            const services = await statisticsService.getNbServicesByMonth(
                year ? Number(year) : undefined
            );
            res.status(200).json(services);
        } catch (error) {
            console.error("Erreur dans le contrôleur:", error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new StatisticsController(); 