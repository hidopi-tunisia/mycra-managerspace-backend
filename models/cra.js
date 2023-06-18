const mongoose = require('mongoose');

const CraSchema = mongoose.Schema({
  consultant: { // Consultant en question qui a saisi le CRA
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultant",
  },
  joursTravailles: [
    {
      jourSemaine: {
        type: String, // la journée de la semaine
      },
      date:{
        type: Date,
      },
      travaille: { // journée travaillée ou pas
        type: Boolean,
        default: true, // Puisque le calendrier est déjà prérempli comme étant travaillé
      },
    },
  ],
  nbSemaines: {
    type: Number,
  },
  nbJoursTravailles: { // valeur calculable
    type: Number,
  },
  mois: {
    type: String,
  },
  date_debut_du_mois: {
    type: Date,
  },
  date_fin_du_mois: {
    type: Date,
  },
  annee: {
    type: String,
  },
  craType: {
    type: String,
  },
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projet"
  },
  confirmation: { // les détails de confirmation de son CRA
    date_confirmation: {
      type: Date,
    },
    confirmedBy: {
      type: String,
    },
    confirmed_by_manager: { // Le manager qui a confirmé le CRA de son Consultant
      type: Boolean,
      default: false,
    },
  },
  date_saisiCra: { // la date de saisi du CRA
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Cra', CraSchema) ;;
