const userService = require('../services/UserService');

class UserController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) {
                return res.status(204).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    }

    async getAllManager(req, res) {
        try {
            const user = await userService.getUsersByRole("role_001");
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users by role', error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getUsersByRole("role_002");
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users by role', error: error.message });
        }
    }

    async getAllMecanic(req, res) {
        try {
            const users = await userService.getUsersByRole("role_003");
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users by role', error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }

    async fireUser(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const user = await userService.FireUser(id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ 
                message: 'User fired successfully',
                user: user 
            });

        } catch (error) {
            return res.status(500).json({ 
                message: 'Error firing user', 
                error: error.message 
            });
        }
    }

}

module.exports = UserController;