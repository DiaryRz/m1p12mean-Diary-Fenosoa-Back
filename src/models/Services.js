const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const ServiceSchema = new mongoose.Schema({
  _id: { type: String },
  date_creation: { type: Date, default: Date.now },
  service_name: { type: String, required: true },
  unit_price: { type: Number, required: true },
  ressources: { type: Number, required: true },
  time_needed: { type: Number, required: true }, // in minutes
});

ServiceSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this._id = await generateCustomId("Service", "srv");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;

