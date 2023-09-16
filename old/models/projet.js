const mongoose = require("mongoose");

const ProjetSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  codeProjet: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: Date,
    required: false,
  },
  dateFin: {
    type: Date,
    required: false,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  categorie: {
    type: String,
    required: true,
  },
  consultants: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultant",
  },
  date_creation: {
    type: Date,
    default: Date.now()
  }
});

const Projet = mongoose.model("Projet", ProjetSchema);

module.exports = Projet;
