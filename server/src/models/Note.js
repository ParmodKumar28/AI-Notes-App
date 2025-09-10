import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Untitled" },
    audioUrl: { type: String, required: true },
    transcript: { type: String, required: true },
    summary: { type: String, default: "" },
    hasSummary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);

