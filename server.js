import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// === PostgreSQL connection ===
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// === Multer (for file uploads if needed) ===
const storage = multer.memoryStorage();
const upload = multer({ storage });

// === Helper ===
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// === Test route ===
app.get("/", (req, res) => {
  res.send("✅ FUTO Dept Server Running!");
});

// === ADMIN LOGIN ===
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query("SELECT * FROM admins WHERE username=$1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const admin = result.rows[0];
    const validPassword = password === admin.password || await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "6h" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// === ANNOUNCEMENTS ===
// Post new announcement (admin)
app.post("/announcements", async (req, res) => {
  try {
    const { title, body } = req.body;
    const date = new Date();

    await db.query("INSERT INTO announcements (title, body, date) VALUES ($1, $2, $3)", [title, body, date]);
    res.json({ message: "Announcement posted successfully" });
  } catch (err) {
    console.error("Announcement error:", err);
    res.status(500).json({ message: "Failed to post announcement" });
  }
});

// Fetch all announcements
app.get("/announcements", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM announcements ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch announcements error:", err);
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
});

// === RESULTS ===
// Upload new result (admin)
app.post("/results", async (req, res) => {
  try {
    const { matric, name, course, grade } = req.body;
    await db.query(
      "INSERT INTO results (matric, name, course, grade) VALUES ($1, $2, $3, $4)",
      [matric, name, course, grade]
    );
    res.json({ message: "Result uploaded successfully" });
  } catch (err) {
    console.error("Result upload error:", err);
    res.status(500).json({ message: "Failed to upload result" });
  }
});

// Get results (public)
app.get("/results", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM results ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch results error:", err);
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

// === SERVER LISTEN ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
