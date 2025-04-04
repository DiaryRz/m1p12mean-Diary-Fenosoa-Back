const crypto = require("crypto");

const control_phone_number = (phone_number) => {
  try {
    if (!phone_number.startsWith("261")) {
      return {
        message: "Le numéro de téléphone doit commencer par 261",
        ok: false,
      };
      // throw new Error("Le numéro de téléphone doit commencer par 261");
    }
    if (phone_number.length !== 12) {
      return {
        message: "Le numéro de téléphone doit contenir 12 chiffres",
        ok: false,
      };
      // throw new Error("Le numéro de téléphone doit contenir 12 chiffres avec le 261");
    }
    return {
      message: "OK",
      ok: true,
    };
  } catch (error) {
    return {
      message: "Erreur",
      ok: false,
    };
    // throw error;
  }
};

const generateTicket = (immatriculation) => {
  const platePart = immatriculation.replace(/[ ]/g, "");

  const datePart = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 12);
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `PK-${platePart}-${datePart}-${randomPart}`;
};

module.exports = {
  control_phone_number,
  generateTicket,
};
