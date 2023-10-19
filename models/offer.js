import { model, Schema } from "mongoose";

const schema = new Schema({
  name: { // nom
    type: String,
    required: true,
  },
  description: { // description
    type: String,
    required: true,
  },
  trialPeriod: { // dureeEssai (jours)
    type: Number,
    required: true,
  },
  price: { // prix
    type: Number,
    required: true,
  },
  features: { // fonctionnalitesIncluses
    type: [String],
    required: true,
  },
  createdAt: {
    // date_creation
    type: Date,
    default: Date.now(),
  },
  // Autres champs spécifiques à l'offre
});

const Offer = model("Offer", schema);

export default Offer;
