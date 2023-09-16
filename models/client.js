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
  supervisorFullName: {
    // nomCompletResponsable
    type: String,
    required: true,
  },
  companyName: {
    // nomSocialEntreprise
    type: String,
    required: true,
  },
  siret: {
    // siretEntreprise
    type: String,
    required: true,
  },
  signatureDate: {
    // dateSignature
    type: Date,
  },
  observation: {
    // observation
    type: String,
  },
  createdAt: {
    // dateCreation
    type: Date,
    default: Date.now(),
  },
  projects: [
    // projets
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  manager: {
    // manager
    type: Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
});

const Client = model("Client", schema);

export default Client;
