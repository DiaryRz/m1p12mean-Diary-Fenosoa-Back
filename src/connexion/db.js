const mongoose = require("mongoose");
const { env } = require("../environnements.js");
const uri = env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

module.exports = mongoose;
