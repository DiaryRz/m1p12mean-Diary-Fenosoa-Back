const Role = require('../models/Role');
const mongoose = require('../connexion/db');

async function addRole(role_name) {
    try {
        const role = new Role({ role_name });
        await role.save();
        return role;
    } catch (error) {
        console.error('Error during role addition:', error);
        throw error;
    }
}

module.exports = {
    addRole
};
