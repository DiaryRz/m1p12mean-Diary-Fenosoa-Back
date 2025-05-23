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

  async editRole(req, res) {
    try {
      const role = await roleService.editRole(req.params.id, req.body);
      res.status(201).json(role);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout du role", error });
    }
  }
  async getRole(req, res) {
    try {
      const role = await roleService.getAllRoles();
      res.json(role);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des roles", error });
    }
  }
}

module.exports = RoleController;
