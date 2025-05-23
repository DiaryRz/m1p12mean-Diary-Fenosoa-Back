const Appointment = require("../models/Appointments");
const HistoryAppointment = require("../models/HistoryAppointments");
const mongoose = require("mongoose");
const PriceDetails = require("../models/PriceDetails");
const CarService = require("../services/CarService");
const UserService = require("../services/UserService");
const ServiceService = require("../services/ServiceService");
const HistoryAppointmentService = require("./HistoryAppointmentService");
const ConfigService = require("./ConfigService");
const crypto = require("crypto");

class AppointmentService {
  async create(appointmentData) {
    try {
      const userExists = await UserService.getUserById(appointmentData.id_user);
      const carExists = await CarService.getCarById(appointmentData.id_car);

      if (!userExists) {
        throw new Error("Utilisateur non trouvé");
      }
      if (!carExists) {
        throw new Error("Voiture non trouvée");
      }

      const appointmentService = new AppointmentService();
      const detailsPrice = await appointmentService.price_appointment(
        appointmentData.id_car,
        appointmentData.services,
      );

      const price_total = detailsPrice.reduce(
        (total, detail) => total + detail.final_price,
        0,
      );
      const total_duration = detailsPrice.reduce(
        (total, detail) => total + detail.total_duration,
        0,
      );
      appointmentData.total_price = price_total;
      appointmentData.total_duration = total_duration;

      const appointment = new Appointment(appointmentData);

      const savedappointment = await appointment.save();

      const detailsWithAppointmentId = detailsPrice.map((detail) => ({
        ...detail,
        id_appointment: savedappointment._id,
      }));

      await PriceDetails.insertMany(detailsWithAppointmentId);

      return savedappointment;
    } catch (error) {
      throw error;
    }
  }

  async addDate_appointment(date_appointment, id_appointment) {
    try {
      const appointment = await Appointment.findById(id_appointment)
        .populate("id_user")
        .populate("id_car")
        .populate("services");

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Créer l'historique avant la modification
      await HistoryAppointmentService.createHistoryFromAppointment(
        appointment.toObject(),
        "update",
      );

      // Mettre à jour le rendez-vous
      appointment.date_appointment = date_appointment;
      appointment.status = "validé";
      const updatedAppointment = await appointment.save();

      return updatedAppointment;
    } catch (error) {
      console.error("Erreur dans addDate_appointment:", error);
      throw error;
    }
  }

  async price_appointment(id_car, services) {
    if (!Array.isArray(services)) {
      throw new Error("services doit être un tableau");
    }

    const car = await CarService.getCarById(id_car);

    // Récupérer tous les services en utilisant Promise.all et ServiceService
    const servicesPromises = services.map((id) =>
      ServiceService.getServiceById(id),
    );
    const servicesData = await Promise.all(servicesPromises);

    if (servicesData.some((service) => !service)) {
      throw new Error("Certains services n'existent pas");
    }

    //tableau détaillé des prix
    const priceDetails = servicesData.map((service) => ({
      id_appointment: null,
      service_id: service._id,
      service_name: service.service_name,
      base_price: service.unit_price,
      multiplier: car.category_id.mult_price,
      final_price: service.unit_price * car.category_id.mult_price,
      total_duration: service.time_needed * car.category_id.mult_time,
    }));

    return priceDetails;
  }

  async getAll(page, itemsPerPage) {
    const skip = (page - 1) * itemsPerPage;
    try {
      const results = await Appointment.find()
        .populate("id_user")
        .populate("id_car")
        .populate("services")
        .skip(skip)
        .limit(itemsPerPage);
      const totalDocuments = await Appointment.countDocuments({});
      const totalPages = Math.ceil(totalDocuments / itemsPerPage);

      return {
        data: results,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalDocuments: totalDocuments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getCond(cond, page, itemsPerPage) {
    try {
      const results = await Appointment.find(cond)
        .populate("id_user")
        .populate({ path: "id_car", populate: { path: "category_id" } })
        .populate("services");

      const totalDocuments = await Appointment.countDocuments(cond);
      const totalPages = Math.ceil(totalDocuments / itemsPerPage);

      console.log(results);

      return {
        data: results,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalDocuments: totalDocuments,
          hasNextPage: page < totalPages && totalDocuments > 0,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      return await Appointment.findById(id)
        .populate("id_user")
        .populate("id_car")
        .populate("services");
    } catch (error) {
      throw error;
    }
  }

  async createHistoryRecord(appointment, modificationType) {
    const historyData = {
      date_appointment: appointment.date_appointment,
      id_client: appointment.id_user,
      id_user: appointment.id_user,
      date_reservation_request: appointment.date_reservation_request,
      id_car: appointment.id_car,
      services: appointment.services,
      total_price: appointment.total_price,
      total_payed: appointment.total_payed,
      status: appointment.status,
      date_services_start: appointment.date_services_start,
      modification_status: modificationType,
    };

    const history = new HistoryAppointment(historyData);
    await history.save();
  }

  async update(id, appointmentData) {
    try {
      // Get original appointment
      const originalAppointment = await Appointment.findById(id);
      if (!originalAppointment) {
        throw new Error("Appointment not found");
      }

      // Create history record
      await this.createHistoryRecord(originalAppointment, "update");

      // Update appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        appointmentData,
        { new: true },
      );

      return updatedAppointment;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      // Get appointment before deletion
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw new Error("Appointment not found");
      }

      // Create history record
      await this.createHistoryRecord(appointment, "delete");

      // Delete appointment
      const deletedAppointment = await Appointment.findByIdAndDelete(id, {});

      return deletedAppointment;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id, status) {
    return await this.update(id, { status: status });
  }

  async getAvailableSlots(startDate, endDate) {
    // Constantes pour les heures d'ouverture et pauses
    const BUSINESS_HOURS = {
      OPENING: 9 + 3, // 9h UTC+3
      CLOSING: 17 + 3, // 17h UTC+3
      LUNCH_START: 12 + 3, // 12h UTC+3
      LUNCH_END: 13.5 + 3, // 13h30 UTC+3
    };

    try {
      const appointments = await Appointment.find({
        date_appointment: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }).sort({ date_appointment: 1 });

      const busySlots = appointments.map((appointment) => {
        const start = new Date(appointment.date_appointment);
        const end = new Date(
          start.getTime() + appointment.total_duration * 60000,
        );
        return { start, end };
      });

      const availableSlots = [];
      let currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        // Vérifier si c'est un weekend (0 = dimanche, 6 = samedi)
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Créer les créneaux du matin et de l'après-midi
          const morningStart = new Date(currentDate);
          morningStart.setHours(BUSINESS_HOURS.OPENING, 0, 0, 0);

          const morningEnd = new Date(currentDate);
          morningEnd.setHours(BUSINESS_HOURS.LUNCH_START, 0, 0, 0);

          const afternoonStart = new Date(currentDate);
          afternoonStart.setHours(BUSINESS_HOURS.LUNCH_END, 30, 0, 0);

          const afternoonEnd = new Date(currentDate);
          afternoonEnd.setHours(BUSINESS_HOURS.CLOSING, 0, 0, 0);

          // Vérifier les conflits pour le matin
          const morningConflicts = busySlots.filter(
            (slot) => slot.start <= morningEnd && slot.end >= morningStart,
          );

          // Vérifier les conflits pour l'après-midi
          const afternoonConflicts = busySlots.filter(
            (slot) => slot.start <= afternoonEnd && slot.end >= afternoonStart,
          );

          // Traiter les créneaux du matin
          if (morningConflicts.length === 0) {
            availableSlots.push({
              start: new Date(morningStart),
              end: new Date(morningEnd),
            });
          } else {
            let lastEnd = morningStart;
            for (const appointment of morningConflicts) {
              if (appointment.start > lastEnd) {
                availableSlots.push({
                  start: new Date(lastEnd),
                  end: new Date(appointment.start),
                });
              }
              lastEnd = appointment.end;
            }
            if (lastEnd < morningEnd) {
              availableSlots.push({
                start: new Date(lastEnd),
                end: new Date(morningEnd),
              });
            }
          }

          // Traiter les créneaux de l'après-midi
          if (afternoonConflicts.length === 0) {
            availableSlots.push({
              start: new Date(afternoonStart),
              end: new Date(afternoonEnd),
            });
          } else {
            let lastEnd = afternoonStart;
            for (const appointment of afternoonConflicts) {
              if (appointment.start > lastEnd) {
                availableSlots.push({
                  start: new Date(lastEnd),
                  end: new Date(appointment.start),
                });
              }
              lastEnd = appointment.end;
            }
            if (lastEnd < afternoonEnd) {
              availableSlots.push({
                start: new Date(lastEnd),
                end: new Date(afternoonEnd),
              });
            }
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return availableSlots;
    } catch (error) {
      throw error;
    }
  }

  async getPendingAppointmentsWithDate() {
    try {
      return await Appointment.find({
        date_appointment: { $ne: null },
        status: "en attente",
      })
        .populate("id_user")
        .populate({ path: "id_car", populate: { path: "category_id" } })
        .populate("services");
    } catch (error) {
      throw error;
    }
  }

  //l'admin confirme le rendez-vous
  async confirmAppointment(id_appointment) {
    try {
      const appointment = await Appointment.findById(id_appointment)
        .populate("id_user")
        .populate("id_car")
        .populate("services");

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Créer l'historique avant la modification
      await HistoryAppointmentService.createHistoryFromAppointment(
        appointment.toObject(),
        "confirm",
      );

      // Mettre à jour le rendez-vous
      appointment.status = "moitié";
      const updatedAppointment = await appointment.save();

      return updatedAppointment;
    } catch (error) {
      console.error("Erreur dans confirmAppointment:", error);
      throw error;
    }
  }

  async getAppointmentsCountBeforeHourBetweenDates(startDate, endDate) {
    try {
      const appointments = await Appointment.aggregate([
        {
          $match: {
            date_appointment: {
              $ne: null,
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            status: "confirmé",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date_appointment",
              },
            },
            count: { $sum: 1 },
            appointments: {
              $push: {
                _id: "$_id",
                date_appointment: "$date_appointment",
                status: "$status",
                total_price: "$total_price",
                total_duration: "$total_duration",
              },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      return appointments.map((item) => ({
        date: item._id,
        nombreRendezVous: item.count,
        details: item.appointments.map((apt) => ({
          id: apt._id,
          heure: new Date(apt.date_appointment),
          status: apt.status,
          prix_total: apt.total_price,
          duree_totale: apt.total_duration,
        })),
      }));
    } catch (error) {
      console.error(
        "Erreur dans getAppointmentsCountBeforeHourBetweenDates:",
        error,
      );
      throw error;
    }
  }

  async getAppointmentsInWhichDay(hour, startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const appointments = await Appointment.find({
      date_appointment: { $gte: startDate, $lte: endDate },
      status: "confirmé",
    });

    const counts = {};

    let buffer = [];
    appointments.forEach((app) => {
      let date = new Date(app.date_appointment);
      let adjustedDate = new Date(date);

      // Si l'heure dépasse 15h, on le décale au jour suivant
      if (date.getUTCHours() >= hour.getUTCHours()) {
        adjustedDate.setUTCDate(adjustedDate.getUTCDate() + 1);
      }
      // Vérifier si la date ajustée tombe un week-end (Samedi ou Dimanche)
      if (adjustedDate.getUTCDay() === 6) {
        // Samedi -> Lundi
        adjustedDate.setUTCDate(adjustedDate.getUTCDate() + 2);
      } else if (adjustedDate.getUTCDay() === 0) {
        // Dimanche -> Lundi
        adjustedDate.setUTCDate(adjustedDate.getUTCDate() + 1);
      }

      const dateStr = adjustedDate.toISOString().split("T")[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    return counts;
  }

  async getDateCompletementOccupe(startDate, endDate) {
    const configString = await ConfigService.getLatest();
    const max_appointment_per_day = configString.max_appointment_per_day;
    const after_hour_appointment = new Date(
      configString.after_hour_appointment,
    );

    const All_appointment = await this.getAppointmentsInWhichDay(
      after_hour_appointment,
      startDate,
      endDate,
    );

    const date_completement_occupe = [];

    for (const date in All_appointment) {
      if (All_appointment[date] >= max_appointment_per_day) {
        date_completement_occupe.push(date);
      }
    }

    return date_completement_occupe;
  }

  async updatePayment(id, newTotalPayed) {
    try {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Mettre à jour le montant total payé
      appointment.total_payed = newTotalPayed;
      appointment.status = "confirmé";

      // Si le montant payé est égal au prix total, mettre à jour le statut
      if (appointment.total_payed >= appointment.total_price) {
        appointment.status = "payé";
      }

      return await appointment.save();
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentsByUserId(userId) {
    try {
      const appointments = await Appointment.find({ id_user: userId })
        .populate("id_user")
        .populate("id_car")
        .populate("services")
        .sort({ date_appointment: -1 }); // Du plus récent au plus ancien

      if (!appointments) {
        throw new Error("Aucun rendez-vous trouvé pour cet utilisateur");
      }

      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentsWaiting(userId) {
    try {
      const appointments = await Appointment.find({
        id_user: userId,
        status: "en attente",
      })
        .populate("id_user")
        .populate({ path: "id_car", populate: { path: "category_id" } })
        .populate("services")
        .sort({ date_appointment: -1 }); // Du plus récent au plus ancien

      if (!appointments) {
        throw new Error("Aucun rendez-vous trouvé pour cet utilisateur");
      }
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentsVerified(userId) {
    try {
      const appointments = await Appointment.find({
        id_user: userId,
        status: "validé",
      })
        .populate("id_user")
        .populate({ path: "id_car", populate: { path: "category_id" } })
        .populate("services")
        .sort({ date_appointment: -1 }); // Du plus récent au plus ancien

      if (!appointments) {
        throw new Error("Aucun rendez-vous trouvé pour cet utilisateur");
      }

      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async updateDateDeposition(id) {
    try {
      const appointment = await Appointment.findById(id);
      // console.log(appointment);
      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Créer l'historique avant la modification
      await HistoryAppointmentService.createHistoryFromAppointment(
        appointment.toObject(),
        "update",
      );

      // Mettre à jour la date de dépôt
      appointment.date_deposition = new Date();
      const updatedAppointment = await appointment.save();

      return updatedAppointment;
    } catch (error) {
      console.error("Erreur dans updateDateDeposition:", error);
      throw error;
    }
  }

  async updateDatePickup(id, date_pick_up) {
    try {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Créer l'historique avant la modification
      await HistoryAppointmentService.createHistoryFromAppointment(
        appointment.toObject(),
        "update",
      );

      // Mettre à jour la date de dépôt
      appointment.date_pick_up = date_pick_up;
      const updatedAppointment = await appointment.save();

      return updatedAppointment;
    } catch (error) {
      console.error("Erreur dans updateDateDeposition:", error);
      throw error;
    }
  }
}

module.exports = AppointmentService;
