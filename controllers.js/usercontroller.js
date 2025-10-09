import db from "../db/connection.js";

export const getAnnouncements = (req, res) => {
  const sql = "SELECT * FROM announcements ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
};

export const getResults = (req, res) => {
  const sql = "SELECT * FROM results ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
};
