const Payment = require("../models/Payments");
const AppointmentService = require("./AppointmentService");
const { control_phone_number, generateTicket } = require("../utils/Control");
const mongoose = require("mongoose");

const PayementService = {
  async PayFirst(paymentData) {
    // Démarrer une session pour la transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Validation du numéro de téléphone
      control_phone_number(paymentData.phone_number);
      
      const appointmentService = new AppointmentService();
      const appointment = await appointmentService.getById(paymentData.id_appointement);
      
      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      if(appointment.status !== "validé") {
        throw new Error("Soit le rendez-vous n'est pas encore validé soit le payement du 50 pourcent a déjà été effectué");
      }

      // Créer le paiement avec la session
      paymentData.amount_total = appointment.total_price;
      paymentData.amount_payed = appointment.total_price * 50 / 100;
      const payment = new Payment(paymentData);
      await payment.save({ session });

      // Mettre à jour le rendez-vous avec la session
      const newTotalPayed = (appointment.total_payed || 0) + paymentData.amount_payed;
      await appointment.updateOne({
        total_payed: newTotalPayed,
        status: "confirmé" // Mise à jour du statut après le paiement de 50%
      }, { session });

      // Si tout s'est bien passé, valider la transaction
      await session.commitTransaction();
      
      return {
        ...payment.toObject(),
        newStatus: "confirmé"
      };

    } catch (error) {
      // En cas d'erreur, annuler la transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // Terminer la session dans tous les cas
      session.endSession();
    }
  },
};

module.exports = PayementService;
