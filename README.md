# CampusCare

CampusCare is a beginner-friendly college mini-project for reporting, tracking, and resolving campus maintenance complaints.

## Run it

No installation, database, server, or API key is required.

1. Open `index.html` in a browser, or run the project using Replit's static preview.
2. Choose **Student Portal**. The admin console is opened directly at `admin.html` and asks for the demo PIN.
3. Use the seeded sample complaints to demonstrate the dashboards.

## Demo workflow

1. Open **Student Portal**.
2. Select **Register Complaint** and submit a new issue.
3. The app generates the next complaint ID, such as `CMP005`.
4. Open `admin.html`, enter the demo PIN `2468`, and select the new complaint.
5. Change its status to **In Progress**, add an administrative remark, and update.
6. Open the complaint again and change it to **Resolved**.
7. Return to **Student Portal**. The updated status and remark are visible.

## Project structure

```text
index.html    Landing page
student.html  Student dashboard and complaint form
admin.html    Administrator dashboard and complaint management
style.css     Responsive visual design
script.js     LocalStorage data store and application logic
```

## Data storage

All complaints are stored in the browser's LocalStorage under:

```text
campuscare_complaints
```

The landing page includes ten report categories inspired by the supplied reference: classroom and smartboard, fan/AC/electrical, furniture and lab damage, playground and sports kit, hostel and mess food, exams and hall tickets, fee accounts and scholarships, bus and campus transport, sanitation and water cooler, and internet/network. Anti-ragging and external escalation portals are intentionally excluded. Category cards preselect the category in the inquiry form. The first launch creates four realistic sample complaints. They are not recreated on later page loads. To reset the demo, clear the browser's LocalStorage for the page and refresh.

## Notes

- This is intentionally a front-end-only college project.
- The admin page has a client-side demo PIN gate (`2468`) and a lock-session control. This is only a presentation barrier, not secure authentication: the PIN is visible in frontend JavaScript and the gate can be bypassed. Do not use this build to protect sensitive information.
- Data is shared between both pages in the same browser profile through the same LocalStorage key; it is not shared across different devices or browsers.
- The app has no external runtime dependencies and uses system fonts.

## Design and security notes

- The interface uses a light, minimal visual system with warm off-white page surfaces, white cards, graphite text, and an electric-periwinkle acrylic accent on the CampusCare tip card.
- The project intentionally remains plain HTML, CSS, and JavaScript for easy static hosting and a straightforward GitHub workflow.
- For real deployment, replace the demo PIN gate with server-side authentication and authorization before exposing the admin console publicly.


## Demo details
- Demo support contact shown in the interface: +91 120 456 7890
- Demo address shown in the interface: Knowledge Park II, Greater Noida, Uttar Pradesh 201306
- These are presentation/demo contact details and should be replaced with verified official details before public deployment.
- The administrator PIN gate is client-side demo authentication, not production security.
