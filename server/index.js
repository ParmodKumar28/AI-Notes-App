import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import notesRouter from "./src/routes/notes.js";
import errorHandler from "./src/middleware/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDB();

// app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/notes", notesRouter);

app.get("/health", (_, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
