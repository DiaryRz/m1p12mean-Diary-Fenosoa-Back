const mongoose = require('mongoose');
const generateCustomId = require('../utils/idGenerator');

const CarSchema = new mongoose.Schema({
    _id: { type: String },
    category_id: { type: String, ref: 'CarCategory', required: true },
    immatriculation: { type: String, required: true, unique: true },
    mark: { type: String, required: true },
    model: { type: String, required: true },
    place_number: { type: Number, required: true },
    engine_fuel_Type: { type: String, required: true }
});

CarSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            this._id = await generateCustomId('Car', 'car');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;