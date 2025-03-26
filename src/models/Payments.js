const mongoose = require('mongoose');
const generateCustomId = require('../utils/idGenerator');

const PaymentSchema = new mongoose.Schema({
    _id: { type: String },
    date_pay: { type: Date, default: Date.now },
    id_appointement: { type: String, ref: 'Appointment', required: true },
    amount_payed: { type: Number, required: true },
    amount_total: { type: Number, required: true },
    phone_number: { type: String, required: true }
});

PaymentSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            this._id = await generateCustomId('Payment', 'pay');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;