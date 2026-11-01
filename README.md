# CampusCare Enterprise v2.0 — Full-Stack Campus Maintenance, SLA & Grievance Platform

**CampusCare Enterprise v2.0** is a ground-up, production-grade full-stack rebuild of [`hey-meridian/campus-care`](https://github.com/hey-meridian/campus-care). It replaces the original client-only `localStorage` mini-project with a real relational database architecture, JWT authentication, Role-Based Access Control (RBAC), real-time multi-device synchronization, automated SLA tracking, a Technician Work-Order Console, an interactive Analytics & SLA Command Center, and a Confidential Anti-Ragging & Safety Ombudsperson Portal.

---

## 1. How Every Drawback in the Original Project Was Solved

| Original Drawback (`hey-meridian/campus-care`) | Industry-Grade Solution in CampusCare v2.0 |
| :--- | :--- |
| **No Backend / `localStorage` Volatility** (`campuscare_complaints` lost on cache clear or incognito) | **ACID-Compliant SQLite3 Relational Database** (`users`, `complaints`, `complaint_timeline`, `complaint_upvotes`, `confidential_reports`, `audit_logs`) with **Node.js + Express** (`server/server.js`) AND a **Zero-Dependency Python 3 + SQLite Server** (`backend_python/server.py`). |
| **Insecure Hardcoded PIN (`2468`)** in `script.js` | **JWT (HMAC-SHA256) Authentication + PBKDF2/Bcrypt Password Hashing + RBAC Middleware** (`student`, `technician`, `admin`) with server-side role verification and immutable security audit logs. |
| **No Multi-User / Cross-Device Sync** | **Server-Sent Events (`GET /api/stream`) + `BroadcastChannel` Live Sync** pushes newly created complaints, status changes, upvotes, and escalations across browsers and tabs in real time. |
| **Excludes Anti-Ragging & External Escalation Portals** | **Confidential Safety, Anti-Ragging & Multi-Tier SLA Escalation Module** with zero-knowledge anonymous reporting, encrypted tracking tokens (`SAFE-XXXX-XX`), 3-tier administrative escalation (HOD/Warden -> Dean of Student Welfare -> Campus Director/UGC Helpline), and emergency quick-dispatch. |
| **Static Multi-Page UI with Minimal Workflow** | **Modern Responsive SPA (`public/index.html`)** with Dark/Light themes, Command Palette (`Ctrl+K` / `Cmd+K`), Kanban Board + Table + Card views, SLA countdown badges, Community Upvoting ("Affects Me Too"), Step-by-Step Audit Timeline, Chart.js Analytics, CSV/JSON Export, and 5-Star Resolution Verification. |

---

## 2. Project Structure

```text
campus-care-v2/
├── package.json                 # Node.js dependencies & npm scripts
├── .env.example                 # Environment variables template (PORT, JWT_SECRET, DB_PATH)
├── README.md                    # Architecture, API documentation, and setup guide
├── server/
│   ├── server.js                # Express REST API + Server-Sent Events (SSE) real-time hub
│   ├── db.js                    # SQLite3 relational schema, SLA calculator, and seed data
│   └── middleware/
│       └── auth.js              # JWT token signing/verification, RBAC, and audit logging
├── backend_python/
│   └── server.py                # Zero-dependency Python 3 + SQLite3 REST API server alternative
└── public/
    └── index.html               # Self-contained responsive SPA (Dual-Mode Live API + Fallback)
```

---

## 3. Quick Start Guide

### Option A: Run with Node.js + Express + SQLite
```bash
npm install
cp .env.example .env
npm start
# Open http://localhost:3000
```

### Option B: Run Instantly with Python 3 (Zero External Dependencies)
```bash
python3 backend_python/server.py
# Open http://localhost:3000
```

### Demo Role Credentials (Pre-Seeded in Database)
| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `aarav.sharma@campus.edu` | `Student@123` | Submit complaints, attach diagnostic tags, upvote issues, escalate overdue tickets, rate resolved issues |
| **Technician / Staff** | `rajesh.elec@campus.edu` | `Tech@123` | View assigned department work orders, update status (`Triaged`, `In Progress`, `Verification Pending`, `Resolved`), log technical remarks |
| **Administrator** | `dean.estates@campus.edu` | `Admin@2026` | Full command center access, technician dispatch, SLA monitoring, confidential safety docket review, audit logs, CSV/JSON export, seed reset |

---

## 4. REST API Endpoints

- `GET /api/health` — Service health, database mode, and active real-time client count
- `GET /api/stream` — Server-Sent Events (SSE) stream for live cross-device updates
- `POST /api/auth/login` — Authenticate with email/password and receive a signed JWT
- `POST /api/auth/register` — Register a new Student or Technician account
- `GET /api/complaints` — List complaints with search, category, status, and priority filters, enriched with chronological audit timelines
- `POST /api/complaints` — Create a new complaint (`CMP001`...), auto-assign department, and compute SLA deadline (`Critical`: 4h, `High`: 24h, `Medium`: 48h, `Low`: 72h)
- `PATCH /api/complaints/:id/status` — *(Admin/Technician RBAC)* Update status, assignee, and technical remarks
- `POST /api/complaints/:id/upvote` — Toggle "Affects Me Too" community impact upvote
- `POST /api/complaints/:id/escalate` — Trigger multi-tier escalation (Levels 1–3)
- `POST /api/complaints/:id/feedback` — Submit 1–5 star student verification rating on resolved tickets
- `GET /api/confidential` & `POST /api/confidential` — Submit or look up zero-knowledge Confidential Anti-Ragging & Safety reports by token (`SAFE-XXXX-XX`)
- `GET /api/analytics` — Aggregated SLA compliance metrics, category distribution, and security audit logs


## Presentation showcase data and 24-hour service window

The frontend seeds 30 fictional showcase complaints in browser local storage (4 original examples plus 26 additional sample issues). These records are for a classroom presentation/demo only. They are not real campus reports. Existing locally saved complaints are preserved and the showcase records are added if their ticket IDs are missing.

The public landing page displays the full complaint wall in a vertically scrollable card grid with ticket/category/status filters and newest, oldest, and most-upvoted sorting. Each complaint shows its current status and a 24-hour service-window indicator calculated from its report timestamp. Open issues show time remaining or overdue duration; resolved issues show whether they were closed within or after the 24-hour window.

The 24-hour window is presented as a service target, not a guaranteed repair promise. Weekend work and specialist/parts availability can extend resolution time. No student account/login is required for the current demonstration flow. The existing admin demo gate remains unchanged.

For presentation use, keep the records fictional and do not enter real student or sensitive information.


## Complaint directory placement (v4 placement correction)

The landing page keeps its original three featured complaint cards and the existing homepage layout. The full 30-record complaint directory, category/status/ticket filters, sorting, vertical scrolling, upvotes, tracking actions and 24-hour SLA indicators are displayed inside Student Portal → All Campus Issues. The student portal's plain complaint table has been replaced by the card layout; the admin dashboard remains a table-based management view.


## Final approved landing-page artwork

The landing-page hero uses `public/assets/campuscare-hero-final.png`. The approved illustration replaces the CSS-drawn campus artwork and contains the final callouts:
- **24-Hour Resolution** — We aim to resolve every report within 24 hours.
- **Track at Every Step** — Follow your report from submission to resolution.

The weekend/specialist-team caveat remains in the separate homepage copy, not inside the illustration. Keep the image in the same `public/assets` path when deploying or moving the project.
