import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import {
  uploadVideo,
  download,
  videoById,
} from "../Controller/video.controller.js";
import fs from "fs";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir), // Folder for temporary storage
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

export function Routes(server) {
  // Video upload route
  server.post("/videos/upload", upload.single("video"), uploadVideo);
  server.get("/videos/:id/download", download);
  server.get("/video/:id", videoById);
}
