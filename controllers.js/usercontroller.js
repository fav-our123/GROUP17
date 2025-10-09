import db from "../db/connection.js";

// Get all announcements for students
export const getAnnouncements = (req, res) => {
  const sql = "SELECT * FROM announcements ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB error in getAnnouncements:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0) {
      return res.json({ message: "No announcements yet", data: [] });
    }
    res.json(result);
  });
};

// Get all results for students
export const getResults = (req, res) => {
  const sql = "SELECT * FROM results ORDER BY uploaded_at DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB error in getResults:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0) {
      return res.json({ message: "No results yet", data: [] });
    }
    res.json(result);
  });
};