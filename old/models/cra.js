import { Schema, model } from "mongoose";

const schema = new Schema({
  consultant: {
    // Consultant en question qui a saisi le CRA
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultant",
  },
  joursTravailles: [
    {
      jourSemaine: {
        type: String, // la journée de la semaine
      },
      date: {
        // La date correspondante
        type: Date, //format ISO 8601
      },
      travaille: {
        // journée travaillée ou pas
        type: Boolean,
        default: true, // Puisque le calendrier est déjà prérempli comme étant travaillé
      },
      reason: {
        type: String,
        enum: [
          "Absence",
          "Arrêt maladie",
          "CP",
          "Jour férié",
          "Absences",
          "Absence autorisée non rémunérée",
          "Absence non autorisée non rémunérée",
          "Déménagement",
          "Examen médical prénatal",
          "Mariage enfant",
          "Mariage-Pacs",
          "Maternité",
          "Naissance",
          "Paternité",
          "Soins enfants",
          "Accident de travail-trajet",
          "Autre",
        ],
        required: false,
      },
      nomJourFerieDuMois: {
        // le nom du jour férié
        type: String,
      },
    },
  ],
  datesNonTravaillees: [
    {
      date: {
        type: Date,
      },
      raison: {
        type: String,
      },
    },
  ],
  indisponibilites: [
    {
      dateDebut: {
        type: Date,
        required: true,
      },
      dateFin: {
        type: Date,
        required: true,
      },
      raison: {
        type: String,
        required: true,
      },
    },
  ],
  nbJoursFeries: {
    // Nombre de semaines travaillées
    type: Number,
  },
  nbSemaines: {
    // Nombre de semaines travaillées
    type: Number,
  },
  nbJoursTravailles: {
    // valeur calculable des jours travaillés
    type: Number,
  },
  nbJoursNonTravailles: {
    // valeur calculable des jours non travaillés
    type: Number,
  },
  mois: {
    // Mois du saisi
    type: String,
  },
  date_debut_du_mois: {
    type: Date,
  },
  date_fin_du_mois: {
    type: Date,
  },
  annee: {
    // L'année de la saisi
    type: String,
  },
  craType: {
    // Type de Cra
    type: String,
  },
  projet: {
    // Projet à laquelle le consultant a travaillé
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projet",
  },
  confirmation_refus: {
    // les détails de confirmation et/ou refus de son CRA
    date_confirmation: {
      type: Date,
    },
    date_refus: {
      type: Date,
    },
    confirmedBy: {
      // Le nom du manager
      type: String,
    },
    confirmed_by_manager: {
      // La confirmation et la validation d'un CRA d'un Consultant
      type: Boolean,
      default: false,
    },
    refused_by_manager: {
      // Le  refus d'un CRA d'un Consultant avec une raison.
      type: Boolean,
      default: false,
    },
    raison_refus: {
      // raison du refus
      type: String,
    },
  },
  status: {
    type: String, // Validé / Refusé / En Attente
    // RG : Si confirmed_by_manager = false & refused_by_manager = false
    enum: ["Refusee", "Validee", "En Attente"],
    default: "En Attente",
    required: true,
  },
  date_saisiCra: {
    // la date de saisi du CRA
    type: Date,
    default: Date.now()
  },
  nb_tt_du_mois: {
    // Nombre de jours en Télétravail
    type: Number,
  },
  is_deleted: {
    type: Boolean,
    default: true,
  },
});

const Cra = model("Cra", schema);

export default Cra;
