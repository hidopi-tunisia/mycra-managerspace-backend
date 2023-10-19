import { Schema, model } from "mongoose";
const Sexes = {
  MALE: "male",
  FEMALE: "female",
};
const schema = new Schema({
  sex: {
    // sex
    type: String,
    enum: [Sexes.MALE, Sexes.FEMALE],
    required: false,
  },
  lastName: {
    // nom
    type: String,
    required: false,
  },
  firstName: {
    // prenom
    type: String,
    required: false,
  },
  email: {
    // email
    type: String,
    required: true,
    unique: true,
  },
  company: {
    name: {
      // nomSocialEntreprise
      type: String,
      required: true,
    },
    logo: {
      // logo
      type: String,
      required: false,
    },
    siret: {
      // siretEntreprise
      type: String,
      required: true,
    },
    representative: {
      type: String,
      required: true,
    },
    phone: {
      // numeroTelephone
      type: String,
      required: true,
    },
    secondPhone: {
      // deuxiemeNumeroTelephone
      type: String,
    },
    address: {
      // adresse
      street: {
        // rue
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
  },
  note: {
    // note
    type: String,
    maxlength: 500,
  },
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
  contract: {
    signedAt: {
      // dateSignature
      type: Date,
    },
    url: {
      type: String,
    },
  },
});

const Client = model("Client", schema);

export default Client;
