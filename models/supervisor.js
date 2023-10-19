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
    name: {
      // nomSocial
      type: String,
      required: true,
    },
    siret: {
      // siret
      type: String,
      required: true,
    },
    logo: {
      // logo
      type: String,
      required: false,
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
      }
    },
    phone: {
      // numeroTelephone
      type: String,
      required: true,
    },
    secondPhone: {
      // numeroTelephone2
      type: String,
      required: false,
    },
    social: {
      website: {
        // website
        type: String,
        required: false,
      },
      facebook_link: {
        // facebook
        type: String,
        required: false,
      },
      instagram_page: {
        // instagram
        type: String,
        required: false,
      },
      x: {
        // x
        type: String,
        required: false,
      },
      linkedIn_link: {
        // linkedin_link
        type: String,
        required: false,
      }

    },
  },
  trialPeriod: {
    // periodeDessai
    start: {
      // debut
      type: Date,
      default: Date.now()
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
  hasAcceptedTermsAndConditions: {
    // aAccepteCGU
    type: Boolean,
    default: false,
    required: true,
  },
  acceptedTermsAndConditionsVersion: {
    // cguVersionAcceptee
    type: String,
    default: "1.0.0",
  },
  status: {
    // statutCompte
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  offer: {
    // offre
    type: Schema.Types.ObjectId,
    ref: "Offer",
  },
  createdAt: {
    // date_creation
    type: Date,
    default: Date.now(),
  },
});

const Supervisor = model("Supervisor", schema);

export default Supervisor;
