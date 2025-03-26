const Appointment = require("../models/Appointments");
const HistoryAppointment = require("../models/HistoryAppointments");
const mongoose = require("mongoose");
const PriceDetails = require("../models/PriceDetails");
const CarService = require("../services/CarService");
const UserService = require("../services/UserService");
const ServiceService = require("../services/ServiceService");
const HistoryAppointmentService = require("./HistoryAppointmentService");

class AppointmentService {
  static async create(appointmentData) {
    try {
      const userExists = await UserService.getUserById(appointmentData.id_user);
      const carService = new CarService();
      const carExists = await carService.getCarById(appointmentData.id_car);

      if (!userExists) {
        throw new Error("Utilisateur non trouvé");
      }
      if (!carExists) {
        throw new Error("Voiture non trouvée");
      }

      const appointmentService = new AppointmentService();
      const detailsPrice = await appointmentService.price_appointement(
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

      const savedAppointement = await appointment.save();

      const detailsWithAppointmentId = detailsPrice.map((detail) => ({
        ...detail,
        id_appointement: savedAppointement._id,
      }));

      await PriceDetails.insertMany(detailsWithAppointmentId);

      return savedAppointement;
    } catch (error) {
      throw error;
    }
  }

  async addDate_appointment(date_appointment, id_appointement) {
    try {
      const appointment = await Appointment.findById(id_appointement)
        .populate('id_user')
        .populate('id_car')
        .populate('services');

      console.log(appointment);
      if (!appointment) {
        throw new Error('Rendez-vous non trouvé');
      }

      // Créer l'historique avant la modification
      await HistoryAppointmentService.createHistoryFromAppointment(
        appointment.toObject(),
        'update'
      );

      // Mettre à jour le rendez-vous
      appointment.date_appointment = date_appointment;
      const updatedAppointment = await appointment.save();

      return updatedAppointment;
    } catch (error) {
      console.error('Erreur dans addDate_appointment:', error);
      throw error;
    }
  }

  async price_appointement(id_car, services) {
    if (!Array.isArray(services)) {
      throw new Error("services doit être un tableau");
    }

    const carService = new CarService();
    const car = await carService.getCarById(id_car);

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
      id_appointement: null,
      service_id: service._id,
      service_name: service.service_name,
      base_price: service.unit_price,
      multiplier: car.category_id.mult_price,
      final_price: service.unit_price * car.category_id.mult_price,
      total_duration: service.time_needed * car.category_id.mult_time,
    }));

    return priceDetails;
  }

  async getAll() {
    try {
      return await Appointment.find()
        .populate("id_user")
        .populate("id_car")
        .populate("services");
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
      date_appointement: appointment.date_appointement,
      id_client: appointment.id_user,
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
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

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
        { new: true, session },
      );

      await session.commitTransaction();
      return updatedAppointment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async delete(id) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Get appointment before deletion
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw new Error("Appointment not found");
      }

      // Create history record
      await this.createHistoryRecord(appointment, "delete");

      // Delete appointment
      const deletedAppointment = await Appointment.findByIdAndDelete(id, {
        session,
      });

      await session.commitTransaction();
      return deletedAppointment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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
        status: "en attente"
      })
      .populate("id_user")
      .populate("id_car")
      .populate("services");
    } catch (error) {
      throw error;
    }
  }

  //confirmer le rendez-vous
  async confirmAppointment(id_appointement) {
    try {
      const appointment = await Appointment.findById(id_appointement)
        .populate('id_user')
        .populate('id_car')
        .populate('services');

      console.log(appointment);
      if (!appointment) {
        throw new Error('Rendez-vous non trouvé');
      }

      // Créer l'historique avant la modification
      await HistoryAppointmentService.createHistoryFromAppointment(
        appointment.toObject(),
        'confirm'
      );

      // Mettre à jour le rendez-vous
      appointment.status = "confirmé";
      const updatedAppointment = await appointment.save();

      return updatedAppointment;
    } catch (error) {
      console.error('Erreur dans addDate_appointment:', error);
      throw error;
    }
  }


  async getAppointmentsCountBeforeHourBetweenDates(hour, startDate, endDate) {
    try {
      const appointments = await Appointment.aggregate([
        {
          $match: {
            date_appointment: { 
              $ne: null,
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            },
            status: "confirmé"
          }
        },
        {
          $addFields: {
            hour: { $hour: "$date_appointment" }
          }
        },
        {
          $match: {
            hour: { $lt: hour }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$date_appointment" 
              }
            },
            count: { $sum: 1 },
            appointments: { 
              $push: {
                _id: "$_id",
                date_appointment: "$date_appointment",
                status: "$status",
                total_price: "$total_price",
                total_duration: "$total_duration"
              }
            }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      return appointments.map(item => ({
        date: item._id,
        nombreRendezVous: item.count,
        details: item.appointments.map(apt => ({
          id: apt._id,
          heure: new Date(apt.date_appointment).toLocaleTimeString(),
          status: apt.status,
          prix_total: apt.total_price,
          duree_totale: apt.total_duration
        }))
      }));
    } catch (error) {
      console.error('Erreur dans getAppointmentsCountBeforeHourBetweenDates:', error);
      throw error;
    }
  }

}

module.exports = AppointmentService;
