import { model, Schema } from "mongoose";

const schema = new Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dureeEssai: {
    type: Number,
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  fonctionnalitesIncluses: {
    type: [String],
    required: true,
  },
  // Autres champs spécifiques à l'offre
});

const Offre = mongoose.model("Offre", schema);

export default Offre;
