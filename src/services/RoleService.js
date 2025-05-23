const Role = require("../models/Roles");
const mongoose = require("../connexion/db");

const RoleService = {
  async addRole(role_name) {
    try {
      const role = new Role({ role_name });
      await role.save();
      return role;
    } catch (error) {
      console.error("Error during role addition:", error);
      throw error;
    }
  },

  async editRole(id, role_data) {
    try {
      await Role.findByIdAndUpdate(id, role_data, { new: true });
    } catch (error) {
      console.error("Error during role addition:", error);
      throw error;
    }
  },
  async getAllRoles() {
    try {
      const roles = await Role.find();
      return roles;
    } catch (error) {
      throw new Error(`Failed to fetch roles: ${error.message}`);
    }
  },
};

module.exports = RoleService;
