const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

// Database connection (for routes)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myappdb'
});

// --- Register Admin ---
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO admins (username, password) VALUES (?, ?)';

  db.query(sql, [username, hashed], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Admin registered successfully' });
  });
});

// --- Login Admin ---
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admins WHERE username = ?';

  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const admin = results[0];
    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      'mysecretkey',
      { expiresIn: '1h' }
    );

    res.json({ token });
  });
});

module.exports = router;
