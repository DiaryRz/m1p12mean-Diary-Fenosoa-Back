const PaymentService = require('../services/PaymentsService');

class PaymentController {
    async pay(req, res) {
        try {
            const payment = await PaymentService.PayFirst(req.body);
            res.status(201).json({
                success: true,
                data: payment,
                message: "Paiement effectué avec succès"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async paytotal(req, res) {
        try {
            const payment = await PaymentService.PayTotal(req.body);
            res.status(201).json({
                success: true,
                data: payment,
                message: "Paiement effectué avec succès"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getPaymentsByAppointment(req, res) {
        try {
            const { appointmentId } = req.params;
            
            if (!appointmentId) {
                return res.status(400).json({
                    success: false,
                    message: "L'ID du rendez-vous est requis"
                });
            }

            const payments = await PaymentService.getPaymentsByAppointmentId(appointmentId);
            
            res.status(200).json({
                success: true,
                data: payments,
                message: "Paiements récupérés avec succès"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new PaymentController(); 