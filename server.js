// --- All your imports & setups here ---
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Only one CORS setup
app.use(cors({ origin: "*", credentials: true }));

// --- Path setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../FRONTEND");
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

app.use(express.static(frontendPath));
app.use("/uploads", express.static(uploadPath));

// --- Database setup ---
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "futo_dept",
});

db.connect((err) => {
  if (err) console.error("❌ MySQL Connection Error:", err);
  else console.log("✅ Connected to MySQL Database!");
});

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// --- ROUTES ---

// 🧱 Test
app.get("/", (req, res) => res.send("✅ FUTO Dept Server Running!"));

// 📰 Announcements
app.post("/admin/announcement", (req, res) => {
  const { title, message } = req.body;
  if (!title || !message)
    return res.status(400).json({ message: "Missing title or message" });

  db.query(
    "INSERT INTO announcements (title, message, created_at) VALUES (?, ?, NOW())",
    [title, message],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "✅ Announcement posted!" });
    }
  );
});

app.get("/user/announcements", (req, res) => {
  db.query("SELECT * FROM announcements ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// 📂 Upload Result
app.post("/admin/upload-result", upload.single("resultFile"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrl = `/uploads/${req.file.filename}`;
  db.query(
    "INSERT INTO results (filename, file_path, uploaded_at) VALUES (?, ?, NOW())",
    [req.file.originalname, fileUrl],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "✅ Result uploaded!", fileUrl });
    }
  );
});

app.get("/user/results", (req, res) => {
  db.query("SELECT * FROM results ORDER BY uploaded_at DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// ✅ IMPORTANT: Catch-all comes last
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));