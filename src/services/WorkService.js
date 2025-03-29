const Work = require('../models/Works');
const AppointmentService = require('../services/AppointmentService');

class WorkService {
    // Créer un nouveau travail
    async create(workData) {
        try {
            // Créer une instance de AppointmentService
            const appointmentService = new AppointmentService();
            const appointment = await appointmentService.getById(workData.id_appointment);

            if (!appointment) {
                throw new Error("Rendez-vous non trouvé");
            }
            
            const work = new Work(workData);
            const savedWork = await work.save();

            // Récupérer tous les travaux pour ce rendez-vous
            const workPerAppointment = await Work.find({ 
                id_appointment: workData.id_appointment,
                status: "terminé" // On ne compte que les travaux terminés
            });

            // Vérifier si tous les services du rendez-vous ont été traités
            if (appointment.services.length === workPerAppointment.length) {
                // Mettre à jour le statut du rendez-vous
                await appointmentService.update(appointment._id, { 
                    status: "done",
                    date_pick_up: new Date() // Optionnel : ajouter la date de fin
                });
            } else {
                console.log(`Services restants: ${appointment.services.length - workPerAppointment.length}`); // Pour le debug
            }

            return savedWork;
        } catch (error) {
            console.error('Erreur dans WorkService.create:', error); // Pour le debug
            throw error;
        }
    }

    // Récupérer tous les travaux
    async getAll() {
        try {
            return await Work.find()
                .populate('id_appointment')
                .populate('id_employee')
                .sort({ date_start: -1 });
        } catch (error) {
            throw error;
        }
    }

    // Récupérer un travail par ID
    async getById(id) {
        try {
            const work = await Work.findById(id)
                .populate('id_appointment')
                .populate('id_employee');
            if (!work) {
                throw new Error('Travail non trouvé');
            }
            return work;
        } catch (error) {
            throw error;
        }
    }

    // Mettre à jour un travail
    async update(id, workData) {
        try {
            const work = await Work.findByIdAndUpdate(
                id,
                workData,
                { new: true }
            ).populate('id_appointment')
             .populate('id_employee');
            
            if (!work) {
                throw new Error('Travail non trouvé');
            }
            return work;
        } catch (error) {
            throw error;
        }
    }

    // Récupérer les travaux par employé
    async getByEmployee(employeeId) {
        try {
            return await Work.find({ id_employee: employeeId })
                .populate('id_appointment')
                .populate('id_employee')
                .sort({ date_start: -1 });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new WorkService();
