import { Router } from "express";
import upload from "../middleware/upload.js";
import {
  createNote,
  listNotes,
  updateNote,
  deleteNote,
  summarizeNote,
} from "../controllers/noteController.js";

const router = Router();

router.get("/", listNotes);
router.post("/", upload.single("audio"), createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/summarize", summarizeNote);

export default router;

