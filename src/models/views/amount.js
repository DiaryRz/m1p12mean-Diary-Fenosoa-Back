const mongoose = require("mongoose");

const amountByMonthSchema = new mongoose.Schema(
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
    total_payed: {
      type: Number,
      required: true,
    }
  },
  {
    collection: 'amount_by_month',
    strict: false,
    versionKey: false
  }
);

module.exports = mongoose.model("AmountByMonth", amountByMonthSchema); 