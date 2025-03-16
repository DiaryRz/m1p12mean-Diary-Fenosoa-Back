const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const Role = require("../models/Roles");
const UserHistoryService = require("./UserHistoryService");

class UserService {
  async createUser(userData) {
    try {
      console.log("UserService: Creating user with data:" + userData);
      // Verify if role exists first
      const roleExists = await Role.findById(userData.role_id);
      if (!roleExists) {
        throw new Error("Invalid role_id");
      }

      const hashedPassword = await bcrypt.hash(
        userData.password,
        parseInt(process.env.HASH_SALT),
      );
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await User.find().populate("role_id");
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const u = await User.findById(id);
      const user = await User.populate(u, { path: "role_id" });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByRole(roleId) {
    try {
      const users = await User.find({ role_id: roleId, status: 0 });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      if (userData.password) {
        userData.password = await bcrypt.hash(
          userData.password,
          parseInt(process.env.HASH_SALT),
        );
      }
      return await User.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async userExist(conditions) {
    try {
      const query = { $or: conditions };
      const existingUser = await User.findOne(query);

      return !!existingUser;
    } catch (error) {
      console.error("UserService: Error checking user existence:", error);
      throw error;
    }
  }

  async FireUser(id) {
    try {
      console.log("UserService: Firing user with id:" + id);
      const user = await User.findById(id);
      console.log("UserService: Firing user with id:" + id);
      if (user) {
        UserHistoryService.createUserHistory(user);
        user.status = 1;
        return await user.save();
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
