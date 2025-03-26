const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const HistoryAppointmentSchema = new mongoose.Schema({
    _id: { type: String },
    date_reservation_request: { type: Date, required: true },
    id_user: { type: String, ref: 'User', required: true },
    id_car: { type: String, ref: 'Car', required: true },
    services: [{ type: String, ref: 'Service' }],
    total_price: { type: Number, required: true },
    total_payed: { type: Number, required: true },
    status: { type: String, required: true},
    modification_status: {
        type: String,
        enum: ['update', 'delete' , 'confirm'],
        required: true
    },
    date_appointment: { type: Date },
    date_modification: { type: Date, default: Date.now }
});

HistoryAppointmentSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            this._id = await generateCustomId('HistoryAppointment', 'histoapp');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const HistoryAppointment = mongoose.model(
  "HistoryAppointment",
  HistoryAppointmentSchema,
);
module.exports = HistoryAppointment;



