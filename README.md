# CampusCare v4.1

CampusCare is a college project prototype for reporting, browsing, tracking, and managing campus maintenance complaints. This v4.1 release focuses on the student-facing experience, a 24-hour service-window indicator, and a cleaner campus-themed landing page.

> **Project status:** Classroom/demo prototype. It is not a production-ready college grievance system. Use fictional data for demonstrations and do not submit real student or sensitive information.

## What’s included in v4.1

### Student experience
- Landing page with three featured complaint cards, showing the three most recently reported issues.
- Student Portal with the full showcase complaint directory.
- Complaint cards with category, status, ticket details, and upvote information.
- Search and filters for category, status, and ticket details.
- Sorting by newest, oldest, and upvotes.
- Complaint submission and tracking actions in the student-facing interface.

### 24-hour service window
- Each complaint displays a 24-hour service-window indicator based on its report timestamp.
- Open complaints show the time remaining or how long the 24-hour window has been exceeded.
- Resolved complaints show whether they were resolved within or after the 24-hour window.
- The 24-hour period is a service target shown for the project demonstration, not a guaranteed repair deadline. Actual resolution can depend on weekends, staff availability, specialist support, and parts.

### Admin experience
- Separate admin interface for reviewing and updating complaint status and remarks.
- The admin dashboard retains a table-based management layout.

### Visual design
- Responsive campus-themed interface.
- Final approved hero illustration at `public/assets/campuscare-hero-final.png`.
- Hero callouts:
  - **24-Hour Resolution:** We aim to resolve every report within 24 hours.
  - **Track at Every Step:** Follow your report from submission to resolution.

## Project structure

```text
campus-care/
├── backend_python/
│   └── server.py
├── public/
│   ├── assets/
│   │   └── campuscare-hero-final.png
│   ├── admin.html
│   ├── index.html
│   ├── script.js
│   ├── student.html
│   └── style.css
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Technology

- HTML, CSS, and JavaScript for the frontend.
- Node.js and Express for the primary backend.
- SQLite using `better-sqlite3` for complaint data.
- JWT support for the administrator login flow.
- A Python server alternative is included in `backend_python/server.py`.

## Run locally

### Requirements
- Node.js (LTS recommended) and npm.
- Alternatively, Python 3 for the included Python server.

### Option A: Node.js backend

1. Clone or download this repository.
2. Open a terminal in the project root (the folder containing `package.json`).
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` if you want to configure environment variables.
5. Start the server:

   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000).

The Express server serves the frontend from `public/` and exposes the API routes used by the interface.

### Option B: Python server

Run:

```bash
python3 backend_python/server.py
```

Then open [http://localhost:3000](http://localhost:3000).

Use the Node.js option if you want to run the primary Express backend.

## Demo behaviour and data

- The project includes fictional showcase complaint records for presentation purposes.
- The browser interface has local-storage fallback behaviour when the API is unavailable. Data saved only in browser local storage is specific to that browser/profile and is not a shared central record.
- When the backend is running and reachable, the frontend can use the complaint API.
- The current demonstration admin gate uses a demo passcode. The code contains demo credentials/fallback values; these must be replaced and the authentication, authorization, and data-access controls reviewed before any real deployment.
- Do not expose real student names, IDs, contact details, credentials, or confidential complaints in a public repository or demo.

## API routes in the Node.js server

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check server and database status |
| `POST` | `/api/auth/login` | Administrator login |
| `GET` | `/api/complaints` | Retrieve complaints |
| `POST` | `/api/complaints` | Create a complaint |
| `POST` | `/api/complaints/:id/upvote` | Update complaint upvotes |
| `PATCH` | `/api/complaints/:id` | Update complaint status and/or remark |

## Important deployment notes

- The frontend makes relative API requests, so the frontend and API should be served from the same origin unless the API configuration is deliberately changed.
- A static GitHub Pages deployment can host frontend files, but it cannot run the Node.js or Python backend. Backend API features require a server host.
- SQLite database files and `.env` files should not be committed to GitHub.
- The included code has not been security-audited or validated for production use. Do not treat the demo admin gate or current API as secure authentication for a real institution.
- Before real deployment, configure strong secrets outside source control, restrict CORS and API access, implement proper user authentication and authorization, validate inputs, protect personal data, and use persistent database storage.

## Repository

GitHub: [hey-meridian/campus-care](https://github.com/hey-meridian/campus-care)

## Version

**CampusCare v4.1 | Final showcase release**
