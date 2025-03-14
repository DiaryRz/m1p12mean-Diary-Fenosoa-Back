const mongoose = require('mongoose');
const generateCustomId = require('../utils/idGenerator');

const CarCategorySchema = new mongoose.Schema({
    _id: { type: String },
    date_creation: { type: Date, default: Date.now },
    type_name: { type: String, required: true },
    type_desc: { type: String, required: true },
    mult_price: { type: Number, required: true },
    mult_time: { type: Number, required: true }
});

CarCategorySchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            this._id = await generateCustomId('CarCategory', 'cat');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const CarCategory = mongoose.model('CarCategory', CarCategorySchema);
module.exports = CarCategory;