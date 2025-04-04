const AppointmentsByMonth = require("../../models/views/statistics");
const AmountByMonth = require("../../models/views/amount");
const NbServicesByMonth = require("../../models/views/nb_appointment");

class StatisticsService {
  async getAppointmentsByMonth(year) {
    try {
      const query = {};
      if (year) {
        query["_id.year"] = Number(year);
      }

      const statistics = await AppointmentsByMonth.find(query);

      // Créer un tableau pour tous les mois de l'année
      const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

      // Créer un objet pour stocker les données existantes
      const existingData = {};
      statistics.forEach((stat) => {
        existingData[stat._id.month] = stat.total_confirmed_or_paid;
      });

      // Créer le résultat final avec tous les mois
      const result = allMonths.map((month) => ({
        _id: {
          year: Number(year),
          month: month,
        },
        total_confirmed_or_paid: existingData[month] || 0,
      }));

      return result;
    } catch (error) {
      console.error("Erreur dans le service:", error);
      throw new Error(
        `Erreur lors de la récupération des statistiques: ${error.message}`,
      );
    }
  }

  async getAmountByMonth(year) {
    try {
      const query = {};
      if (year) {
        query["_id.year"] = Number(year);
      }

      const statistics = await AmountByMonth.find(query);

      // Créer un tableau pour tous les mois de l'année
      const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

      // Créer un objet pour stocker les données existantes
      const existingData = {};
      statistics.forEach((stat) => {
        existingData[stat._id.month] = stat.total_payed;
      });

      // Créer le résultat final avec tous les mois
      const result = allMonths.map((month) => ({
        _id: {
          year: Number(year),
          month: month,
        },
        total_payed: existingData[month] || 0,
      }));

      return result;
    } catch (error) {
      console.error("Erreur dans le service:", error);
      throw new Error(
        `Erreur lors de la récupération des montants: ${error.message}`,
      );
    }
  }

  async getNbServicesByMonth(year, month) {
    try {
      const query = {};
      if (year) {
        query["_id.year"] = Number(year);
      }
      if (month) {
        query["_id.month"] = Number(month);
      }

      const statistics = await NbServicesByMonth.find(query);

      // Grouper les résultats par service
      const result = statistics.map((stat) => ({
        _id: {
          year: stat._id.year,
          month: stat._id.month,
          service: stat._id.service,
        },
        total_services_taken: stat.total_services_taken,
      }));

      return result;
    } catch (error) {
      console.error("Erreur dans le service:", error);
      throw new Error(
        `Erreur lors de la récupération des services: ${error.message}`,
      );
    }
  }
}

module.exports = new StatisticsService();

