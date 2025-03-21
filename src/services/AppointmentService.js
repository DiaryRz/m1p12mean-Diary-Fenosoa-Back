const Appointment = require("../models/Appointments");
const HistoryAppointment = require("../models/HistoryAppointments");
const mongoose = require("mongoose");

class AppointmentService {
  static async create(appointmentData) {
    try {
      const appointment = new Appointment(appointmentData);
      return await appointment.save();
    } catch (error) {
      throw error;
    }
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

