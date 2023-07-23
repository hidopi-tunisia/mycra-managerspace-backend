// Importez Mongoose et le modèle du manager
const mongoose = require("mongoose");
const Manager = require("../models/manager");

// Définissez le middleware pour le modèle Manager
ManagerSchema.pre("save", function (next) {
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
