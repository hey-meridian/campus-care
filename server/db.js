const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'campuscare.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      studentName TEXT NOT NULL,
      studentId TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      upvotes INTEGER NOT NULL DEFAULT 1,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      remark TEXT DEFAULT ''
    );
  `);

  const count = db.prepare('SELECT COUNT(*) AS cnt FROM complaints').get().cnt;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO complaints (id, studentName, studentId, category, location, description, priority, status, upvotes, date, time, remark)
      VALUES (@id, @studentName, @studentId, @category, @location, @description, @priority, @status, @upvotes, @date, @time, @remark)
    `);
    const samples = [
      {
        id: 'CC-2026-4821',
        studentName: 'Aarav Sharma',
        studentId: '2604827',
        category: 'Fan, AC & Electrical',
        location: 'CSE Block - Room 204',
        description: 'Ceiling fan is making a loud bearing noise and wall regulator is not working.',
        priority: 'High',
        status: 'Pending',
        upvotes: 19,
        date: '19 Sep 2026',
        time: '09:15 AM',
        remark: 'Assigned to electrical maintenance wing.'
      },
      {
        id: 'CC-2026-7394',
        studentName: 'Priya Verma',
        studentId: '2601936',
        category: 'Sanitation & Water Cooler',
        location: 'Hostel Block B - First Floor',
        description: 'RO water cooler is dispensing warm water and filter indicator is blinking.',
        priority: 'High',
        status: 'In Progress',
        upvotes: 31,
        date: '18 Sep 2026',
        time: '11:40 AM',
        remark: 'Maintenance team is replacing the RO filter cartridge and checking compressor.'
      },
      {
        id: 'CC-2026-5108',
        studentName: 'Rohan Singh',
        studentId: '2607054',
        category: 'Furniture & Lab Damage',
        location: 'Mechanical CAD Lab',
        description: 'Four ergonomic lab chairs near stations 12-15 have damaged hydraulic levers.',
        priority: 'Low',
        status: 'Resolved',
        upvotes: 8,
        date: '17 Sep 2026',
        time: '02:20 PM',
        remark: 'Replacement chairs have been placed in the lab.'
      },
      {
        id: 'CC-2026-9263',
        studentName: 'Ananya Gupta',
        studentId: '2608612',
        category: 'Internet & Network',
        location: 'Central Library - 3rd Floor',
        description: 'Wi-Fi connection drops frequently during evening study hours.',
        priority: 'Medium',
        status: 'In Progress',
        upvotes: 24,
        date: '16 Sep 2026',
        time: '04:05 PM',
        remark: 'Network team is installing a secondary access point in the reading hall.'
      }
    ];
    for (const s of samples) insert.run(s);
  }
}

module.exports = { db, initDb };
