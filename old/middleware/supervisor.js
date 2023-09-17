// Importez Mongoose et le modèle du supervisor
const mongoose = require("mongoose");
const Supervisor = require("../models/supervisor");

// Définissez le middleware pour le modèle Supervisor
SupervisorSchema.pre("save", function (next) {
  const now = new Date();
  const periodeDessaiFin = this.periodeDessai.fin;

  // Vérifiez si la période d'essai a expiré
  if (periodeDessaiFin < now) {
    this.periodeDessaiExpiree = true;
  } else {
    this.periodeDessaiExpiree = false;
  }

  next();
});
