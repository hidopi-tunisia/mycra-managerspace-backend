import { Schema, model } from "mongoose";

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
      start: {
        type: Date,
      },
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
        value: { type: String },
      },
    },
  ],
  submittedAt: {
    // date_saisiCra
    // la date de saisi du CRA
    type: Date,
    default: Date.now,
  },
  status: {
    // status
    type: String, // Validé / Refusé / En Attente
    // RG : Si confirmed_by_manager = false & refused_by_manager = false
    enum: ["rejected", "approved", "pending"], // ["Refusee", "Validee", "En Attente"]
    default: "pending",
    required: true,
    meta: Schema.Types.Mixed,
  },
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
    default: false,
  },
});

const CRA = model("CRA", schema);

export default CRA;
