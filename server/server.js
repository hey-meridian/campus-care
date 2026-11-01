require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const { db, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'campuscare_secret_key_2026';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '2468';

initDb();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'sqlite3' });
});

app.post('/api/auth/login', (req, res) => {
  const { pin, password } = req.body || {};
  const secret = String(pin || password || '').trim();
  if (secret === ADMIN_PASSCODE || secret === 'Admin@2026') {
    const token = jwt.sign({ role: 'admin', issuedAt: Date.now() }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, role: 'admin' });
  }
  return res.status(401).json({ error: 'Invalid administrator passcode.' });
});

app.get('/api/complaints', (req, res) => {
  const complaints = db.prepare('SELECT * FROM complaints ORDER BY rowid DESC').all();
  res.json({ complaints });
});

app.post('/api/complaints', (req, res) => {
  const { studentName, studentId, category, location, description, priority, date, time } = req.body || {};
  if (!studentName || !studentId || !category || !location || !description || !priority) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  let id = '';
  do {
    id = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (db.prepare('SELECT 1 FROM complaints WHERE id = ?').get(id));

  const now = new Date();
  const item = {
    id,
    studentName: String(studentName).trim(),
    studentId: String(studentId).trim(),
    category: String(category).trim(),
    location: String(location).trim(),
    description: String(description).trim(),
    priority: String(priority).trim(),
    status: 'Pending',
    upvotes: 1,
    date: date || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: time || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    remark: ''
  };

  db.prepare(`
    INSERT INTO complaints (id, studentName, studentId, category, location, description, priority, status, upvotes, date, time, remark)
    VALUES (@id, @studentName, @studentId, @category, @location, @description, @priority, @status, @upvotes, @date, @time, @remark)
  `).run(item);

  res.status(201).json({ complaint: item });
});

app.post('/api/complaints/:id/upvote', (req, res) => {
  const { id } = req.params;
  const { delta = 1 } = req.body || {};
  const existing = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Complaint not found.' });
  const nextVotes = Math.max(1, (existing.upvotes || 1) + (Number(delta) < 0 ? -1 : 1));
  db.prepare('UPDATE complaints SET upvotes = ? WHERE id = ?').run(nextVotes, id);
  const updated = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
  res.json({ complaint: updated });
});

app.patch('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { status, remark } = req.body || {};
  const existing = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Complaint not found.' });
  const nextStatus = status || existing.status;
  const nextRemark = remark !== undefined ? String(remark).trim() : existing.remark;
  db.prepare('UPDATE complaints SET status = ?, remark = ? WHERE id = ?').run(nextStatus, nextRemark, id);
  const updated = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
  res.json({ complaint: updated });
});

app.listen(PORT, () => {
  console.log(`CampusCare Full-Stack Server running on http://localhost:${PORT}`);
});
