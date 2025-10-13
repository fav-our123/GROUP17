import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// --- Upload PDF (Admin only) ---
router.post("/pdf", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    await db.query(
      "INSERT INTO results (filename, file_path, uploaded_at) VALUES ($1, $2, NOW())",
      [req.file.originalname, fileUrl]
    );
    res.json({ message: "✅ File uploaded", filename: req.file.originalname, fileUrl });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "Database error while saving file" });
  }
});

// --- List PDFs (Public) ---
router.get("/pdfs", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM results ORDER BY uploaded_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching PDFs:", err);
    res.status(500).json({ message: "Database error while fetching results" });
  }
});

export default router;