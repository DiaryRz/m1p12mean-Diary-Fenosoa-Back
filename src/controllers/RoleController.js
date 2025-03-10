const roleService = require('../services/RoleService');

class RoleController {
    async addRole(req, res) {
        const { role_name } = req.body;
        console.log(role_name);
        try {
            const role = await roleService.addRole(role_name);
            res.status(201).json(role);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'ajout du role', error });
        }
    }

    async getRole(req, res) {
        try {
            const role = await roleService.getAllrole();
            res.json(role);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des roles', error });
        }
    }

}

module.exports = RoleController;
