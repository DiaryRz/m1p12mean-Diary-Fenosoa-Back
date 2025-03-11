const User = require("../models/User");
const mongoose = require("../connexion/db");

class UserService {
  async addUser(
    firstname,
    lastname,
    mail,
    phone,
    password_hash,
    CIN,
    birthday,
    gender,
    role,
  ) {
    const user = new User({
      firstname,
      lastname,
      mail,
      phone,
      password_hash,
      CIN,
      birthday,
      gender,
      role,
    });
    return await user.save();
  }

  async getAllUser() {
    return await User.find().populate("role");
  }

  async getUserById(id) {
    return await User.findById(id).populate("role");
  }

  async userExist(query) {
    return await User.findOne({
      $or: query,
    }).populate("role");
  }
  async getUser(query) {
    return await User.findOne(query).populate("role");
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
