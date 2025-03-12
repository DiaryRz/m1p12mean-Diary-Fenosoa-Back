const mongoose = require('mongoose');
const generateCustomId = require('../utils/idGenerator');

const UserSchema = new mongoose.Schema({
       _id: { type: String },
       name: String,
       firstname: String,
       mail: String,
       phone: String,
       password: String,
       birth_date: Date,
       CIN: String,
       gender: String,
       role_id: { type: String, ref: 'Role', required: true } ,
       status : { type: Number , default: 0 } //0 when user is created, 1 when user is fired
   });

UserSchema.pre('save', async function(next) {
    if (this.isNew) {
        this._id = await generateCustomId('User', 'user');
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;