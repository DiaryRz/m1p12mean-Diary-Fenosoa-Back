const Payment = require("../models/Payments");
const AppointmentService = require("./AppointmentService");
const Appointment = require("../models/Appointments.js");
const { control_phone_number, generateTicket } = require("../utils/Control");
const mongoose = require("mongoose");

const PayementService = {
  async PayFirst(paymentData) {
    try {
      // Validate inputs first
      if (!paymentData.id_appointment) {
        throw new Error("Appointment ID required");
      }

      const appointment = await Appointment.findById(
        paymentData.id_appointment,
      );

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      if (appointment.status !== "validé") {
        throw new Error(
          "Soit le rendez-vous n'est pas encore validé soit le payement du 50% a déjà été effectué",
        );
      }

      // Create payment
      const amountTotal = appointment.total_price;
      const amountPayed = (amountTotal * 50) / 100;

      const payment = new Payment({
        ...paymentData,
        amount_total: amountTotal,
        amount_payed: amountPayed,
        payment_status: "partial",
      });

      const savedPayment = await payment.save();

      // Update appointment
      const newTotalPayed = (appointment.total_payed || 0) + amountPayed;
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointment._id,
        {
          total_payed: newTotalPayed,
          status: "confirmé",
          updated_at: new Date(),
        },
        { new: true },
      );

      return {
        ...savedPayment.toObject(),
        newStatus: "confirmé",
      };
    } catch (error) {
      console.error("Payment processing failed:", error);
      throw error;
    }
  },

  async PayTotal(paymentData) {
    // Démarrer une session pour la transaction
    /* const session = await mongoose.startSession();
    session.startTransaction(); */

    try {
      // Validation du numéro de téléphone
      control_phone_number(paymentData.phone_number);

      const appointmentService = new AppointmentService();
      const appointment = await appointmentService.getById(
        paymentData.id_appointment,
      );

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      if (appointment.status !== "finie") {
        throw new Error("Le paiement de la moitié n'est pas encore effectué");
      }

      // Créer le paiement avec la session
      paymentData.amount_total = appointment.total_price;
      paymentData.amount_payed =
        appointment.total_price - (appointment.total_payed || 0);
      const payment = new Payment(paymentData);
      await payment.save();
      // Mettre à jour le rendez-vous avec la session
      const newTotalPayed =
        (appointment.total_payed || 0) + paymentData.amount_payed;
      await appointment.updateOne({
        total_payed: newTotalPayed,
        status: "payé", // Mise à jour du statut après le paiement de 100%
        ticket_recup: generateTicket(appointment.id_car.immatriculation),
      });

      // Si tout s'est bien passé, valider la transaction
      return {
        ...payment.toObject(),
        newStatus: "payé",
      };
    } catch (error) {
      // En cas d'erreur, annuler la transaction
      throw error;
    } finally {
    }
  },

  async getPaymentsByAppointmentId(appointmentId) {
    try {
      const payments = await Payment.find({
        id_appointment: appointmentId,
      }).sort({ createdAt: -1 }); // Du plus récent au plus ancien

      if (!payments || payments.length === 0) {
        throw new Error("Aucun paiement trouvé pour ce rendez-vous");
      }

      // Calculer le total payé
      const totalPayed = payments.reduce(
        (sum, payment) => sum + payment.amount_payed,
        0,
      );

      return {
        payments,
        totalPayed,
        count: payments.length,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = PayementService;
