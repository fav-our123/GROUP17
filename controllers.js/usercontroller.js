const db = require("../db");

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM announcements ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ message: "Server error while fetching announcements." });
  }
};

// Get all results
exports.getResults = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM results ORDER BY uploaded_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ message: "Server error while fetching results." });
  }
};