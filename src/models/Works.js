const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const WorkSchema = new mongoose.Schema({
  _id: { type: String },
  id_service: { type: String, ref: "Service", required: true },
  id_appointment: { type: String, ref: "Appointment", required: true },
  id_user: { type: String, ref: "User", required: true },
  status: {
    type: String,
    enum: ["done", "ongoing", "pending"],
    default: "ongoing",
  },
  datetime_service_start: { type: Date, required: true, default: Date.now },
  datetime_service_end: { type: Date },
});

WorkSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this._id = await generateCustomId("Work", "wrk");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Work = mongoose.model("Work", WorkSchema);
module.exports = Work;
