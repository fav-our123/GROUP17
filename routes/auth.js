import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js"; // your pg Pool

const router = express.Router();

// --- Register Admin ---
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO admins (username, password, created_at) VALUES ($1, $2, NOW())",
      [username, hashed]
    );

    res.json({ message: "✅ Admin registered successfully" });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// --- Login Admin ---
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "✅ Login successful",
      token,
      user: { id: admin.id, username: admin.username }
    });
  } catch (err) {
    console.error("Error logging in admin:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;