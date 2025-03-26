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
}

module.exports = new PaymentController(); 