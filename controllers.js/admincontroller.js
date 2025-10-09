import db from "../db/connection.js";

export const registerAdmin = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing fields" });

  const sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Admin registered successfully", id: result.insertId });
  });
};

export const loginAdmin = (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM admins WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", user: result[0] });
  });
};

export const postAnnouncement = (req, res) => {
  const { title, message } = req.body;
  if (!title || !message)
    return res.status(400).json({ message: "All fields required" });

  const sql = "INSERT INTO announcements (title, message) VALUES (?, ?)";
  db.query(sql, [title, message], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Announcement posted successfully" });
  });
};
