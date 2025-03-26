const HistoryAppointment = require('../models/HistoryAppointments');
const AppointmentService = require('./AppointmentService');

class HistoryAppointmentService {
    static async createHistoryFromAppointment(appointment, modificationType) {
        try {
            const historyData = {
                date_reservation_request: appointment.date_reservation_request || new Date(),
                id_user: appointment.id_user,
                id_car: appointment.id_car,
                services: appointment.services || [],
                total_price: appointment.total_price || 0,
                total_payed: appointment.total_payed || 0,
                status: appointment.status || 'pending',
                modification_status: modificationType,
                date_appointment: appointment.date_appointment,
                date_modification: new Date()
            };

            const historyAppointment = new HistoryAppointment(historyData);
            return await historyAppointment.save();
        } catch (error) {
            console.error('Erreur lors de la création de l\'historique:', error);
            throw error;
        }
    }
}

module.exports = HistoryAppointmentService;
