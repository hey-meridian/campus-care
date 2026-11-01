# CAMPUSCARE
## Full-Stack Campus Maintenance Reporting, Complaint Tracking & Service-Workflow Platform

**Release:** v4.1 · **Project phase:** Functional academic prototype / showcase build  
**Frontend:** GitHub Pages · **Primary backend:** Node.js + Express · **Database:** SQLite  
**Live frontend:** https://hey-meridian.github.io/campus-care/  
**Source repository:** https://github.com/hey-meridian/campus-care

---

## 1. Project Overview

CampusCare is a campus-maintenance reporting and complaint-tracking platform designed to bring scattered maintenance requests into one structured digital workflow. It provides a public-facing landing page, a student portal for submitting and following complaints, and an administrator portal for reviewing reports and recording progress updates.

The project was developed through iterative frontend redesign, application-flow refinement, backend/API implementation, database integration, sample-data preparation, deployment configuration, and repository/documentation work.

The central idea is straightforward: a student should be able to report an issue once, receive a unique ticket reference, find that issue again, see whether it is pending or being handled, and understand the latest recorded update. The platform also lets other students indicate that they are affected by an existing issue, helping demonstrate shared demand rather than creating duplicate reports for every person.

CampusCare is currently an academic prototype. It demonstrates a multi-page frontend and backend architecture, but it is not yet a production-ready institutional system. The current authentication and API authorization limitations are documented explicitly in this README.

## 2. Project Objectives

The development work has focused on the following objectives:

1. **Centralised issue reporting:** Provide a consistent form and data structure for campus maintenance complaints.
2. **Traceable complaint records:** Generate a ticket reference that can be used to locate a submitted report.
3. **Visible progress:** Represent the complaint lifecycle through Pending, In Progress and Resolved states.
4. **Shared issue visibility:** Allow students to browse existing reports and upvote issues that affect them.
5. **Administrative workflow:** Give administrators a consolidated view for reviewing reports and recording status/remark updates.
6. **Time-based service visibility:** Display a 24-hour target window, remaining time, overdue time, and resolution timing.
7. **Maintainable architecture:** Separate public pages, frontend behaviour, backend routes, database operations and supporting middleware into distinct files.
8. **Deployable frontend:** Publish the static frontend through GitHub Pages using an automated GitHub Actions workflow.

---

# 3. Complete Feature Set

## 3.1 Public Landing Page

The public landing page is the entry point to CampusCare. It introduces the purpose of the platform and routes visitors toward reporting, browsing and tracking workflows.

### Header and navigation
- CampusCare brand identity and clickable home navigation.
- Navigation anchors for **How it works** and **Why CampusCare**.
- Dedicated entry point for administrator sign-in.
- Consistent navigation and return-home behaviour across the site.

### Hero section
- Clear introduction to campus issue reporting and tracking.
- Ticket-reference lookup field to take a visitor to a specific complaint.
- Supporting copy explaining the reporting-to-resolution workflow.
- Two feature callouts:
  - **24-Hour Resolution:** We aim to resolve every report within 24 hours.
  - **Track at Every Step:** Follow your report from submission to resolution.
- An integrated campus-themed illustration designed as part of the hero composition rather than a separate rectangular promotional image.

### Featured complaints
- Displays only the three most recently reported complaints.
- Uses report timestamps to determine which complaints are newest.
- Keeps the landing page focused and avoids turning it into the entire complaint database.
- Directs visitors to the Student Portal for the complete complaint directory.

### Category navigation
The homepage presents campus issue categories as entry points to the reporting flow. Selecting a category opens the Student Portal form with that category preselected.

Categories represented in the current interface include:
- Classroom & Smartboard
- Fan, AC & Electrical
- Furniture & Lab Damage
- Playground & Sports Kit
- Hostel & Mess Food
- Bus & Campus Transport
- Sanitation & Water Cooler
- Internet & Network
- Other

### Informational sections and footer
- A process explanation for reporting, supporting an existing report and tracking progress.
- Benefit-focused content explaining why a shared reporting channel is useful.
- Footer navigation to student-facing and administrative areas.
- Responsive spacing and layout refinements for different screen widths.

## 3.2 Student Portal

The Student Portal is the student-facing operational area. It combines complaint submission with access to the existing complaint directory.

### Complaint submission
The form collects the information needed to create a structured report:
- Student name
- Student ID
- Issue category
- Campus location
- Issue description
- Priority

The frontend gathers the form values, submits them to the API when the backend is reachable, and uses the returned complaint object to update the interface. The backend checks required fields, assigns a ticket reference, applies the initial status, records a date/time and stores the record.

### Complete complaint directory
- Full complaint directory is located in **Student Portal → All Campus Issues**.
- Student-facing records are presented as vertically arranged cards rather than a dense administrative table.
- Each card can display ticket reference, category, location, description, priority, status, report timing, upvote count and latest remark where available.
- The directory is designed for browsing and scanning rather than administrative bulk editing.

### Search, filters and sorting
The student directory includes:
- Search for a ticket reference.
- Search by issue description.
- Search by location.
- Category filtering.
- Status filtering.
- Sorting by newest.
- Sorting by oldest.
- Sorting by upvote count.

These controls allow a student to narrow a larger list without needing to manually inspect every report.

### Upvote / “Same Issue”
- Students can indicate that an existing report affects them too.
- The displayed support count changes through the upvote workflow.
- The browser stores the current user's upvoted ticket IDs in local storage to maintain the UI state in that browser.
- The API updates the database count and prevents the count from dropping below one.

This is a lightweight demonstration of shared issue support, not identity-verified voting. Browser-local state is not a secure anti-abuse mechanism.

### Complaint tracking
- A ticket reference can be entered from the landing page.
- The portal can display the matching complaint details.
- The status and latest administrative remark provide a simple progress record.
- The ticket lookup flow helps a student return to a known report without searching the entire directory.

## 3.3 Administrator Portal

The administrator area is designed around complaint review and record management rather than public browsing.

### Dashboard and management view
- Administrator sign-in screen.
- Summary counts for complaint statuses.
- Table-based complaint management layout.
- Access to complaint details needed for review.
- Status update controls.
- Administrative remark / latest-update field.
- Refresh and re-render behaviour after a record is updated.

### Complaint lifecycle
The current interface uses three primary states:

| Status | Meaning in the workflow |
|---|---|
| Pending | The report has been submitted and is awaiting action. |
| In Progress | Work or investigation has started. |
| Resolved | The issue has been marked as resolved. |

The administrator can update a complaint's status and remark through the backend update endpoint. The updated record is returned so the interface can reflect the new state.

### Why the admin layout differs
The Student Portal prioritises readable cards and discovery. The admin portal retains a table-oriented layout because administrators need to compare many records and update them efficiently. The two interfaces therefore use different presentation patterns for different jobs.

---

# 4. 24-Hour Service Window & Time-Based Tracking

A key v4.x feature is the 24-hour service-window indicator.

The interface calculates elapsed time from a complaint's reported date/time and uses that value to communicate the state of the service window.

### For open complaints
- When the complaint is still inside the 24-hour window, the interface displays the remaining time.
- When the 24-hour window has elapsed, the interface displays how long the report is overdue.

### For resolved complaints
- The interface compares the resolution timing with the 24-hour window when the necessary timestamps are available.
- It communicates whether the complaint was resolved within the target window or after it.

### Why it matters
This turns a static status label into a more informative progress indicator. A student can see not only whether a report is pending or in progress, but also how long it has been open relative to the target window.

**Important:** The 24-hour indicator is a demonstration service target and frontend time calculation. It is not an enforceable guarantee that every physical repair will be completed within 24 hours. Actual work can depend on weekends, staff availability, specialist support and spare parts.

---

# 5. Backend Engineering & Application Architecture

The backend work is organised into separate layers: HTTP server and API routes, database access and schema initialisation, authentication-related middleware, and an alternative Python server implementation.

The primary backend is Node.js with Express and SQLite. A separate Python implementation is also included as an alternative server path.

## 5.1 Node.js Runtime and Express Application

**File:** `server/server.js`

This file is the main entry point for the Node.js backend.

It is responsible for:
- Loading environment variables through `dotenv`.
- Creating the Express application.
- Reading the configured port, with a local default of `3000`.
- Loading the JWT library used by the administrator login endpoint.
- Importing the database connection and database initialisation function.
- Initialising the SQLite schema when the server starts.
- Registering CORS handling.
- Enabling JSON request-body parsing.
- Serving the static frontend files from the `public/` directory.
- Registering API routes for health checks, administrator login, complaint retrieval, complaint creation, upvotes and complaint updates.
- Starting the HTTP listener.

### How it connects to the website
The browser-based JavaScript sends HTTP requests to `/api/...`. Express receives those requests, reads the request body or route parameters, calls the relevant database operation, and sends a JSON response. The frontend then uses the returned data to refresh complaint cards, counts or status information.

This separates presentation from data handling: HTML/CSS/JavaScript render the user experience, while Express handles API requests and coordinates database operations.

## 5.2 REST-Style API Design

The current Node backend exposes the following routes:

| HTTP method | Endpoint | Purpose | Website behaviour |
|---|---|---|---|
| GET | `/api/health` | Basic server/database health response | Allows a client or operator to check whether the API process is responding. |
| POST | `/api/auth/login` | Checks the demo administrator passcode and returns a signed JWT | Supports the administrator sign-in demonstration. |
| GET | `/api/complaints` | Reads complaint records from SQLite, newest inserted first | Populates the complaint directory and dashboard data. |
| POST | `/api/complaints` | Validates required fields, generates a ticket and inserts a record | Saves a newly submitted student complaint. |
| POST | `/api/complaints/:id/upvote` | Changes the upvote count for a matching ticket | Updates the visible support count for a shared issue. |
| PATCH | `/api/complaints/:id` | Updates status and/or administrative remark | Lets the admin interface record complaint progress. |

### Request/response flow
1. A user performs an action in the frontend.
2. The frontend JavaScript constructs a request to the relevant API endpoint.
3. Express receives and parses the request.
4. The route checks required input or looks up the target complaint.
5. The database query reads or updates the SQLite record.
6. The server responds with JSON and an appropriate HTTP status.
7. The frontend consumes the response and updates the page.

The API uses HTTP methods according to the type of operation: GET for retrieval, POST for creation/actions and PATCH for partial record updates.

## 5.3 Database Layer and SQLite Integration

**File:** `server/db.js`

The database module centralises the SQLite connection and schema initialisation.

### Connection configuration
- Uses `better-sqlite3` to connect to SQLite.
- Uses `DB_PATH` when configured.
- Otherwise creates/opens `server/campuscare.db`.
- Enables SQLite Write-Ahead Logging (WAL) mode through `PRAGMA journal_mode = WAL`.

### Schema creation
The module creates a `complaints` table if it does not already exist.

| Column | Data type / rule | Role |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Unique complaint/ticket reference. |
| `studentName` | TEXT NOT NULL | Name submitted with the report. |
| `studentId` | TEXT NOT NULL | Student identifier submitted with the report. |
| `category` | TEXT NOT NULL | Type of campus issue. |
| `location` | TEXT NOT NULL | Reported campus location. |
| `description` | TEXT NOT NULL | Details of the issue. |
| `priority` | TEXT NOT NULL | Submitted priority level. |
| `status` | TEXT NOT NULL, default `Pending` | Current complaint lifecycle state. |
| `upvotes` | INTEGER NOT NULL, default `1` | Number of students supporting the report. |
| `date` | TEXT NOT NULL | Report date. |
| `time` | TEXT NOT NULL | Report time. |
| `remark` | TEXT, default empty string | Latest administrative update. |

### Prepared statements and data operations
The Node backend uses prepared SQL statements for inserting, selecting and updating complaint records. This keeps query structure separate from values supplied by the request and avoids building SQL statements by concatenating user-provided text.

The database module exports the database connection and `initDb()` function so the server can initialise the schema before handling requests.

### Initial demonstration records
When the complaints table is empty, `initDb()` inserts four fictional sample complaints. This gives the application records to display on first launch and demonstrates different categories, priorities, statuses, vote counts and remarks.

The wider v4.1 frontend showcase also contains 30 fictional complaint records for the presentation experience. These sample records are demonstration data, not real institutional reports.

### How it connects to the website
The database is the persistence layer behind the Node API. When a complaint is submitted, it is inserted into SQLite. When the directory loads, the API reads the records. When an upvote or status/remark change is made, the relevant database row is updated. This is the difference between a shared server-side data store and browser-only local storage.

## 5.4 Ticket Generation and Record Initialisation

When a new complaint is submitted, the Node API:
1. Reads the student and complaint fields from the JSON request.
2. Checks that the required fields are present.
3. Generates a reference in the `CC-2026-####` format.
4. Checks the database for an existing record with that reference and regenerates it if a collision is found.
5. Trims the submitted text values.
6. Sets the initial status to `Pending`.
7. Sets the initial upvote count to `1`.
8. Uses supplied date/time values or generates current date/time values.
9. Initialises the administrative remark as an empty string.
10. Inserts the new record into SQLite.
11. Returns the created complaint as JSON with HTTP status `201 Created`.

This creates a consistent starting record for the rest of the reporting and tracking flow.

**Implementation note:** The current ticket generator uses a random four-digit suffix and checks for an existing ID before insertion. It is suitable for a small demonstration dataset, but a production system should use a stronger collision-resistant ID strategy and a database-backed sequence/UUID approach.

## 5.5 Complaint Retrieval and Ordering

The `GET /api/complaints` route retrieves all rows from the complaints table and orders them by descending SQLite `rowid`. This makes recently inserted records appear first in the API response.

The frontend can then render the results in the student directory or admin dashboard. The homepage separately limits its featured display to the three newest reports.

## 5.6 Upvote Update Logic

The upvote endpoint:
- Receives a complaint ID from the URL.
- Reads the requested delta from the JSON body, defaulting to an increment.
- Checks whether the complaint exists.
- Returns `404 Not Found` if the ticket does not exist.
- Converts the requested direction into an increment or decrement.
- Applies a minimum count of one.
- Updates the database row.
- Reads the updated record and returns it to the frontend.

This provides a server-side count that can be reflected in the website. The current implementation does not maintain a separate per-user voting table, so it is not a secure one-person-one-vote system.

## 5.7 Status and Remark Update Logic

The `PATCH /api/complaints/:id` route supports partial updates:
- It looks up the complaint using the supplied ticket ID.
- Returns `404 Not Found` if no matching complaint exists.
- Retains the current status if a new status is not supplied.
- Retains the current remark if a new remark is not supplied.
- Updates the status and remark columns.
- Reads the updated record and returns it as JSON.

This endpoint connects the admin interface to the complaint lifecycle. A status change or administrative note can be persisted and then displayed to students as the latest recorded progress.

**Current limitation:** The route does not yet enforce a strict allow-list of status values or authenticate/authorise the caller. These controls must be added before real deployment.

## 5.8 Administrator Login and JWT Token

The current Node login route accepts a PIN or password field, checks it against the configured demo administrator passcode (and a demo fallback), and signs a JWT with an administrator role claim. The token has a 24-hour expiry.

JWT (JSON Web Token) is a signed token format that can carry claims about the authenticated session. The repository also includes a separate authentication middleware module described below.

**Important implementation distinction:** The current `server.js` login route issues a token, but the complaint API routes are not currently wired to require that token. Therefore, the current code demonstrates token issuance but does not yet provide complete protected-route enforcement. The default secret and demo passcode must not be used in a real deployment.

## 5.9 Authentication Middleware and Role-Based Access Control Module

**File:** `server/middleware/auth.js`

This file contains reusable authentication and role-checking helpers:

### `signToken(user)`
- Creates a signed JWT.
- Adds user identity and role-related claims such as UID, name, email, role and department.
- Uses a configurable token expiry, defaulting to 24 hours.

### `authenticateJWT(req, res, next)`
- Reads the HTTP `Authorization` header.
- Requires the `Bearer <token>` format.
- Verifies the JWT signature and expiry.
- Attaches decoded claims to `req.user` when valid.
- Returns an unauthorised response when the token is missing, invalid or expired.

### `requireRole(...allowedRoles)`
- Checks that a request has an authenticated user.
- Checks whether the user's role is included in the allowed roles.
- Returns an access-denied response when the role is not permitted.
- Calls the audit helper for a role-denied attempt.

### `logAudit(user, action, targetId, details, ipAddress)`
- Provides a helper for recording actor identity, role, action, target, details and IP address into an `audit_logs` table.
- Handles audit insert errors without crashing the calling request.

### Intended role in the architecture
These helpers represent the reusable building blocks for a more complete access-control layer. They are designed to be attached to sensitive routes so the server can distinguish authenticated users and permitted roles.

**Current code status:** The middleware module is present, but the current `server.js` does not apply `authenticateJWT` or `requireRole` to the complaint routes. The current database initialisation shown in `db.js` also creates the complaints table, not the `audit_logs` table referenced by `logAudit`. Thus, complete RBAC enforcement and persistent audit logging are not active features of this release. They are prepared components / follow-up integration work, not completed security controls.

## 5.10 Alternative Python Backend

**File:** `backend_python/server.py`

The repository includes a separate Python server implementation using built-in modules rather than a Node runtime.

It uses:
- `http.server` to run a lightweight HTTP server.
- `sqlite3` for database access.
- `json` for request/response bodies.
- `urllib.parse` for route and query parsing.
- Python's standard-library HTTP handler methods for GET, POST, PATCH and OPTIONS.

### Supported behaviour
- Serves the frontend files.
- Exposes a health endpoint.
- Retrieves complaint records.
- Handles demonstration administrator login.
- Accepts new complaint submissions.
- Handles upvote actions.
- Handles status/remark updates.
- Uses SQLite to persist the complaint records.

### Why include a second backend?
The Python implementation provides an alternative way to run the demonstration without installing the Node dependency set. It also shows how the same basic application workflow can be represented using a different server runtime and database interface.

It is an alternative implementation, not a service that automatically runs alongside Express. Choose one backend process when running the project locally.

---

# 6. Frontend Engineering & Design Iterations

The frontend was not treated as a single static page. It was iteratively revised to support separate visitor, student and administrator workflows.

## 6.1 Page and code separation

| File | Responsibility |
|---|---|
| `public/index.html` | Public landing page, navigation, hero, featured reports and category entry points. |
| `public/student.html` | Student portal, complaint form, directory and tracking interface. |
| `public/admin.html` | Administrator login and complaint-management interface. |
| `public/script.js` | Frontend behaviour, API interaction, rendering, filters, tracking, upvotes and form actions. |
| `public/style.css` | Shared visual system, page layouts, cards, tables, responsive styling and visual states. |

This separation makes the project easier to navigate and lets the interface structure, presentation rules and interaction logic evolve independently.

## 6.2 Visual design direction

The design evolved toward a restrained, minimal campus-product interface:
- Warm off-white page surfaces.
- Neutral typography and carefully controlled accent colours.
- Consistent card shapes, borders, radii and spacing.
- Clear hierarchy between page headings, supporting text, metadata and actions.
- A compact navigation system.
- Less clutter in the student-facing complaint list.
- A more operational, table-based layout for administrators.

## 6.3 Category and navigation refinements

- Category cards became direct entry points into the reporting form.
- Category selection is carried into the Student Portal so students do not have to choose the same category again.
- The homepage and portal navigation were refined to keep the primary actions visible.
- The full complaint directory was deliberately kept out of the landing page and placed in the Student Portal.
- The homepage's featured complaint list was limited to the three newest records.

## 6.4 Complaint-card redesign

The student complaint directory was changed from a dense table presentation to cards with more room for:
- Complaint title/description.
- Category and location.
- Ticket reference.
- Priority and status.
- Time information.
- Upvote count.
- Latest remark or update.

Card spacing, padding and vertical rhythm were increased after visual review to improve scanability and prevent the content from feeling compressed.

## 6.5 Hero illustration integration

The hero illustration is intended to be part of the web layout, not a separately selectable image pasted into the page. The corrected implementation uses page-integrated HTML/CSS elements and styling so that the artwork can sit naturally within the hero composition.

Decorative illustration elements are configured to avoid ordinary selection and dragging interactions. This is a usability treatment only; it cannot prevent screenshots, browser inspection or copying through developer tools.

---

# 7. Data Flow: How the Website Works End to End

## 7.1 Student submits a complaint

1. Student opens the landing page and chooses a category or enters the Student Portal.
2. The category selection can be passed to the form.
3. Student fills the required fields.
4. Frontend JavaScript gathers the values and sends a JSON POST request to `/api/complaints`.
5. Express validates required fields and prepares the new complaint record.
6. The server generates a ticket reference and sets initial status and upvote count.
7. The database module inserts the record into SQLite.
8. The API returns the created complaint.
9. The frontend can display the ticket reference and refresh the visible complaint list.

## 7.2 Student browses the directory

1. The frontend requests `/api/complaints` when using the backend.
2. Express retrieves complaint records from SQLite.
3. The API returns the records as JSON.
4. Frontend JavaScript renders the records as complaint cards.
5. Search, category/status filters and sort controls narrow or reorder the displayed records.
6. The homepage uses only the three newest featured records; the Student Portal contains the full directory.

## 7.3 Student upvotes a report

1. Student selects the upvote / “Same Issue” control.
2. The frontend sends a request to `/api/complaints/:id/upvote`.
3. The server checks that the ticket exists.
4. The database count is updated with a minimum of one.
5. The updated complaint is returned.
6. The interface refreshes the visible vote count and browser-local vote state.

## 7.4 Administrator updates a report

1. Administrator opens the admin portal and enters the demo passcode.
2. The login route returns a signed JWT when the configured demo credential is accepted.
3. The admin interface loads complaint data.
4. Administrator selects a complaint and changes its status and/or remark.
5. The frontend sends a PATCH request to `/api/complaints/:id`.
6. The server looks up the record and applies the supplied changes.
7. SQLite stores the new status and remark.
8. The updated record is returned to the interface.

**Security note:** In the current code, the PATCH endpoint does not enforce the issued JWT. This is a demonstration flow, not a protected production administrator workflow.

---

# 8. Repository Structure

```text
campus-care/
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Pages CI/CD workflow
├── backend_python/
│   └── server.py                  # Alternative Python + SQLite server
├── public/
│   ├── assets/                    # Static frontend assets, if present
│   ├── index.html                 # Public landing page
│   ├── student.html               # Student Portal
│   ├── admin.html                 # Admin Portal
│   ├── script.js                  # Frontend application logic
│   └── style.css                  # Shared styling and responsive layouts
├── server/
│   ├── middleware/
│   │   └── auth.js                # JWT and role-checking helper module
│   ├── db.js                      # SQLite connection, schema and demo seed data
│   └── server.js                  # Express app and API routes
├── .env.example                   # Example environment values, if included
├── package.json                  # Node dependencies and scripts
├── package-lock.json             # Dependency lock file, if included
└── README.md                     # Project and technical documentation
```

---

# 9. Technology Stack

| Layer | Technology | Role in CampusCare |
|---|---|---|
| Structure | HTML5 | Defines the landing page, student portal and admin portal. |
| Presentation | CSS3 | Controls layouts, responsive behaviour, typography, cards, tables and visual states. |
| Client logic | Vanilla JavaScript | Handles forms, rendering, filters, sorting, tracking, upvotes and API calls. |
| Server runtime | Node.js | Runs the primary backend process. |
| Web framework | Express.js | Defines routes, parses requests and serves the frontend. |
| Database | SQLite | Stores complaint records in a local database file. |
| SQLite driver | better-sqlite3 | Provides synchronous database queries and prepared statements. |
| Authentication token | JSON Web Token | Signs the demo administrator login response; route enforcement remains incomplete. |
| Configuration | dotenv | Loads environment variables from `.env`. |
| Cross-origin handling | cors | Registers CORS handling in the Express server. |
| Alternative runtime | Python 3 | Runs the optional standard-library backend. |
| Alternative database interface | sqlite3 | Provides SQLite access in the Python implementation. |
| Hosting | GitHub Pages | Publishes the static frontend. |
| Deployment automation | GitHub Actions | Builds the Pages artifact from `public/` and deploys it. |

The package also lists `bcryptjs`, `helmet` and `express-rate-limit` as dependencies. Their presence in `package.json` should not be interpreted as proof that password hashing, security headers or rate limiting are fully configured in the active server routes.

---

# 10. Running the Project Locally

## Requirements
- Node.js and npm for the primary backend.
- Python 3 for the alternative backend.

## Option A: Node.js + Express

From the project root:

```bash
npm install
```

If environment variables are needed, copy `.env.example` to `.env` and configure local values. Never commit `.env`.

Start the primary backend:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Development mode:

```bash
npm run dev
```

The package also contains a seed script:

```bash
npm run seed
```

Inspect the seed script before using it because the current command includes a reset flag and may replace local demonstration data.

## Option B: Python backend

From the project root:

```bash
python3 backend_python/server.py
```

Then open:

```text
http://localhost:3000
```

Run either the Node server or Python server as the selected backend for a local session. They are alternatives, not a combined multi-server deployment.

---

# 11. Configuration and Environment Variables

The Node server reads the following environment values:

| Variable | Purpose | Current behaviour |
|---|---|---|
| `PORT` | HTTP listener port | Defaults to `3000`. |
| `JWT_SECRET` | Signs the login JWT | Current code contains an unsafe fallback; configure a strong secret outside source control. |
| `ADMIN_PASSCODE` | Demo admin credential | Current code contains a demonstration fallback. |
| `DB_PATH` | SQLite database location | Defaults to `server/campuscare.db`. |

Do not upload `.env`, database files, production credentials, real student records or private complaint details to a public repository.

---

# 12. GitHub Pages and Deployment Workflow

The frontend is published at:

https://hey-meridian.github.io/campus-care/

The workflow file is:

```text
.github/workflows/deploy.yml
```

The workflow:
1. Checks out the repository.
2. Configures GitHub Pages.
3. Uploads the contents of `public/` as the Pages artifact.
4. Deploys that artifact to GitHub Pages.

This keeps the frontend source organised in `public/` while publishing `index.html` at the root of the deployed site.

### Important hosting boundary
GitHub Pages hosts static files. It does not execute the Node.js server, Python server or SQLite database. Therefore, a successful Pages deployment proves that the static frontend artifact was deployed; it does not prove that live complaint submission, shared database persistence or administrator updates are connected to a hosted backend.

A complete hosted deployment requires a separately hosted backend, persistent database storage, and correct frontend API configuration / CORS settings.

---

# 13. Development Timeline & Work Completed

This section records the main categories of work carried out during the iterative development period. It describes project workstreams and outcomes rather than claiming that every discussed future feature was implemented.

## Phase 1 — Initial product structure
- Established the campus complaint reporting concept.
- Created the public landing page and navigation.
- Added the student complaint submission flow.
- Added ticket lookup / tracking direction.
- Established an administrator-facing portal concept.
- Added initial complaint categories and demonstration content.
- Used browser local storage during the earlier front-end-only stage.

## Phase 2 — UI/UX refinement
- Reworked header and navigation hierarchy.
- Refined category cards and category-to-form navigation.
- Added the network/internet reporting category.
- Established a warm neutral visual direction.
- Refined information/tip-card treatment.
- Adjusted footer content and page navigation.
- Removed institution-specific branding and identity references.
- Kept public/student-facing complaint presentation separate from admin management.

## Phase 3 — Full-stack structure
- Added a Node.js / Express server entry point.
- Separated API route handling from browser presentation code.
- Added SQLite connection and schema initialisation.
- Added prepared SQL statements for complaint persistence.
- Added a complaint retrieval endpoint.
- Added a complaint creation endpoint.
- Added ticket reference generation.
- Added upvote update handling.
- Added complaint status and remark update handling.
- Added a basic health endpoint.
- Added a demonstration administrator login endpoint with JWT issuance.
- Added a reusable JWT authentication / role-checking helper module.
- Added a Python + SQLite alternative backend.

## Phase 4 — Showcase and workflow expansion
- Prepared fictional complaint records for a populated demonstration.
- Expanded the frontend showcase dataset to 30 fictional records.
- Added newest-first homepage featured complaint logic.
- Limited homepage featured reports to three.
- Moved the complete directory into the Student Portal.
- Redesigned student directory presentation as cards.
- Added search, filters and sorting.
- Added a 24-hour time-window display.
- Improved complaint card spacing and readability.
- Retained a table-oriented admin management view.
- Refined tracking and upvote interactions.

## Phase 5 — Repository and deployment
- Organised frontend, backend and alternative backend into separate folders.
- Prepared the repository README and example environment configuration.
- Created a GitHub Actions workflow for GitHub Pages.
- Configured Pages to deploy the `public/` directory.
- Published the frontend to the public GitHub Pages URL.
- Reviewed the deployed page and corrected the publishing path so the actual homepage, rather than the repository README, is served.

## Phase 6 — Hero and documentation refinement
- Reviewed the hero illustration in the context of the live website.
- Rejected a standalone rectangular artwork treatment because it looked pasted into the page.
- Returned to an integrated HTML/CSS illustration approach.
- Added non-selectable / non-draggable behaviour to decorative hero elements to prevent ordinary image-like dragging interactions.
- Expanded project documentation to explain the architecture, frontend, backend, database, API and development history.

---

# 14. Known Limitations & Engineering Work Still Required

The current release demonstrates the core workflow, but the following work is required before real institutional use.

### Authentication and authorisation
- Replace demo passcodes with secure credential management.
- Remove fallback JWT secrets.
- Hash and verify credentials using a proper account store.
- Apply JWT verification middleware to protected endpoints.
- Enforce role-based permissions for administrator actions.
- Separate student, administrator and public permissions.
- Add secure session/token handling and logout/expiry behaviour.

### Database and data integrity
- Add a dedicated user table and account lifecycle.
- Add a per-user vote table with uniqueness constraints.
- Add complaint status history instead of storing only the latest state.
- Add an audit-log table and integrate audit events.
- Add database migrations and controlled schema versioning.
- Use a production database with persistent storage and backups.
- Use stronger ticket-ID generation and collision handling.

### API hardening
- Restrict CORS to the intended frontend origin.
- Add request rate limits to active routes.
- Add strict schema validation for all fields.
- Restrict status values to an explicit allow-list.
- Validate priority and category values.
- Add safe error handling and structured server logs.
- Protect private reporter information.
- Add pagination for a larger complaint dataset.
- Add API tests for success, invalid input, missing records and unauthorised access.

### Deployment and operations
- Deploy the backend separately from GitHub Pages.
- Configure the frontend API base URL for the hosted backend.
- Configure persistent database storage.
- Add environment-specific configuration.
- Test cold starts, restart persistence and failure behaviour.
- Add monitoring and backup procedures.

### Quality assurance
- Test the full student submission journey in a real browser.
- Test search, filters, sorting and upvote behaviour.
- Test admin status and remark updates.
- Test mobile and desktop breakpoints.
- Inspect browser console errors and failed network requests.
- Verify backend persistence across sessions and devices.
- Perform security and privacy review before using real data.

---

# 15. Scope Decisions

To keep the current release focused, the following decisions define the v4.1 showcase scope:

- The landing page features the three newest complaints only.
- The complete complaint directory is in the Student Portal.
- Student complaint browsing uses cards.
- Admin complaint management uses a table.
- The 24-hour indicator is a service target, not a guaranteed physical repair deadline.
- Demonstration records are fictional.
- The current release does not include verified institutional identity or student API verification.
- Firebase was discussed as a possible future central-storage option, but it is not integrated in this source.
- Institution-specific branding and identity references are intentionally excluded.
- This is a prototype and not a production-secure grievance platform.

---

# 16. Final Project Summary

CampusCare v4.1 brings together a public landing page, student reporting and tracking portal, administrator management interface, REST-style backend, SQLite persistence layer, alternative Python backend and automated static frontend deployment.

The work spans more than page styling: it includes structuring the application into frontend and backend modules, defining a complaint data model, implementing API request/response flows, generating ticket references, persisting complaint records, updating votes and statuses, creating a time-based service indicator, preparing demonstration data, organising the GitHub repository and configuring automated deployment.

The current release is a substantial academic prototype with a clear path for further engineering. Its next major step is to complete authentication and authorisation integration, deploy the backend with persistent storage, and validate the complete end-to-end workflow under real hosted conditions.

**CampusCare v4.1 — Full-Stack Showcase Release**
