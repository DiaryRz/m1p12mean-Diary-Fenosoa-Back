const mongoose = require('mongoose');

const priceDetailsSchema = new mongoose.Schema({
    id_appointement: {
        type: String,
        ref: 'appointement',
        required: true
    },
    service_id: {
        type: String,
        ref: 'Service',
        required: true
  },
  service_name: {
    type: String,
    required: true
  },
  base_price: {
    type: Number,
    required: true
  },
  multiplier: {
    type: Number,
    required: true
  },
  final_price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const PriceDetails = mongoose.model('PriceDetails', priceDetailsSchema);
module.exports = PriceDetails;
