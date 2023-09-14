import { Schema, model } from "mongoose";

const schema = new Schema({
  consultant: {
    // consultant
    // Consultant en question qui a saisi le CRA
    type: Schema.Types.ObjectId,
    ref: "Consultant",
  },
  workingDates: [
    // joursTravailles
    {
      weekDay: {
        // jourSemaine
        type: String, // la journée de la semaine
      },
      date: {
        // date
        // La date correspondante
        type: Date, //format ISO 8601
      },
      worked: {
        // travaille
        // journée travaillée ou pas
        type: Boolean,
        default: true, // Puisque le calendrier est déjà prérempli comme étant travaillé
      },
      reason: {
        // reason
        type: String,
        enum: [
          "Absence", // Absence
          "Sick leave", // Arrêt maladie
          "Paid leave", // CP
          "Holiday", // Jour férié
          "Absences", // Absences
          "Authorized unpaid leave", // Absence autorisée non rémunérée
          "Unauthorized unpaid leave", // Absence non autorisée non rémunérée
          "Relocation", // Déménagement
          "Prenatal medical examination", // Examen médical prénatal
          "Child's wedding", // Mariage enfant
          "PACS", // Mariage-Pacs
          "Maternity", // Maternité
          "Birth", // Naissance
          "Paternity", // Paternité
          "Childcare", // Soins enfants
          "Workplace or commuting accident", // Accident de travail-trajet
          "Other", // Autre
        ],
        required: false,
      },
      holidayName: { // nomJourFerieDuMois
        // nomJourFerieDuMois
        // le nom du jour férié
        type: String,
      },
    },
  ],
  nonWorkingDates: [ // 
    // datesNonTravaillees
    {
      date: {
        // date
        type: Date,
      },
      reason: {
        // raison
        type: String,
      },
    },
  ],
  unavailabilities: [
    // indisponibilites
    {
      startDate: {
        // dateDebut
        type: Date,
        required: true,
      },
      endDate: {
        // dateFin
        type: Date,
        required: true,
      },
      reason: {
        // raison
        type: String,
        required: true,
      },
    },
  ],
  holidaysCount: {
    // nbJoursFeries
    // Nombre de semaines travaillées
    type: Number,
  },
  weeksCount: {
    // nbSemaines
    // Nombre de semaines travaillées
    type: Number,
  },
  workingDaysCount: {
    // nbJoursTravailles
    // valeur calculable des jours travaillés
    type: Number,
  },
  nonWorkingDaysCount: {
    // nbJoursNonTravailles
    // valeur calculable des jours non travaillés
    type: Number,
  },
  month: {
    // mois
    // Mois du saisi
    type: String,
  },
  monthStartDate: {
    // date_debut_du_mois
    type: Date,
  },
  monthEndDate: {
    // date_fin_du_mois
    type: Date,
  },
  year: {
    // annee
    // L'année de la saisi
    type: String,
  },
  craType: {
    // craType
    // Type de Cra
    type: String,
  },
  project: {
    // projet
    // Projet à laquelle le consultant a travaillé
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  rejectionApproval: {
    // confirmation_refus
    // les détails de confirmation et/ou refus de son CRA
    approvedAt: {
      // date_confirmation
      type: Date,
    },
    rejectedAt: {
      //date_refus
      type: Date,
    },
    approvedBy: {
      // confirmedBy
      // Le nom du manager
      type: String,
    },
    approved_by_manager: {
      // confirmed_by_manager
      // La confirmation et la validation d'un CRA d'un Consultant
      type: Boolean,
      default: false,
    },
    rejected_by_manager: {
      // refused_by_manager
      // Le  refus d'un CRA d'un Consultant avec une raison.
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      // raison_refus
      // raison du refus
      type: String,
    },
  },
  status: {
    // status
    type: String, // Validé / Refusé / En Attente
    // RG : Si confirmed_by_manager = false & refused_by_manager = false
    enum: ["rejected", "approved", "pending"], // ["Refusee", "Validee", "En Attente"]
    default: "pending",
    required: true,
  },
  activityReportSubmittedAt: {
    // date_saisiCra
    // la date de saisi du CRA
    type: Date,
    default: Date.now,
  },
  remoteWorkingDaysCount: {
    // nb_tt_du_mois
    // Nombre de jours en Télétravail
    type: Number,
  },
  is_deleted: {
    // is_deleted
    type: Boolean,
    default: true,
  },
});

const CRA = model("CRA", schema);

export default CRA;
