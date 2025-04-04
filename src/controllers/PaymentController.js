const PaymentService = require("../services/PaymentsService");
const User = require("../models/Users.js");
const bcrypt = require("bcryptjs");
const { control_phone_number, generateTicket } = require("../utils/Control");

class PaymentController {
  async pay(req, res) {
    // console.log(req.body);

    try {
      const user = await User.findById(req.body.userId);

      const validpassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (!validpassword) {
        return res.status(400).json({
          message: "invalid password",
          error: { password: true },
          success: false,
        });
      }
      const error = control_phone_number(req.body.phone_number);
      console.log(error);
      if (!error.ok)
        return res.status(400).json({
          success: false,
          error: {
            phone: true,
          },
          message: error.message,
        });

      const payment = await PaymentService.PayFirst(req.body);
      return res.status(201).json({
        success: true,
        data: payment,
        message: "Paiement effectué avec succès",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async paytotal(req, res) {
    try {
      console.log(req.body);
      const user = await User.findById(req.body.userId);
      const validpassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (!validpassword) {
        return res.status(400).json({
          message: "invalid password",
          error: { password: true },
          success: false,
        });
      }

      const payment = await PaymentService.PayTotal(req.body);
      res.status(201).json({
        success: true,
        data: payment,
        message: "Paiement effectué avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPaymentsByAppointment(req, res) {
    try {
      const { appointmentId } = req.params;

      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: "L'ID du rendez-vous est requis",
        });
      }

      const payments =
        await PaymentService.getPaymentsByAppointmentId(appointmentId);

      res.status(200).json({
        success: true,
        data: payments,
        message: "Paiements récupérés avec succès",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new PaymentController();
