import { Schema, model } from "mongoose";
import { Roles } from "../middlewares/check-group";

export const CRAStatuses = {
  CREATED: "created",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const schema = new Schema({
  type: {
    type: String,
  },
  date: {
    month: {
      // From 0 to 11
      number: {
        type: Number,
      },
      // From 1 to 7
      start: {
        type: Date,
      },
      // From 1 to 7
      end: {
        type: Date,
      },
    },
    year: {
      type: Number,
    },
  },
  working: [
    {
      date: {
        type: String,
        required: true,
      },
      meta: {
        value: { type: String },
      },
    },
  ],
  half: [
    {
      date: {
        type: String,
        required: true,
      },
      meta: {
        value: { type: String },
      },
    },
  ],
  remote: [
    {
      date: {
        type: String,
        required: true,
      },
      meta: {
        value: { type: String },
      },
    },
  ],
  off: [
    {
      date: {
        type: String,
        required: true,
      },
      meta: {
        value: { type: String },
      },
    },
  ],
  unavailable: [
    // indisponibilites
    {
      date: {
        type: String,
        required: true,
      },
      meta: {
        value: { type: String },
      },
    },
  ],
  holidays: [
    // indisponibilites
    {
      date: {
        type: String,
        required: true,
      },
      meta: {
        value: { type: String },
      },
    },
  ],
  weekends: [
    // indisponibilites
    {
      date: {
        type: String,
        required: true,
      },
      meta: {
        value: { type: Number },
      },
    },
  ],
  status: {
    // status
    type: String, // Validé / Refusé / En Attente
    // RG : Si confirmed_by_manager = false & refused_by_manager = false
    enum: [CRAStatuses.PENDING, CRAStatuses.APPROVED, CRAStatuses.REJECTED], // ["Refusee", "Validee", "En Attente"]
    default: CRAStatuses.PENDING,
    required: true,
  },
  history: [
    {
      action: {
        type: String,
        enum: [CRAStatuses.CREATED, CRAStatuses.APPROVED, CRAStatuses.REJECTED],
      },
      meta: {
        at: { type: Date },
        by: {
          _id: { type: String },
          role: {
            type: String,
            enum: [Roles.ADMIN, Roles.MANAGER, Roles.CONSULTANT, Roles.CLIENT],
          },
          motive: { type: String },
        },
      },
    },
  ],
  consultant: {
    // consultant
    // Consultant en question qui a saisi le CRA
    type: Schema.Types.ObjectId,
    ref: "Consultant",
  },
  project: {
    // projet
    // Projet à laquelle le consultant a travaillé
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  isDeleted: {
    // is_deleted
    type: Boolean,
  },
});

const CRA = model("CRA", schema);

export default CRA;
