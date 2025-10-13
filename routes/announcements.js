import express from "express";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// --- Create Announcement (Admin only) ---
router.post("/", auth, async (req, res) => {
  const { title, message } = req.body;
  if (!title?.trim() || !message?.trim()) {
    return res.status(400).json({ message: "Both title and message are required." });
  }

  try {
    const result = await db.query(
      "INSERT INTO announcements (title, body, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [title.trim(), message.trim()]
    );
    res.status(201).json({
      message: "✅ Announcement posted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error posting announcement:", error);
    res.status(500).json({ message: "Server error while posting announcement." });
  }
});

// --- Get All Announcements (Public) ---
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM announcements ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Server error while fetching announcements." });
  }
});

export default router;