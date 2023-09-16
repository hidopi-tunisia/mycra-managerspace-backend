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
        value: { type: String },
      },
    },
  ],
  status: {
    // status
    type: String, // Validé / Refusé / En Attente
    // RG : Si confirmed_by_manager = false & refused_by_manager = false
    enum: ["rejected", "approved", "pending"], // ["Refusee", "Validee", "En Attente"]
    default: "pending",
    required: true,
  },
  history: [
    {
      action: {
        type: String,
        enum: ["created", "rejected", "approved"],
      },
      meta: {
        at: { type: Date },
        by: {
          _id: { type: String },
          role: {
            type: String,
            enum: ["consultant", "admin", "manager", "client"],
          },
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
