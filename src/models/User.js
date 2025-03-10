const mongoose = require('mongoose');
const generateCustomId = require('../utils/idGenerator');

const UserSchema = new mongoose.Schema({
       _id: { type: String },
       name: String,
       firstname: String,
       mail: String,
       phone: String,
       password_hash: String,
       birth_date: Date,
       CIN: String,
       gender: String,
       role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
   });

UserSchema.pre('save', async function(next) {
    if (this.isNew) {
        this._id = await generateCustomId('User', 'user');
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;