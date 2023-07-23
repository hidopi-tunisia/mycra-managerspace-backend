const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  civilite: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: false,
  },
  prenom: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  numeroTelephone: {
    type: String,
    required: true,
  },
  deuxiemeNumeroTelephone: {
    type: String,
  },
  adresse: {
    rue: {
      type: String,
      required: true,
    },
    codePostal: {
      type: String,
      required: true,
    },
    ville: {
      type: String,
      required: true,
    },
  },
  nomCompletResponsable: {
    type: String,
    required: true,
  },
  nomSocialEntreprise: {
    type: String,
    required: true,
  },
  siretEntreprise: {
    type: String,
    required: true,
  },
  dateSignature: {
    type: Date,
  },
  observation: {
    type: String,
  },
  projets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projet",
    },
  ],
  consultants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultant",
  }],
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
