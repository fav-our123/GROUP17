import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// --- Register Admin ---
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }

  try {
    const hashed = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);
    await db.query(
      "INSERT INTO admins (username, password, created_at) VALUES ($1, $2, NOW())",
      [username, hashed]
    );
    res.json({ success: true, message: "✅ Admin registered successfully" });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ success: false, message: "Database error" });
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
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const { id, password: hashedPassword } = result.rows[0];
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id, username },
      process.env.JWT_SECRET, // no fallback in production
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "✅ Login successful",
      token,
      user: { id, username }
    });
  } catch (err) {
    console.error("Error logging in admin:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

export default router;