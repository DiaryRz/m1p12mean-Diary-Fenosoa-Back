const AppointmentServicesStatus = require('../models/views/appointment_services_status');
const AppointmentServicesStatusService = require('../services/AppointmentServicesStatusService');

class AppointmentServicesStatusController {
    async getAll(req, res) {
        try {
            const appointments = await AppointmentServicesStatus.find();
            res.status(200).json({
                success: true,
                data: appointments,
                message: "Données récupérées avec succès"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByUserId(req, res) {
        try {
            const { userId } = req.params;
            const appointments = await AppointmentServicesStatus.find({ 'id_user._id': userId });
            res.status(200).json({
                success: true,
                data: appointments,
                message: "Données utilisateur récupérées avec succès"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const appointments = await AppointmentServicesStatus.find({ status });
            res.status(200).json({
                success: true,
                data: appointments,
                message: "Données par statut récupérées avec succès"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: "Les dates de début et de fin sont requises"
                });
            }

            const appointments = await AppointmentServicesStatus.find({
                date_appointment: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });

            res.status(200).json({
                success: true,
                data: appointments,
                message: "Données par plage de dates récupérées avec succès"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByAppointmentId(req, res) {
        try {
            const { appointmentId } = req.params;
            
            if (!appointmentId) {
                return res.status(400).json({
                    success: false,
                    message: "L'ID du rendez-vous est requis"
                });
            }

            const appointment = await AppointmentServicesStatusService.getByAppointmentId(appointmentId);
            
            res.status(200).json({
                success: true,
                data: appointment,
                message: "Détails du rendez-vous récupérés avec succès"
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AppointmentServicesStatusController(); 