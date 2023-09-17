import { Schema, model } from "mongoose";

const schema = new Schema({
  civility: {
    // civilite
    type: String,
    required: true,
  },
  lastName: {
    // nom
    type: String,
    required: true,
  },
  firstName: {
    // prenom
    type: String,
    required: true,
  },
  profilePhoto: {
    // photo_profil
    type: String,
  },
  email: {
    // email
    type: String,
    required: true,
    unique: true,
  },
  availableAt: {
    // dateDisponibilite
    type: Date,
    required: true,
  },
  hiredAt: {
    // dateEmbauche
    type: Date,
    required: true,
  },
  skillsPortfolio: {
    // dossierCompetence
    type: String,
    required: false,
  },
  linkedInProfile: {
    // profilLinkedIn
    type: String,
    required: false,
  },
  skills: [
    // competences
    {
      type: String,
    },
  ],
  position: {
    // poste
    type: String,
    required: true,
  },
  yearsOfExperience: {
    // anneesExperience
    type: Number,
    required: true,
  },
  phone: {
    // numeroTelephone
    type: String,
    required: true,
  },
  note: {
    // note
    type: String,
    maxlength: 500,
  },
  createdAt: {
    // date_creation
    type: Date,
    default: Date.now()
  },
  projects: [
    // projet
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  hasAcceptedTermsAndConditions: {
    // aAccepteCGU
    type: Boolean,
    default: false,
    required: true,
  },
  acceptedTermsAndConditionsVersion: {
    // cguVersionAcceptee
    type: String,
    default: "",
  },
  accountStatus: {
    // statutCompte
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  supervisor: {
    // supervisor
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
});

const Consultant = model("Consultant", schema);

export default Consultant;
