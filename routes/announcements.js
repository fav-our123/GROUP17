const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * POST /api/announcements
 * Create a new announcement (Admin only)
 */
router.post('/', auth, async (req, res) => {
  const { title, message } = req.body;

  if (!title?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Both title and message are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO announcements (title, message, created_at) VALUES (?, ?, NOW())',
      [title.trim(), message.trim()]
    );

    const [newAnnouncement] = await db.query(
      'SELECT * FROM announcements WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: '✅ Announcement posted successfully.',
      data: newAnnouncement[0],
    });
  } catch (error) {
    console.error('Error posting announcement:', error);
    res.status(500).json({ message: 'Server error while posting announcement.' });
  }
});

/**
 * GET /api/announcements
 * Retrieve all announcements (Public route)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error while fetching announcements.' });
  }
});

module.exports = router;