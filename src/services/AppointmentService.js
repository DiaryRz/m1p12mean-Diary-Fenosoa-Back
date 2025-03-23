const Appointment = require("../models/Appointments");
const HistoryAppointment = require("../models/HistoryAppointments");
const mongoose = require("mongoose");
const PriceDetails = require("../models/PriceDetails");
const CarService = require("../services/CarService");
const UserService = require("../services/UserService");
const ServiceService = require("../services/ServiceService");

class AppointmentService {
  static async create(appointmentData) {
    try {
      const userExists = await UserService.getUserById(appointmentData.id_user);
      const carService = new CarService();
      const carExists = await carService.getCarById(appointmentData.id_car);

      if (!userExists) {
        throw new Error('Utilisateur non trouvé');
      }
      if (!carExists) {
        throw new Error('Voiture non trouvée');
      }

      const appointmentService = new AppointmentService();
      const detailsPrice = await appointmentService.price_appointement(
        appointmentData.id_car, 
        appointmentData.services 
      );

      const price_total = detailsPrice.reduce((total, detail) => total + detail.final_price, 0);
      appointmentData.total_price = price_total;

      const appointment = new Appointment(appointmentData);

      const savedAppointement = await appointment.save();

      const detailsWithAppointmentId = detailsPrice.map(detail => ({
        ...detail,
        id_appointement: savedAppointement._id
      }));

      await PriceDetails.insertMany(detailsWithAppointmentId);

      return savedAppointement;
      
    } catch (error) {
      throw error;
    }
  }

  async price_appointement(id_car, services) {
    if (!Array.isArray(services)) {
      throw new Error('services doit être un tableau');
    }

    const carService = new CarService();
    const car = await carService.getCarById(id_car);

    // Récupérer tous les services en utilisant Promise.all et ServiceService
    const servicesPromises = services.map(id => ServiceService.getServiceById(id));
    const servicesData = await Promise.all(servicesPromises);

    if (servicesData.some(service => !service)) {
      throw new Error('Certains services n\'existent pas');
    }

    //tableau détaillé des prix
    const priceDetails = servicesData.map(service => ({
      id_appointement: null,
      service_id: service._id,
      service_name: service.service_name,
      base_price: service.unit_price,
      multiplier: car.category_id.mult_price,
      final_price: service.unit_price * car.category_id.mult_price
    }));

    return priceDetails;
  }
  

  static async getAll() {
    try {
      return await Appointment.find()
        .populate("id_user")
        .populate("id_car")
        .populate("services");
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      return await Appointment.findById(id)
        .populate("id_user")
        .populate("id_car")
        .populate("services");
    } catch (error) {
      throw error;
    }
  }

  static async createHistoryRecord(appointment, modificationType) {
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

  static async update(id, appointmentData) {
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

  static async delete(id) {
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

  static async updateStatus(id, status) {
    return await this.update(id, { status: status });
  }
}

module.exports = AppointmentService;

