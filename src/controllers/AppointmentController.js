const AppointmentService = require("../services/AppointmentService");

class AppointmentController {
  // Créer un nouveau rendez-vous
  async create(req, res) {
    try {
      const appointment = await AppointmentService.create(req.body);
      res.status(201).json({
        success: true,
        data: appointment,
        message: "Rendez-vous créé avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Récupérer tous les rendez-vous
  async getAll(req, res) {
    try {
      const appointmentService = new AppointmentService();
      const appointments = await appointmentService.getAll();
      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCond(req, res) {
    try {
      const appointmentService = new AppointmentService();
      console.log(req.body.cond);
      const appointments = await appointmentService.getCond(req.body.cond);
      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Récupérer un rendez-vous par son ID
  async getById(req, res) {
    try {
      const id = req.query.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "L'ID du rendez-vous est requis",
        });
      }

      const appointmentService = new AppointmentService();
      const appointment = await appointmentService.getById(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Rendez-vous non trouvé",
        });
      }

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Mettre à jour un rendez-vous
  async update(req, res) {
    try {
      const appointment = await AppointmentService.update(
        req.params.id,
        req.body,
      );
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Rendez-vous non trouvé",
        });
      }
      res.status(200).json({
        success: true,
        data: appointment,
        message: "Rendez-vous mis à jour avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Mettre à jour le statut d'un rendez-vous
  async updateStatus(req, res) {
    try {
      const appointment = await AppointmentService.updateStatus(
        req.params.id,
        req.body.status,
      );
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Rendez-vous non trouvé",
        });
      }
      res.status(200).json({
        success: true,
        data: appointment,
        message: "Statut du rendez-vous mis à jour avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Supprimer un rendez-vous
  async delete(req, res) {
    try {
      const appointment = await AppointmentService.delete(req.params.id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "",
        });
      }
      res.status(200).json({
        success: true,
        message: "Rendez-vous supprimé avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Récupérer les créneaux disponibles entre deux dates
  async getAvailableSlots(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Les dates de début et de fin sont requises",
        });
      }

      const appointmentService = new AppointmentService();
      const availableSlots = await appointmentService.getAvailableSlots(
        startDate,
        endDate,
      );

      res.status(200).json({
        success: true,
        data: availableSlots,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addDateAppointment(req, res) {
    try {
      const { date_appointment, id_appointment } = req.body;

      const appointmentService = new AppointmentService();
      await appointmentService.addDate_appointment(
        date_appointment,
        id_appointment,
      );

      res.status(200).json({
        success: true,
        message: "Date du rendez-vous mise à jour avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async confirmAppointment(req, res) {
    try {
      const { id_appointment } = req.body;
      const appointmentService = new AppointmentService();
      await appointmentService.confirmAppointment(id_appointment);

      res.status(200).json({
        success: true,
        message: "Rendez-vous confirmé avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPendingWithDate(req, res) {
    try {
      const appointmentService = new AppointmentService();
      const appointments =
        await appointmentService.getPendingAppointmentsWithDate();

      res.status(200).json({
        success: true,
        data: appointments,
        message: "Rendez-vous en attente récupérés avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAppointmentsCountBetweenDates(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Les dates sont requises",
        });
      }

      const appointmentService = new AppointmentService();
      const appointments =
        await appointmentService.getAppointmentsCountBeforeHourBetweenDates(
          startDate,
          endDate,
        );

      res.status(200).json({
        success: true,
        data: appointments,
        message: "Statistiques des rendez-vous récupérées avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAppointmentsInWhichDay(req, res) {
    try {
      const { hour, startDate, endDate } = req.query;

      if (!hour || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "L'heure et les dates sont requises",
        });
      }

      const appointmentService = new AppointmentService();
      const appointments = await appointmentService.getAppointmentsInWhichDay(
        parseInt(hour),
        startDate,
        endDate,
      );

      res.status(200).json({
        success: true,
        data: appointments,
        message: "Statistiques des rendez-vous récupérées avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getDateCompletementOccupe(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Les dates de début et de fin sont requises",
        });
      }

      const appointmentService = new AppointmentService();
      const datesOccupees = await appointmentService.getDateCompletementOccupe(
        startDate,
        endDate,
      );

      res.status(200).json({
        success: true,
        data: datesOccupees,
        message: "Dates complètement occupées récupérées avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAppointmentsByUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "L'ID de l'utilisateur est requis",
        });
      }

      const appointmentService = new AppointmentService();
      const appointments =
        await appointmentService.getAppointmentsByUserId(userId);

      res.status(200).json({
        success: true,
        data: appointments,
        message: "Rendez-vous récupérés avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAppointmentsWaiting(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "L'ID de l'utilisateur est requis",
        });
      }

      const appointmentService = new AppointmentService();
      const appointments =
        await appointmentService.getAppointmentsWaiting(userId);
      res.status(200).json({
        success: true,
        data: appointments,
        message: "Rendez-vous récupérés avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAppointmentsVerified(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "L'ID de l'utilisateur est requis",
        });
      }

      const appointmentService = new AppointmentService();
      const appointments =
        await appointmentService.getAppointmentsVerified(userId);
      res.status(200).json({
        success: true,
        data: appointments,
        message: "Rendez-vous récupérés avec succès",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateDateDeposition(req, res) {
    try {
      const { id_appointment } = req.params;

      if (!id_appointment) {
        return res.status(400).json({
          success: false,
          message: "L'ID du rendez-vous est requis",
        });
      }

      const appointmentService = new AppointmentService();
      const appointment =
        await appointmentService.updateDateDeposition(id_appointment);

      res.status(200).json({
        success: true,
        data: appointment,
        message: "Date de dépôt mise à jour avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateDatePickup(req, res) {
    try {
      const { id_appointment } = req.params;
      const { date_pick_up } = req.body;

      if (!id_appointment) {
        return res.status(400).json({
          success: false,
          message: "L'ID du rendez-vous est requis",
        });
      }

      if (!date_pick_up) {
        return res.status(400).json({
          success: false,
          message: "La date de récupération est requise",
        });
      }

      const appointmentService = new AppointmentService();
      const appointment = await appointmentService.updateDatePickup(
        id_appointment,
        new Date(date_pick_up),
      );

      res.status(200).json({
        success: true,
        data: appointment,
        message: "Date de récupération mise à jour avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AppointmentController();
