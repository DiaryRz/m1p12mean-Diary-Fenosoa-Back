const AppointmentServicesStatus = require('../models/views/appointment_services_status');
const mongoose = require('mongoose');

class AppointmentServicesStatusService {
    async getAll() {
        try {
            return await AppointmentServicesStatus.find();
        } catch (error) {
            throw error;
        }
    }

    async getByUserId(userId) {
        try {
            return await AppointmentServicesStatus.find({ 'id_user._id': userId });
        } catch (error) {
            throw error;
        }
    }

    async getByStatus(status) {
        try {
            return await AppointmentServicesStatus.find({ status: status });
        } catch (error) {
            throw error;
        }
    }

    async getByDateRange(startDate, endDate) {
        try {
            return await AppointmentServicesStatus.find({
                date_appointment: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async getByAppointmentId(appointmentId) {
        try {
            const appointment = await AppointmentServicesStatus.collection.findOne({ 
                _id: appointmentId
            });
            
            if (!appointment) {
                throw new Error("Rendez-vous non trouvé");
            }
            return appointment;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AppointmentServicesStatusService(); 