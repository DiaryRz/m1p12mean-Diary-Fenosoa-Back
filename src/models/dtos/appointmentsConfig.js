const mongoose = require("mongoose");
const generateCustomId = require("../../utils/idGenerator");

const ConfigSchema = new mongoose.Schema({
  _id: { type: String },
  max_appointment_per_day: { type: Number , required: true },
  after_hour_appointment: { type: Number , required: true },
  offset_date_appointment: { type: Number , required: true } // en jours
});

ConfigSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this._id = await generateCustomId("Config", "cfg");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Config = mongoose.model("Config", ConfigSchema);
module.exports = Config;
