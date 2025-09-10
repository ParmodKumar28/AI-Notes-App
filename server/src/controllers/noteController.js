import path from "path";
import mongoose from "mongoose";
import Note from "../models/Note.js";
import { transcribeAudio, summarizeText } from "../services/gemini.js";

export const createNote = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Audio file is required" });
    const audioUrl = `/uploads/${req.file.filename}`;
    console.log("step 1");
    const transcript = await transcribeAudio(
      path.join(process.cwd(), "uploads", req.file.filename)
    );

    console.log("Transcription result:", transcript);

    const note = await Note.create({
      title: req.body.title || "Untitled",
      audioUrl,
      transcript,
      hasSummary: false,
      summary: "",
    });
    console.log("Created note:", note);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const listNotes = async (_req, res, next) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }
    const { title, transcript } = req.body;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (typeof title === "string") note.title = title;
    if (typeof transcript === "string") {
      note.transcript = transcript;
      note.hasSummary = false;
      note.summary = "";
    }
    await note.save();
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const summarizeNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    if (note.hasSummary && note.summary) {
      return res.status(400).json({
        error: "Summary already generated. Edit transcript to regenerate.",
      });
    }
    const summary = await summarizeText(note.transcript);
    note.summary = summary;
    note.hasSummary = true;
    await note.save();
    res.json(note);
  } catch (err) {
    next(err);
  }
};
