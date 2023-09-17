import { model, Schema } from "mongoose";

export const Statuses = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

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
  supervisor: {
    // supervisor
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  consultants: [
    // consultants
    {
      type: Schema.Types.ObjectId,
      ref: "Consultant",
    },
  ],
  status: {
    type: String,
    enum: [Statuses.ACTIVE, Statuses.INACTIVE],
    default: Statuses.INACTIVE,
  },
  createdAt: {
    // date_creation
    type: Date,
    default: Date.now(),
  },
});

const Project = model("Project", schema);

export default Project;
