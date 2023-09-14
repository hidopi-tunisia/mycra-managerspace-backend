import { Schema, model } from "mongoose";

const schema = new Schema({
  consultant: { // consultant
    // Consultant en question qui a saisi le CRA
    type: Schema.Types.ObjectId,
    ref: "Consultant",
  },
  joursTravailles: [ // joursTravailles
    {
      jourSemaine: { // jourSemaine
        type: String, // la journée de la semaine
      },
      date: { // date
        // La date correspondante
        type: Date, //format ISO 8601
      },
      travaille: { // travaille
        // journée travaillée ou pas
        type: Boolean,
        default: true, // Puisque le calendrier est déjà prérempli comme étant travaillé
      },
      reason: { // reason
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
      nomJourFerieDuMois: { // nomJourFerieDuMois
        // le nom du jour férié
        type: String,
      },
    },
  ],
  datesNonTravaillees: [ // datesNonTravaillees
    {
      date: { // date
        type: Date,
      },
      raison: { // raison
        type: String,
      },
    },
  ],
  indisponibilites: [ // indisponibilites
    {
      dateDebut: { // dateDebut
        type: Date,
        required: true,
      },
      dateFin: { // dateFin
        type: Date,
        required: true,
      },
      raison: { // raison
        type: String,
        required: true,
      },
    },
  ],
  nbJoursFeries: { // nbJoursFeries
    // Nombre de semaines travaillées
    type: Number,
  },
  nbSemaines: { // nbSemaines
    // Nombre de semaines travaillées
    type: Number,
  },
  nbJoursTravailles: { // nbJoursTravailles
    // valeur calculable des jours travaillés
    type: Number,
  },
  nbJoursNonTravailles: { // nbJoursNonTravailles
    // valeur calculable des jours non travaillés
    type: Number,
  },
  mois: { // mois
    // Mois du saisi
    type: String,
  },
  date_debut_du_mois: { // date_debut_du_mois
    type: Date,
  },
  date_fin_du_mois: { // date_fin_du_mois
    type: Date,
  },
  annee: { // annee
    // L'année de la saisi
    type: String,
  },
  craType: { // craType 
    // Type de Cra
    type: String,
  },
  projet: { // projet 
    // Projet à laquelle le consultant a travaillé
    type: Schema.Types.ObjectId,
    ref: "Projet",
  },
  confirmation_refus: { // confirmation_refus
    // les détails de confirmation et/ou refus de son CRA
    date_confirmation: { // date_confirmation
      type: Date,
    },
    date_refus: { //date_refus 
      type: Date,
    },
    confirmedBy: { // confirmedBy
      // Le nom du manager
      type: String,
    },
    confirmed_by_manager: { // confirmed_by_manager
      // La confirmation et la validation d'un CRA d'un Consultant
      type: Boolean,
      default: false,
    },
    refused_by_manager: { // refused_by_manager
      // Le  refus d'un CRA d'un Consultant avec une raison.
      type: Boolean,
      default: false,
    },
    raison_refus: { // raison_refus
      // raison du refus
      type: String,
    },
  },
  status: { // status
    type: String, // Validé / Refusé / En Attente
    // RG : Si confirmed_by_manager = false & refused_by_manager = false
    enum: ["rejected", "approved", "pending"], // ["Refusee", "Validee", "En Attente"]
    default: "pending",
    required: true,
  },
  activityReportSubmittedAt: { // date_saisiCra
    // la date de saisi du CRA
    type: Date,
    default: Date.now,
  },
  remoteWorkingDaysCount: { // nb_tt_du_mois
    // Nombre de jours en Télétravail
    type: Number,
  },
  is_deleted: { // is_deleted
    type: Boolean,
    default: true,
  },
});

const Cra = model("Cra", schema);

export default Cra;
