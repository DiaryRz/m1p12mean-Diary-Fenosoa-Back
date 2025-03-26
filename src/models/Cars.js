const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const CarSchema = new mongoose.Schema({
  _id: { type: String },
  date_creation: { type: Date, default: Date.now },
  category_id: { type: String, ref: "CarCategory", required: true },
  immatriculation: { type: String, required: true, unique: true },
  mark: { type: String, required: true },
  model: { type: String, required: true },
  place_number: { type: Number, required: true },
  engine_fuel_Type: {
    type: String,
    required: true,
    enum: ["Diesel", "Gasoline", "Electric", "Hybrid"],
    message: "{VALUE} is not a valid fuel type",
  },
  user_id: { type: String, ref: "User", required: true },
});

CarSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this._id = await generateCustomId("Car", "car");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;

