import { Schema, model } from "mongoose";

const Statuses = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

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
  linkedIn: {
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
  status: {
    // statutCompte
    type: String,
    enum: [Statuses.ACTIVE, Statuses.INACTIVE],
    default: Statuses.ACTIVE,
    required: true,
  },
  projects: [
    // projet
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  supervisor: {
    // supervisor
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  createdAt: {
    // dateCreation
    type: Date,
    default: Date.now(),
  },
});

const Consultant = model("Consultant", schema);

export default Consultant;
