import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://group171.onrender.com", "*"],
    credentials: true,
  })
);

// === Path setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../FRONTEND");
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

app.use(express.static(frontendPath));
app.use("/uploads", express.static(uploadPath));

// === Database setup ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// === Multer setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// === Test route ===
app.get("/", (req, res) => res.send("✅ CSC Department Server Running!"));

// === ADMIN LOGIN ===
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received:", username, password);

  // Static credentials for now
  const ADMIN_USERNAME = "admin1";
  const ADMIN_PASSWORD = "12345";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ message: "✅ Login successful", username });
  } else {
    res.status(401).json({ message: "❌ Invalid credentials" });
  }
});

// === ANNOUNCEMENTS ===
app.post("/admin/announcement", async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message)
    return res.status(400).json({ message: "Missing title or message" });

  try {
    await pool.query(
      "INSERT INTO announcements (title, message, created_at) VALUES ($1, $2, NOW())",
      [title, message]
    );
    res.json({ message: "✅ Announcement posted!" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/user/announcements", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM announcements ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// === UPLOAD RESULTS ===
app.post("/admin/upload-result", upload.single("resultFile"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrl = `/uploads/${req.file.filename}`;
  try {
    await pool.query(
      "INSERT INTO results (filename, file_path, uploaded_at) VALUES ($1, $2, NOW())",
      [req.file.originalname, fileUrl]
    );
    res.json({ message: "✅ Result uploaded!", fileUrl });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/user/results", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM results ORDER BY uploaded_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// === Catch-all ===
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// === Start server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
