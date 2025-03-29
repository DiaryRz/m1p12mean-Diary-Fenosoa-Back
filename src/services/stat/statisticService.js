const AppointmentsByMonth = require("../../models/views/statistics");
const AmountByMonth = require("../../models/views/amount");

class StatisticsService {
    async getAppointmentsByMonth(year) {
        try {
            console.log("Année reçue dans le service:", year);

            const query = {};
            if (year) {
                query['_id.year'] = Number(year);
            }

            const statistics = await AppointmentsByMonth.find(query);
            
            // Créer un tableau pour tous les mois de l'année
            const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
            
            // Créer un objet pour stocker les données existantes
            const existingData = {};
            statistics.forEach(stat => {
                existingData[stat._id.month] = stat.total_confirmed_or_paid;
            });

            // Créer le résultat final avec tous les mois
            const result = allMonths.map(month => ({
                _id: {
                    year: Number(year),
                    month: month
                },
                total_confirmed_or_paid: existingData[month] || 0
            }));

            console.log("Résultats finaux:", JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            console.error("Erreur dans le service:", error);
            throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
        }
    }

    async getAmountByMonth(year) {
        try {
            console.log("Année reçue dans le service:", year);

            const query = {};
            if (year) {
                query['_id.year'] = Number(year);
            }

            const statistics = await AmountByMonth.find(query);
            
            // Créer un tableau pour tous les mois de l'année
            const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
            
            // Créer un objet pour stocker les données existantes
            const existingData = {};
            statistics.forEach(stat => {
                existingData[stat._id.month] = stat.total_payed;
            });

            // Créer le résultat final avec tous les mois
            const result = allMonths.map(month => ({
                _id: {
                    year: Number(year),
                    month: month
                },
                total_payed: existingData[month] || 0
            }));

            console.log("Résultats finaux:", JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            console.error("Erreur dans le service:", error);
            throw new Error(`Erreur lors de la récupération des montants: ${error.message}`);
        }
    }

}

module.exports = new StatisticsService();