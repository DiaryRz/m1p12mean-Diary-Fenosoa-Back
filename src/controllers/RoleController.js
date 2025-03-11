const roleService = require("../services/RoleService");

class RoleController {
  async addRole(req, res) {
    const { role_name } = req.body;
    try {
      const role = await roleService.addRole(role_name);
      res.status(201).json(role);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout du role", error });
    }
  }

  async getAllRole(req, res) {
    try {
      const role = await roleService.getAllRole();

      res.json(role);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des roles", error });
    }
  }

  async getRoleById(req, res) {
    const { id } = req.body;
    if (!id) {
      return res.status(500).json({ message: "Id non spćifier" });
    }
    try {
      const role = await roleService.getRoleById(id);
      res.status(200).json(role);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des roles", error });
    }
  }

  async editRole(req, res) {
    const { id, role_name } = req.body;
    if (!id) {
      return res.status(500).json({ message: "Id non spćifier" });
    }
    try {
      const role = await roleService.editRole(id, roleService);
      res.status(200).json(role);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la modification du role", error });
    }
  }
}

module.exports = RoleController;
