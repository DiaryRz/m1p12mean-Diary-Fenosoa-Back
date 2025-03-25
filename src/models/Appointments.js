const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const AppointmentSchema = new mongoose.Schema({
  _id: { type: String },
  date_reservation_request: { type: Date, required: true },
  id_user: { type: String, ref: "User", required: true },
  id_car: { type: String, ref: "Car", required: true },
  services: [{ type: String, ref: "Service" }],
  total_duration: { type: Number, default: 0 },
  total_price: { type: Number, required: true },
  total_payed: { type: Number, default: 0 },
  status: { type: String, default: "en attente" },
  date_appointment: { type: Date, default: null },
});

AppointmentSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this._id = await generateCustomId("Appointment", "apt");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
