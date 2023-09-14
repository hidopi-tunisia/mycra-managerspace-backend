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
  trialPeriod: { // dureeEssai
    type: Number,
    required: true,
  },
  price: { // prix
    type: Number,
    required: true,
  },
  includedFeatures: { // fonctionnalitesIncluses
    type: [String],
    required: true,
  },
  // Autres champs spécifiques à l'offre
});

const Offer = model("Offer", schema);

export default Offer;
