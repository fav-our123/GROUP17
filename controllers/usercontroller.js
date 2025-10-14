// controllers/userController.js
import db from "../db.js";

// 📰 Get all announcements
export async function getAnnouncements(req, res) {
  try {
    const result = await db.query("SELECT * FROM announcements ORDER BY created_at DESC");
    res.json({ success: true, announcements: result.rows });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ success: false, message: "Server error while fetching announcements." });
  }
}

// 📂 Get all results
export async function getResults(req, res) {
  try {
    const result = await db.query("SELECT * FROM results ORDER BY uploaded_at DESC");
    res.json({ success: true, results: result.rows });
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ success: false, message: "Server error while fetching results." });
  }
}