import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  transcript: { type: String, required: true },
  duration: { type: Number }, // in seconds
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversation", conversationSchema);
