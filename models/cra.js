import { Schema, model } from "mongoose";
import { Roles } from "../middlewares/check-group.js";

export const CRAStatuses = {
  SUBMITTED: "submitted",
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
      type: Number,
    },
    year: {
      type: Number,
    },
    start: {
      type: Number,
    },
    end: {
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
    // week-ends
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
    // RG : Si confirmed_by_supervisor = false & refused_by_supervisor = false
    enum: [CRAStatuses.PENDING, CRAStatuses.APPROVED, CRAStatuses.REJECTED], // ["Refusee", "Validee", "En Attente"]
    default: CRAStatuses.PENDING,
    required: true,
  },
  history: [
    {
      action: {
        type: String,
        enum: [CRAStatuses.SUBMITTED, CRAStatuses.APPROVED, CRAStatuses.REJECTED],
      },
      meta: {
        at: { type: Date },
        by: {
          _id: { type: String },
          role: {
            type: String,
            enum: [
              Roles.ADMIN,
              Roles.SUPERVISOR,
              Roles.CONSULTANT,
              Roles.CLIENT,
            ],
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
