import db from "../db/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth.js";

// === Register new admin ===
export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("DB error in registerAdmin:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Admin registered successfully", id: result.insertId });
    });
  } catch (err) {
    console.error("Server error in registerAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// === Login admin ===
export const loginAdmin = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  const sql = "SELECT * FROM admins WHERE username = ?";
  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("DB error in loginAdmin:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const admin = result[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: admin.id, username: admin.username }
    });
  });
};

// === Post announcement (protected) ===
export const postAnnouncement = (req, res) => {
  const { title, message } = req.body;
  if (!title || !message)
    return res.status(400).json({ message: "All fields required" });

  const sql = "INSERT INTO announcements (title, message, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)";
  db.query(sql, [title, message], (err) => {
    if (err) {
      console.error("DB error in postAnnouncement:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Announcement posted successfully" });
  });
};

// === Get announcements (for students) ===
export const getAnnouncements = (req, res) => {
  const sql = "SELECT * FROM announcements ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB error in getAnnouncements:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};