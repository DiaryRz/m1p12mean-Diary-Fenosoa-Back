const mongoose = require('mongoose');

// Définir le schéma de la vue avec _id explicitement comme String
const AppointmentServicesStatusSchema = new mongoose.Schema({
    _id: { type: String },
    date_appointment: Date,
    status: String,
    total_price: Number,
    total_duration: Number
}, { 
    strict: false,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Créer le modèle de la vue
const AppointmentServicesStatus = mongoose.model(
    'appointment_services_status', 
    AppointmentServicesStatusSchema, 
    'appointment_services_status'
);

module.exports = AppointmentServicesStatus;
