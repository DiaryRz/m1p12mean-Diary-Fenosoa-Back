const userService = require("../services/UserService");
const bcrypt = require("bcryptjs");

class UserController {
  async addUser(req, res) {
    const {
      firstname,
      name,
      mail,
      phone,
      password_str,
      CIN,
      birth_date,
      gender,
      role,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password_str, salt);
    try {
      const user = await userService.addUser(
        firstname,
        name,
        mail,
        phone,
        password_hash,
        CIN,
        birth_date,
        gender,
        role,
      );
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de la personne", error });
    }
  }
  async getAllUser(req, res) {
    try {
      const users = await userService.getAllUser();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des utilisateurs",
        error,
      });
    }
  }
  async getUserById(req, res) {
    const id = await req.body.id;
    try {
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des utilisateurs",
        error,
      });
    }
  }
  async deleteUser(req, res) {
    const { id } = req.body;
    try {
      const user = await userService.deleteUser(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la deletion de l'utilisateur",
        error,
      });
    }
  }
}

module.exports = UserController;
