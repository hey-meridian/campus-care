#!/usr/bin/env python3
"""
CampusCare Zero-Dependency Python 3 + SQLite3 Full-Stack Server
Serves public/ (index.html, student.html, admin.html, style.css, script.js)
and connects them to the SQLite3 REST API (/api/complaints, /api/auth/login).
Run with: python3 backend_python/server.py
"""
import json
import os
import random
import sqlite3
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", 3000))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "server", "campuscare_py.db")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    conn.execute("""
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
      )
    """)
    if conn.execute("SELECT COUNT(*) FROM complaints").fetchone()[0] == 0:
        samples = [
            ("CC-2026-4821", "Aarav Sharma", "2604827", "Fan, AC & Electrical", "CSE Block - Room 204", "Ceiling fan is making a loud bearing noise and wall regulator is not working.", "High", "Pending", 19, "19 Sep 2026", "09:15 AM", "Assigned to electrical maintenance wing."),
            ("CC-2026-7394", "Priya Verma", "2601936", "Sanitation & Water Cooler", "Hostel Block B - First Floor", "RO water cooler is dispensing warm water and filter indicator is blinking.", "High", "In Progress", 31, "18 Sep 2026", "11:40 AM", "Maintenance team is replacing the RO filter cartridge and checking compressor."),
            ("CC-2026-5108", "Rohan Singh", "2607054", "Furniture & Lab Damage", "Mechanical CAD Lab", "Four ergonomic lab chairs near stations 12-15 have damaged hydraulic levers.", "Low", "Resolved", 8, "17 Sep 2026", "02:20 PM", "Replacement chairs have been placed in the lab."),
            ("CC-2026-9263", "Ananya Gupta", "2608612", "Internet & Network", "Central Library - 3rd Floor", "Wi-Fi connection drops frequently during evening study hours.", "Medium", "In Progress", 24, "16 Sep 2026", "04:05 PM", "Network team is installing a secondary access point in the reading hall."),
        ]
        conn.executemany("INSERT INTO complaints VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", samples)
    conn.commit()
    conn.close()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def send_json(self, code, payload):
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self):
        self.send_json(200, {"ok": True})

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/health":
            return self.send_json(200, {"status": "ok", "database": "sqlite3"})
        if parsed.path == "/api/complaints":
            conn = get_db()
            rows = [dict(r) for r in conn.execute("SELECT * FROM complaints ORDER BY rowid DESC").fetchall()]
            conn.close()
            return self.send_json(200, {"complaints": rows})
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length).decode("utf-8") or "{}") if length > 0 else {}

        if parsed.path == "/api/auth/login":
            pin = str(body.get("pin") or body.get("password") or "").strip()
            if pin in ("2468", "Admin@2026"):
                return self.send_json(200, {"token": "jwt-verified-admin-token-2026", "role": "admin"})
            return self.send_json(401, {"error": "Invalid passcode"})

        if parsed.path == "/api/complaints":
            conn = get_db()
            new_id = f"CC-2026-{random.randint(1000, 9999)}"
            item = (
                new_id,
                body.get("studentName", "Student"),
                body.get("studentId", "0000"),
                body.get("category", "Other"),
                body.get("location", "Campus"),
                body.get("description", ""),
                body.get("priority", "Medium"),
                "Pending",
                1,
                body.get("date", "Today"),
                body.get("time", "Just now"),
                "",
            )
            conn.execute("INSERT INTO complaints VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", item)
            conn.commit()
            created = dict(conn.execute("SELECT * FROM complaints WHERE id = ?", (new_id,)).fetchone())
            conn.close()
            return self.send_json(201, {"complaint": created})

        if parsed.path.startswith("/api/complaints/") and parsed.path.endswith("/upvote"):
            cid = urllib.parse.unquote(parsed.path.split("/")[3])
            delta = -1 if int(body.get("delta", 1)) < 0 else 1
            conn = get_db()
            row = conn.execute("SELECT * FROM complaints WHERE id = ?", (cid,)).fetchone()
            if not row:
                conn.close()
                return self.send_json(404, {"error": "Not found"})
            next_v = max(1, int(row["upvotes"]) + delta)
            conn.execute("UPDATE complaints SET upvotes = ? WHERE id = ?", (next_v, cid))
            conn.commit()
            updated = dict(conn.execute("SELECT * FROM complaints WHERE id = ?", (cid,)).fetchone())
            conn.close()
            return self.send_json(200, {"complaint": updated})

        return self.send_json(404, {"error": "Not found"})

    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith("/api/complaints/"):
            cid = urllib.parse.unquote(parsed.path.split("/")[3])
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8") or "{}") if length > 0 else {}
            conn = get_db()
            row = conn.execute("SELECT * FROM complaints WHERE id = ?", (cid,)).fetchone()
            if not row:
                conn.close()
                return self.send_json(404, {"error": "Not found"})
            status = body.get("status") or row["status"]
            remark = body.get("remark") if "remark" in body else row["remark"]
            conn.execute("UPDATE complaints SET status = ?, remark = ? WHERE id = ?", (status, remark, cid))
            conn.commit()
            updated = dict(conn.execute("SELECT * FROM complaints WHERE id = ?", (cid,)).fetchone())
            conn.close()
            return self.send_json(200, {"complaint": updated})
        return self.send_json(404, {"error": "Not found"})


if __name__ == "__main__":
    init_db()
    print(f"CampusCare Python + SQLite3 Server running at http://localhost:{PORT}")
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
