import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  const ok = [
    "audio/webm",
    "audio/mpeg",
    "audio/wav",
    "audio/mp4",
    "audio/ogg",
  ].includes(file.mimetype);
  cb(null, ok);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});
