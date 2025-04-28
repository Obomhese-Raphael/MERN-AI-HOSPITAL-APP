// backend/models/Call.js
import mongoose from "mongoose";

const CallSchema = new mongoose.Schema({
  callId: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    type: String,
    required: true,
  },
  transcript: {
    type: String,
  },
  analysis: {
    type: Object,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Call || mongoose.model("Call", CallSchema);
