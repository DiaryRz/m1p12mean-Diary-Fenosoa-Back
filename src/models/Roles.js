const mongoose = require('mongoose');
const generateCustomId = require('../utils/idGenerator');

const RoleSchema = new mongoose.Schema({
    _id: { type: String },
    role_name: String
});

RoleSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            this._id = await generateCustomId('Role', 'role');
        }
        next();
    } catch (error) {
        console.error('Error during role save:', error);
        next(error);
    }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
