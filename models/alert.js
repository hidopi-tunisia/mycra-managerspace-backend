import { model, Schema } from "mongoose";

const schema = new Schema({
  content: {
    type: String,
    required: true,
  },
  satisfaction: {
    type: Number,
  },
  isRead: {
    type: Boolean,
    default: false
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  consultant:{
    type: Schema.Types.ObjectId,
    ref: "Consultant",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Alert = model("Alert", schema);

export default Alert;
