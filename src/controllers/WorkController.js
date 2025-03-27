const WorkService = require('../services/WorkService');

class WorkController {
    async create(req, res) {
        try {
            const work = await WorkService.create(req.body);
            res.status(201).json({
                success: true,
                data: work,
                message: "Travail créé avec succès"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const works = await WorkService.getAll();
            res.status(200).json({
                success: true,
                data: works,
                message: "Travaux récupérés avec succès"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const work = await WorkService.getById(req.params.id);
            res.status(200).json({
                success: true,
                data: work,
                message: "Travail récupéré avec succès"
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const work = await WorkService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: work,
                message: "Travail mis à jour avec succès"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            await WorkService.delete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Travail supprimé avec succès"
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByEmployee(req, res) {
        try {
            const works = await WorkService.getByEmployee(req.params.employeeId);
            res.status(200).json({
                success: true,
                data: works,
                message: "Travaux de l'employé récupérés avec succès"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new WorkController(); 