import { model, Schema } from "mongoose";

const schema = new Schema({
  name: {
    // nom
    type: String,
    required: true,
  },
  projectCode: {
    // codeProjet
    type: String,
    required: true,
  },
  description: {
    // description
    type: String,
    required: true,
  },
  startDate: {
    // dateDebut
    type: Date,
    required: false,
  },
  endDate: {
    // dateFin
    type: Date,
    required: false,
  },
  category: {
    // categorie
    type: String,
    required: true,
  },
  client: {
    // client
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  consultants: [
    {
      // consultants
      type: Schema.Types.ObjectId,
      ref: "Consultant",
    },
  ],
  manager: {
    // manager
    type: Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  createdAt: {
    // date_creation
    type: Date,
    default: Date.now()
  },
});

const Project = model("Project", schema);

export default Project;
