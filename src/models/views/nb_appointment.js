const mongoose = require("mongoose");

const servicesByMonthSchema = new mongoose.Schema(
  {
    _id: {
      year: {
        type: Number,
        required: true
      },
      month: {
        type: Number,
        required: true
      },
      service: {
        type: String,
        required: true
      }
    },
    total_services_taken: {
      type: Number,
      required: true,
    }
  },
  {
    collection: 'nb_services_by_month',
    strict: false,
    versionKey: false
  }
);

module.exports = mongoose.model("NbServicesByMonth", servicesByMonthSchema); 