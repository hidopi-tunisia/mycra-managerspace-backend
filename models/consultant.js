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
  photo_profil: {
    type: String
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
    required: false
  },
  profilLinkedIn: {
    type: String,
    required: false
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
    type: String,
    maxlength: 500
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
