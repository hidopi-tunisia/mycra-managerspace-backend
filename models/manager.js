import { model, Schema } from "mongoose";

const schema = new Schema({
  _id: {
    // _id
    type: Schema.Types.ObjectId,
    required: true,
  },
  firstName: {
    // prenom
    type: String,
    required: true,
  },
  lastName: {
    // nom
    type: String,
    required: true,
  },
  email: {
    // email
    type: String,
    required: true,
    unique: true,
  },
  company: {
    // entreprise
    companyName: {
      // nomSocial
      type: String,
      required: true,
    },
    siret: {
      // siret
      type: String,
      required: true,
    },
    address: {
      // adresse
      street: {
        //
        type: String,
        required: true,
      },
      zipCode: {
        // codePostal
        type: String,
        required: true,
      },
      city: {
        // ville
        type: String,
        required: true,
      },
    },
    phone: {
      // numeroTelephone
      type: String,
      required: true,
    },
  },
  trialPeriod: {
    // periodeDessai
    start: {
      // debut
      type: Date,
      default: Date.now,
    },
    end: {
      // fin
      type: Date,
      required: true,
    },
    expired: {
      // expiree
      type: Boolean,
      default: false,
    },
  },
  offer: {
    // offre
    type: Schema.Types.ObjectId,
    ref: "Offer",
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
  accountStatus: {
    // statutCompte
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
});

const Manager = model("Manager", schema);

export default Manager;
