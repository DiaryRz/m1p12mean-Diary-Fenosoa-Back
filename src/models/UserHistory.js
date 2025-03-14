const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const UserHistorySchema = new mongoose.Schema({
       _id: { type: String },
       date_registration: { type: Date },
       name: String,
       firstname: String,
       mail: String,
       phone: String,
       password: String,
       birth_date: Date,
       CIN: String,
       gender: String,
       role_id: { type: String, ref: 'Role', required: true } ,
       date_dismissal : { type: Date , default: Date.now }
   });

UserHistorySchema.pre("save", async function (next) {
  if (this.isNew) {
    this._id = await generateCustomId("UserHistory", "user_hist");
  }
  next();
});

module.exports = mongoose.model('UserHistory', UserHistorySchema)
