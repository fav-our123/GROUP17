import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// === MySQL connection ===
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_mysql_password", // replace this
  database: "futo_portal"          // replace with your db name
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ MySQL Connected!");
  }
});

// === Admin Login Endpoint ===
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  const sql = "SELECT * FROM admin WHERE username = ?";
  db.query(sql, [username], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0)
      return res.status(401).json({ message: "User not found" });

    const admin = result[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match)
      return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: { id: admin.id, username: admin.username },
    });
  });
});

// === Start server ===
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
import bcrypt from "bcryptjs";
const hash = await bcrypt.hash("yourpassword", 10);
// Insert into DB: INSERT INTO admin (username, password) VALUES ('admin', 'the_hash_here');
