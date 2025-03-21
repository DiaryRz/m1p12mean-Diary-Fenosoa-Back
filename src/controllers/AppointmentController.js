const AppointmentService = require('../services/AppointmentService');

class AppointmentController {
    // Créer un nouveau rendez-vous
    async create(req, res) {
        try {
            const appointment = await AppointmentService.create(req.body);
            res.status(201).json({
                success: true,
                data: appointment,
                message: 'Rendez-vous créé avec succès'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Récupérer tous les rendez-vous
    async getAll(req, res) {
        try {
            const appointments = await AppointmentService.getAll();
            res.status(200).json({
                success: true,
                data: appointments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Récupérer un rendez-vous par son ID
    async getById(req, res) {
        try {
            const appointment = await AppointmentService.getById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Rendez-vous non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                data: appointment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Mettre à jour un rendez-vous
    async update(req, res) {
        try {
            const appointment = await AppointmentService.update(req.params.id, req.body);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Rendez-vous non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                data: appointment,
                message: 'Rendez-vous mis à jour avec succès'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Mettre à jour le statut d'un rendez-vous
    async updateStatus(req, res) {
        try {
            const appointment = await AppointmentService.updateStatus(
                req.params.id,
                req.body.status
            );
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Rendez-vous non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                data: appointment,
                message: 'Statut du rendez-vous mis à jour avec succès'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
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
                    message: 'Rendez-vous non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Rendez-vous supprimé avec succès'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AppointmentController(); 