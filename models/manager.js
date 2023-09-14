import { model, Schema } from "mongoose";

const schema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  motDePasse: {
    type: String,
    required: true,
  },
  consultants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Consultant",
    },
  ],
  clients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
  ],
  entreprise: {
    nomSocial: {
      type: String,
      required: true,
    },
    siret: {
      type: String,
      required: true,
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
    numeroTelephone: {
      type: String,
      required: true,
    },
  },
  periodeDessai: {
    debut: {
      type: Date,
      default: Date.now,
    },
    fin: {
      type: Date,
      required: true,
    },
    expiree: {
      type: Boolean,
      default: false,
    },
  },
  offre: {
    type: Schema.Types.ObjectId,
    ref: "Offre",
  },
  aAccepteCGU: {
    type: Boolean,
    default: false,
    required: true,
  },
  cguVersionAcceptee: {
    type: String,
    default: "",
  },
  statutCompte: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  role: {
    type: String,
    enum: ["manager", "consultant", "admin"],
    required: true,
    default: "manager", // Définissez le rôle par défaut
  },
  firebaseToken: {
    type: String, // Token d'authentification Firebase
    required: false,
  },
});

const Manager = model("Manager", schema);

export default Manager;
