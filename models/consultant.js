const mongoose = require("mongoose");

const Consultant = mongoose.model("Consultant", {
  civilite: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dateDisponibilite: {
    type: Date,
    required: true
  },
  dateEmbauche: {
    type: Date,
    required: true
  },
  dossierCompetence: {
    type: String,
    required: true
  },
  profilLinkedIn: {
    type: String,
    required: true
  },
  competences: [{
    type: String
  }],
  poste: {
    type: String,
    required: true
  },
  anneesExperience: {
    type: Number,
    required: true
  },
  numeroTelephone: {
    type: String,
    required: true
  },
  note: {
    type: Number,
    required: true
  },
  date_creation: {
    type: Date,
    default: Date.now,
  },
  projet: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projet",
    },
  ],
});
module.exports = Consultant;
