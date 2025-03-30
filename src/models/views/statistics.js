const mongoose = require("mongoose");

const appointmentsByMonthSchema = new mongoose.Schema(
  {
    _id: {
      year: {
        type: Number,
        required: true
      },
      month: {
        type: Number,
        required: true
      }
    },
    total_confirmed_or_paid: {
      type: Number,
      required: true,
    }
  },
  {
    collection: 'appointments_by_month',
    strict: false,
    versionKey: false
  }
);

module.exports = mongoose.model("AppointmentsByMonth", appointmentsByMonthSchema); 