const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');


const router = express.Router();


// ensure uploads folder exists in backend/uploads (create it manually)
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});


const upload = multer({
storage,
fileFilter: (req, file, cb) => {
if (file.mimetype !== 'application/pdf') return cb(new Error('Only PDF files allowed'), false);
cb(null, true);
},
limits: { fileSize: 10 * 1024 * 1024 }
});


// Upload PDF (protected)
router.post('/pdf', auth, upload.single('file'), async (req, res) => {
if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
try {
await db.query('INSERT INTO results (filename) VALUES (?)', [req.file.filename]);
res.json({ message: 'File uploaded', filename: req.file.filename });
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// List PDFs (public)
router.get('/pdfs', async (req, res) => {
try {
const [rows] = await db.query('SELECT * FROM results ORDER BY uploaded_at DESC');
res.json(rows);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


module.exports = router;