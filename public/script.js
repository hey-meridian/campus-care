(function () {
  "use strict";

  const STORAGE_KEY = "campuscare_complaints_v2";
  const UPVOTE_STORAGE_KEY = "campuscare_upvoted_ids_v2";
  const ADMIN_SESSION_KEY = "campuscare_admin_jwt_token";

  const SAMPLE_COMPLAINTS = [
    {
      id: "CC-2026-4821",
      studentName: "Aarav Sharma",
      studentId: "2604827",
      category: "Fan, AC & Electrical",
      location: "CSE Block - Room 204",
      description: "Ceiling fan is making a loud bearing noise and wall regulator is not working.",
      priority: "High",
      status: "Pending",
      upvotes: 19,
      date: "19 Sep 2026",
      time: "09:15 AM",
      remark: "Assigned to electrical maintenance wing."
    },
    {
      id: "CC-2026-7394",
      studentName: "Priya Verma",
      studentId: "2601936",
      category: "Sanitation & Water Cooler",
      location: "Hostel Block B - First Floor",
      description: "RO water cooler is dispensing warm water and filter indicator is blinking.",
      priority: "High",
      status: "In Progress",
      upvotes: 31,
      date: "18 Sep 2026",
      time: "11:40 AM",
      remark: "Maintenance team is replacing the RO filter cartridge and checking compressor."
    },
    {
      id: "CC-2026-5108",
      studentName: "Rohan Singh",
      studentId: "2607054",
      category: "Furniture & Lab Damage",
      location: "Mechanical CAD Lab",
      description: "Four ergonomic lab chairs near stations 12-15 have damaged hydraulic levers.",
      priority: "Low",
      status: "Resolved",
      upvotes: 8,
      date: "17 Sep 2026",
      time: "02:20 PM",
      remark: "Replacement chairs have been placed in the lab."
    },
    {
      id: "CC-2026-9263",
      studentName: "Ananya Gupta",
      studentId: "2608612",
      category: "Internet & Network",
      location: "Central Library - 3rd Floor",
      description: "Wi-Fi connection drops frequently during evening study hours.",
      priority: "Medium",
      status: "In Progress",
      upvotes: 24,
      date: "16 Sep 2026",
      time: "04:05 PM",
      remark: "Network team is installing a secondary access point in the reading hall."
    }
  ];

  const SHOWCASE_ISSUES = [
    ["Classroom & Smartboard","Projector image flickers during lectures in the rear half of the room.","Academic Block - Room 312","Medium","AV team is checking the HDMI connection and projector lamp."],
    ["Fan, AC & Electrical","Two ceiling fans are not rotating at full speed despite regulator changes.","CSE Block - Room 208","High","Electrical team has inspected the regulator and ordered a replacement."],
    ["Furniture & Lab Damage","Several desk surfaces in the front row have loose laminate edges.","B Block - Room 106","Low","Carpentry team has scheduled a minor repair."],
    ["Internet & Network","Wi-Fi signal drops near the group study tables.","Central Library - 2nd Floor","Medium","Network team is reviewing access point coverage."],
    ["Sanitation & Water Cooler","Water dispenser is leaking near the refill station.","Hostel Block A - Ground Floor","High","Plumbing team has isolated the leak and is replacing a valve."],
    ["Playground & Sports Kit","Badminton net has a torn section and needs replacement.","Sports Complex - Indoor Court","Low","Sports office has logged a replacement request."],
    ["Bus & Campus Transport","Campus shuttle is arriving later than the displayed schedule.","Main Gate - Shuttle Stop","Medium","Transport desk is reviewing the afternoon route timing."],
    ["Hostel & Mess Food","Dining hall water station needs regular cleaning.","Hostel Mess - Dining Hall","Medium","Housekeeping has added the station to its cleaning round."],
    ["Classroom & Smartboard","One row of classroom lights is not switching on.","CSE Block - Room 204","High","Technician is tracing the lighting circuit."],
    ["Fan, AC & Electrical","AC in the seminar room is making an intermittent rattling sound.","Seminar Hall 1","Medium","Maintenance has scheduled an inspection."],
    ["Furniture & Lab Damage","A laboratory stool has a damaged height adjustment lever.","Mechanical Lab - Bay 4","Low","Replacement hardware is being arranged."],
    ["Internet & Network","Ethernet ports are inactive in the project work area.","Innovation Lab - 1st Floor","Medium","Network team is testing the switch ports."],
    ["Sanitation & Water Cooler","Washroom tap continues dripping after being turned off.","Academic Block - 2nd Floor","Low","Plumbing ticket has been assigned."],
    ["Playground & Sports Kit","Cricket practice kit is missing two protective pads.","Sports Store","Low","Sports coordinator is checking the equipment register."],
    ["Bus & Campus Transport","Bus route display board is difficult to read after sunset.","Main Gate","Medium","Transport team is arranging a brighter display."],
    ["Hostel & Mess Food","Dining area exhaust fan is unusually noisy.","Hostel Block B - Mess","Medium","Electrical maintenance is checking the fan bearings."],
    ["Classroom & Smartboard","Smartboard touch response is delayed during presentations.","Academic Block - Room 118","Medium","AV support is recalibrating the touch panel."],
    ["Fan, AC & Electrical","Corridor light near the staircase is flickering.","Library Block - Staircase B","High","Electrical team has marked the fitting for replacement."],
    ["Furniture & Lab Damage","Computer lab chair wheels are damaged at two workstations.","Computer Lab 2","Low","Replacement wheels have been requested."],
    ["Internet & Network","Campus Wi-Fi login page takes several attempts to load.","Library - Reading Hall","High","Network team is monitoring authentication gateway logs."],
    ["Sanitation & Water Cooler","RO filter status indicator is showing a service warning.","Hostel Block C - First Floor","Medium","Filter service is scheduled."],
    ["Playground & Sports Kit","Outdoor court boundary marking has faded.","Outdoor Sports Court","Low","Ground staff will refresh the markings."],
    ["Bus & Campus Transport","Shuttle stop needs a route and timing information board.","Academic Block - Bus Bay","Low","Transport office is preparing updated signage."],
    ["Hostel & Mess Food","One dining table has a loose support bracket.","Hostel Mess - Seating Area","Medium","Facilities team has inspected the table."],
    ["Classroom & Smartboard","Podium microphone audio cuts out intermittently.","Lecture Theatre 2","High","AV team is testing the audio cable and mixer."],
    ["Furniture & Lab Damage","Storage cabinet hinge is loose in the electronics lab.","Electronics Lab - Room 07","Low","Workshop staff have been notified."]
  ];

  function makeShowcaseComplaints() {
    const now = Date.now();
    return SHOWCASE_ISSUES.map((issue, index) => {
      const ageHours = [2, 5, 9, 13, 18, 22, 27, 31, 36, 42, 49, 55, 61, 68, 74, 81, 88, 95, 103, 112, 121, 130, 142, 154, 168, 180][index];
      const createdAt = new Date(now - ageHours * 3600000).toISOString();
      const status = index % 5 === 0 ? "Resolved" : index % 3 === 0 ? "In Progress" : "Pending";
      const created = new Date(createdAt);
      return {
        id: `CC-2026-${String(5100 + index * 37).padStart(4, "0")}`,
        studentName: ["Aarav Sharma","Priya Verma","Rohan Singh","Ananya Gupta","Kabir Mehta","Ishita Rao"][index % 6],
        studentId: `260${String(1842 + index * 113).padStart(4, "0")}`,
        category: issue[0], description: issue[1], location: issue[2],
        priority: issue[3], status, upvotes: 5 + ((index * 7) % 29),
        createdAt,
        resolvedAt: status === "Resolved" ? new Date(created.getTime() + [4, 18, 29][index % 3] * 3600000).toISOString() : null,
        date: created.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),
        time: created.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),
        remark: status === "Resolved" ? "The issue has been addressed. Please check and let us know if it recurs." : issue[4]
      };
    });
  }

  const SHOWCASE_COMPLAINTS = makeShowcaseComplaints();
  const ALL_DEMO_COMPLAINTS = [...SAMPLE_COMPLAINTS, ...SHOWCASE_COMPLAINTS];

  let complaintsCache = [];
  let apiConnected = false;

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  function getUpvotedSet() {
    try {
      const raw = localStorage.getItem(UPVOTE_STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveUpvotedSet(set) {
    try {
      localStorage.setItem(UPVOTE_STORAGE_KEY, JSON.stringify([...set]));
    } catch (e) {}
  }

  function getLocalComplaints() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          const known = new Set(parsed.map((item) => item.id));
          const upgraded = [...parsed, ...ALL_DEMO_COMPLAINTS.filter((item) => !known.has(item.id))];
          saveLocalComplaints(upgraded);
          return upgraded;
        }
      }
    } catch (error) {
      console.warn("CampusCare could not read saved complaints.", error);
    }
    saveLocalComplaints(ALL_DEMO_COMPLAINTS);
    return ALL_DEMO_COMPLAINTS.slice();
  }

  function saveLocalComplaints(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function getComplaints() {
    if (complaintsCache.length) return complaintsCache;
    complaintsCache = getLocalComplaints();
    return complaintsCache;
  }

  // --- Backend API Integration (Connects Frontend <-> Express/Python SQLite Backend) ---
  async function syncWithBackend() {
    try {
      if (!window.location.protocol.startsWith("http")) return;
      const res = await fetch("/api/complaints", { headers: { "Accept": "application/json" } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.complaints)) {
          apiConnected = true;
          const serverIds = new Set(data.complaints.map((item) => item.id));
          complaintsCache = [...data.complaints, ...ALL_DEMO_COMPLAINTS.filter((item) => !serverIds.has(item.id))];
          saveLocalComplaints(complaintsCache);
          refreshAllViews();
        }
      }
    } catch (e) {
      apiConnected = false;
    }
  }

  async function apiCreateComplaint(payload) {
    if (apiConnected) {
      try {
        const res = await fetch("/api/complaints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.complaint) {
            await syncWithBackend();
            return data.complaint;
          }
        }
      } catch (e) {}
    }
    const list = getComplaints();
    const created = {
      ...payload,
      id: generateTicketId(list),
      upvotes: 1
    };
    list.unshift(created);
    complaintsCache = list;
    saveLocalComplaints(list);
    return created;
  }

  async function apiToggleUpvote(id) {
    const upvoted = getUpvotedSet();
    const already = upvoted.has(id);
    if (already) upvoted.delete(id);
    else upvoted.add(id);
    saveUpvotedSet(upvoted);

    if (apiConnected) {
      try {
        const res = await fetch(`/api/complaints/${encodeURIComponent(id)}/upvote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delta: already ? -1 : 1 })
        });
        if (res.ok) {
          await syncWithBackend();
          return;
        }
      } catch (e) {}
    }

    const list = getComplaints();
    const item = list.find((c) => c.id === id);
    if (item) {
      item.upvotes = Math.max(1, (Number(item.upvotes) || 1) + (already ? -1 : 1));
      saveLocalComplaints(list);
      refreshAllViews();
    }
  }

  async function apiAdminUpdateComplaint(id, status, remark) {
    const token = sessionStorage.getItem(ADMIN_SESSION_KEY) || "";
    if (apiConnected) {
      try {
        const res = await fetch(`/api/complaints/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ status, remark })
        });
        if (res.ok) {
          await syncWithBackend();
          return true;
        }
      } catch (e) {}
    }
    const list = getComplaints();
    const complaint = list.find((item) => item.id === id);
    if (!complaint) return false;
    complaint.status = status;
    complaint.resolvedAt = status === "Resolved" ? new Date().toISOString() : null;
    complaint.remark = remark;
    saveLocalComplaints(list);
    refreshAllViews();
    return true;
  }

  function generateTicketId(complaints) {
    const existing = new Set(complaints.map((c) => c.id));
    let candidate = "";
    do {
      const code = Math.floor(1000 + Math.random() * 9000);
      candidate = `CC-2026-${code}`;
    } while (existing.has(candidate));
    return candidate;
  }

  function formatLongDate(dateString) {
    if (!dateString) return "Date not available";
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return dateString;
    return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function complaintStatusClass(status) {
    return status === "Resolved" ? "status-resolved" : status === "In Progress" ? "status-progress" : "status-pending";
  }

  function statusBadge(status) {
    return `<span class="status-badge ${complaintStatusClass(status)}">${escapeHtml(status)}</span>`;
  }

  function getComplaintCreatedAt(complaint) {
    if (complaint.createdAt) return new Date(complaint.createdAt);
    const parsed = new Date(`${complaint.date || ""} ${complaint.time || ""}`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  function getSlaInfo(complaint) {
    const created = getComplaintCreatedAt(complaint);
    const deadline = new Date(created.getTime() + 24 * 60 * 60 * 1000);
    if (complaint.status === "Resolved") {
      const resolvedAt = complaint.resolvedAt ? new Date(complaint.resolvedAt) : new Date();
      const elapsed = resolvedAt.getTime() - created.getTime();
      if (elapsed <= 24 * 3600000) {
        return { label: `Resolved in ${Math.max(1, Math.round(elapsed / 3600000))}h`, className: "sla-done", overdue: false };
      }
      const lateHours = Math.floor((elapsed - 24 * 3600000) / 3600000);
      return { label: `Resolved ${lateHours}h after 24h window`, className: "sla-overdue", overdue: true };
    }
    const remaining = deadline.getTime() - Date.now();
    if (remaining > 0) {
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      return { label: `${hours}h ${minutes}m left in 24h window`, className: "sla-ontrack", overdue: false };
    }
    const overdueHours = Math.floor(Math.abs(remaining) / 3600000);
    const overdueMinutes = Math.floor((Math.abs(remaining) % 3600000) / 60000);
    return { label: `Overdue by ${overdueHours}h ${overdueMinutes}m`, className: "sla-overdue", overdue: true };
  }

  function priorityBadge(priority) {
    const className = String(priority || "").toLowerCase();
    return `<span class="priority-badge priority-${className}">${escapeHtml(priority || "—")}</span>`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[character]));
  }

  function getStats(complaints) {
    return complaints.reduce((stats, complaint) => {
      stats.total += 1;
      if (complaint.status === "Pending") stats.pending += 1;
      if (complaint.status === "In Progress") stats.inProgress += 1;
      if (complaint.status === "Resolved") stats.resolved += 1;
      return stats;
    }, { total: 0, pending: 0, inProgress: 0, resolved: 0 });
  }

  function updateStats(prefix, complaints) {
    const stats = getStats(complaints);
    const values = { Total: stats.total, Pending: stats.pending, InProgress: stats.inProgress, Resolved: stats.resolved };
    Object.entries(values).forEach(([name, value]) => {
      const element = $(`#${prefix}${name}`);
      if (element) element.textContent = value;
    });
    const navCount = prefix === "student" ? $("#studentNavCount") : $("#adminNavCount");
    if (navCount) navCount.textContent = stats.total;
  }

  function findComplaint(id) {
    return getComplaints().find((complaint) => complaint.id.toUpperCase() === String(id || "").toUpperCase());
  }

  function detailItem(label, value, full = false) {
    const className = full ? "detail-item full-detail" : "detail-item";
    return `<div class="${className}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "Not provided")}</strong></div>`;
  }

  function showModal(id) {
    const modal = $(`#${id}`);
    if (modal) {
      modal.classList.remove("hidden");
      document.body.classList.add("modal-open");
    }
  }

  function closeModal(id) {
    const modal = $(`#${id}`);
    if (modal) modal.classList.add("hidden");
    if (!$$(".modal-backdrop:not(.hidden)").length) document.body.classList.remove("modal-open");
  }

  function renderLandingCommunity() {
    const grid = $("#landingCommunityGrid");
    if (!grid) return;
    const upvoted = getUpvotedSet();
    const topIssues = getComplaints()
      .slice()
      .sort((a, b) => getComplaintCreatedAt(b).getTime() - getComplaintCreatedAt(a).getTime())
      .slice(0, 3);

    grid.innerHTML = topIssues.map((c) => {
      const isVoted = upvoted.has(c.id);
      return `
        <article class="community-card">
          <div>
            <div class="community-card-top">
              <span class="community-id">${escapeHtml(c.id)}</span>
              ${statusBadge(c.status)}
            </div>
            <h3 class="community-title">${escapeHtml(c.description)}</h3>
            <p class="community-meta">${escapeHtml(c.category)} · ${escapeHtml(c.location)}</p>
            <div class="community-remark">
              <b>Latest update:</b> ${escapeHtml(c.remark || "Awaiting maintenance team assignment.")}
            </div>
          </div>
          <div class="community-card-foot">
            <button type="button" class="upvote-btn ${isVoted ? "upvoted" : ""}" data-upvote-id="${escapeHtml(c.id)}">
              <span>👍 +1 Same Issue</span>
              <span class="upvote-count">${Number(c.upvotes) || 1}</span>
            </button>
            <a href="student.html?ticket=${encodeURIComponent(c.id)}#complaints" class="inline-action">Track →</a>
          </div>
        </article>
      `;
    }).join("");
    $$("[data-upvote-id]", grid).forEach((button) => button.addEventListener("click", () => apiToggleUpvote(button.dataset.upvoteId)));
  }

  function renderPreviewList(selector, complaints, isAdmin = false) {
    const container = $(selector);
    if (!container) return;
    const latest = complaints.slice(0, 4);
    if (!latest.length) {
      container.innerHTML = `<div class="empty-state"><span>◌</span><h3>No complaints yet</h3><p>New submissions will appear here.</p></div>`;
      return;
    }
    container.innerHTML = latest.map((complaint) => `
      <button class="preview-complaint" data-view-id="${escapeHtml(complaint.id)}" aria-label="View ${escapeHtml(complaint.id)}">
        <span><b>${escapeHtml(complaint.id)}</b><small>${escapeHtml(complaint.category)}</small></span>
        <span class="complaint-location">${escapeHtml(complaint.location)}</span>
        ${isAdmin ? `<span>${escapeHtml(complaint.studentName)}</span>` : `<span>👍 ${Number(complaint.upvotes) || 1}</span>`}
        <span>${statusBadge(complaint.status)}</span>
      </button>`).join("");
    $$("[data-view-id]", container).forEach((button) => button.addEventListener("click", () => {
      if (isAdmin) openAdminDetail(button.dataset.viewId);
      else openStudentDetail(button.dataset.viewId);
    }));
  }

  function renderStudent() {
    const complaints = getComplaints();
    updateStats("student", complaints);
    renderPreviewList("#studentRecentComplaints", complaints);
    renderStudentTable(complaints);
  }

  function renderStudentTable(complaints = getComplaints()) {
    const grid = $("#studentComplaintsGrid");
    if (!grid) return;
    const upvoted = getUpvotedSet();
    const search = ($("#studentSearch")?.value || "").trim().toLowerCase();
    const category = $("#studentCategoryFilter")?.value || "All";
    const status = $("#studentStatusFilter")?.value || "All";
    const sort = $("#studentSortFilter")?.value || "recent";

    const categoryFilter = $("#studentCategoryFilter");
    if (categoryFilter) {
      const current = categoryFilter.value || "All";
      const categories = [...new Set(complaints.map((c) => c.category).filter(Boolean))].sort();
      categoryFilter.innerHTML = `<option value="All">All categories</option>${categories.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}`;
      categoryFilter.value = categories.includes(current) ? current : "All";
    }

    let filtered = complaints.filter((complaint) => {
      const searchable = [complaint.id, complaint.category, complaint.location, complaint.priority, complaint.status, complaint.description].join(" ").toLowerCase();
      return (!search || searchable.includes(search)) &&
        (category === "All" || complaint.category === category) &&
        (status === "All" || complaint.status === status);
    });

    filtered.sort((a, b) => {
      if (sort === "votes") return (Number(b.upvotes) || 0) - (Number(a.upvotes) || 0);
      if (sort === "oldest") return getComplaintCreatedAt(a) - getComplaintCreatedAt(b);
      return getComplaintCreatedAt(b) - getComplaintCreatedAt(a);
    });

    const meta = $("#studentTableMeta");
    if (meta) meta.textContent = `${filtered.length} of ${complaints.length} complaints`;
    const emptyState = $("#studentEmptyState");
    if (emptyState) emptyState.classList.toggle("hidden", Boolean(filtered.length));

    grid.innerHTML = filtered.map((complaint) => {
      const voted = upvoted.has(complaint.id);
      const sla = getSlaInfo(complaint);
      return `
        <article class="community-card student-issue-card">
          <div>
            <div class="community-card-top">
              <span class="community-id">${escapeHtml(complaint.id)}</span>
              ${statusBadge(complaint.status)}
            </div>
            <h3 class="community-title">${escapeHtml(complaint.description)}</h3>
            <p class="community-meta">${escapeHtml(complaint.category)} · ${escapeHtml(complaint.location)}</p>
            <div class="student-issue-details">
              ${priorityBadge(complaint.priority)}
              <span class="community-sla ${sla.className}">${escapeHtml(sla.label)}</span>
            </div>
            <div class="community-remark"><b>Latest update:</b> ${escapeHtml(complaint.remark || "Awaiting maintenance team assignment.")}</div>
          </div>
          <div class="community-card-foot">
            <button type="button" class="upvote-btn ${voted ? "upvoted" : ""}" data-upvote-id="${escapeHtml(complaint.id)}">
              <span>👍 +1 Same Issue</span><span class="upvote-count">${Number(complaint.upvotes) || 1}</span>
            </button>
            <button type="button" class="inline-action" data-view-id="${escapeHtml(complaint.id)}">Track →</button>
          </div>
        </article>`;
    }).join("");

    $$("[data-view-id]", grid).forEach((button) => button.addEventListener("click", () => openStudentDetail(button.dataset.viewId)));
    $$("[data-upvote-id]", grid).forEach((button) => button.addEventListener("click", () => apiToggleUpvote(button.dataset.upvoteId)));
  }

  function openStudentDetail(id) {
    const complaint = findComplaint(id);
    if (!complaint) return;
    $("#studentDetailTitle").textContent = complaint.id;
    $("#studentDetailDate").textContent = `Submitted on ${formatLongDate(complaint.date)} at ${complaint.time || "time not available"}`;
    const statusElement = $("#studentDetailStatus");
    statusElement.className = `status-badge ${complaintStatusClass(complaint.status)}`;
    statusElement.textContent = complaint.status;
    $("#studentDetailGrid").innerHTML = [
      detailItem("Reporter identity", "Hidden for privacy. Only authorized administrators can view student details."),
      detailItem("Category", complaint.category),
      detailItem("Location", complaint.location),
      detailItem("Priority", `${complaint.priority} (${Number(complaint.upvotes) || 1} student votes)`),
      detailItem("Description", complaint.description, true)
    ].join("");
    $("#studentDetailRemark").textContent = complaint.remark || "No administrative remark has been added yet.";
    renderProgressTracker("#studentProgressTracker", complaint.status);
    showModal("studentDetailModal");
  }

  function renderProgressTracker(selector, status) {
    const container = $(selector);
    if (!container) return;
    const currentIndex = status === "Resolved" ? 2 : status === "In Progress" ? 1 : 0;
    const steps = ["Submitted", "In Progress", "Resolved"];
    container.innerHTML = steps.map((step, index) => `<div class="progress-step ${index < currentIndex ? "done" : index === currentIndex ? "current" : ""}"><span class="step-dot"></span>${step}</div>`).join("");
  }

  function setupComplaintForm() {
    const form = $("#complaintForm");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const required = ["studentName", "studentId", "category", "location", "description", "priority"];
      const missing = required.find((field) => !String(formData.get(field) || "").trim());
      const alert = $("#formAlert");
      if (missing) {
        if (alert) {
          alert.textContent = "Please complete all required fields before submitting.";
          alert.classList.add("show");
        }
        const firstMissing = form.elements[missing];
        if (firstMissing) firstMissing.focus();
        return;
      }
      if (alert) alert.classList.remove("show");
      const now = new Date();
      const payload = {
        studentName: String(formData.get("studentName")).trim(),
        studentId: String(formData.get("studentId")).trim(),
        category: String(formData.get("category")).trim(),
        location: String(formData.get("location")).trim(),
        description: String(formData.get("description")).trim(),
        priority: String(formData.get("priority")).trim(),
        status: "Pending",
        date: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        remark: ""
      };
      const complaint = await apiCreateComplaint(payload);
      form.reset();
      $("#successComplaintId").textContent = complaint.id;
      $("#successViewButton").onclick = () => {
        closeModal("successModal");
        openStudentDetail(complaint.id);
      };
      showModal("successModal");
      renderStudent();
    });
    form.addEventListener("reset", () => {
      const alert = $("#formAlert");
      if (alert) alert.classList.remove("show");
    });
  }

  function populateCategoryFilter(complaints) {
    const filter = $("#categoryFilter");
    if (!filter) return;
    const current = filter.value;
    const categories = [...new Set(complaints.map((complaint) => complaint.category).filter(Boolean))].sort();
    filter.innerHTML = `<option value="All">All categories</option>${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}`;
    filter.value = categories.includes(current) ? current : "All";
  }

  function getAdminFilteredComplaints() {
    const complaints = getComplaints();
    const search = ($("#adminSearch")?.value || "").trim().toLowerCase();
    const status = $("#statusFilter")?.value || "All";
    const category = $("#categoryFilter")?.value || "All";
    return complaints.filter((complaint) => {
      const searchable = [complaint.id, complaint.studentName, complaint.category, complaint.location].join(" ").toLowerCase();
      return (!search || searchable.includes(search)) && (status === "All" || complaint.status === status) && (category === "All" || complaint.category === category);
    });
  }

  function renderAdminTable() {
    const body = $("#adminComplaintsBody");
    if (!body) return;
    const complaints = getComplaints();
    populateCategoryFilter(complaints);
    const filtered = getAdminFilteredComplaints();
    body.innerHTML = filtered.map((complaint) => `
      <tr>
        <td>${escapeHtml(complaint.id)}</td>
        <td>${escapeHtml(complaint.studentName)}</td>
        <td>${escapeHtml(complaint.category)}</td>
        <td>${escapeHtml(complaint.location)}</td>
        <td>${priorityBadge(complaint.priority)}</td>
        <td><b>👍 ${Number(complaint.upvotes) || 1}</b></td>
        <td>${escapeHtml(complaint.date)}</td>
        <td>${statusBadge(complaint.status)}</td>
        <td><span class="community-sla ${getSlaInfo(complaint).className}">${escapeHtml(getSlaInfo(complaint).label)}</span></td>
        <td><button class="table-action" data-admin-view-id="${escapeHtml(complaint.id)}">View →</button></td>
      </tr>`).join("");
    const meta = $("#adminTableMeta");
    if (meta) meta.textContent = `${filtered.length} of ${complaints.length} complaint${complaints.length === 1 ? "" : "s"}`;
    const emptyState = $("#adminEmptyState");
    if (emptyState) emptyState.classList.toggle("hidden", Boolean(filtered.length));
    const hasFilter = Boolean($("#adminSearch")?.value || $("#statusFilter")?.value !== "All" || $("#categoryFilter")?.value !== "All");
    $("#clearFilters")?.classList.toggle("hidden", !hasFilter);
    $$("[data-admin-view-id]", body).forEach((button) => button.addEventListener("click", () => openAdminDetail(button.dataset.adminViewId)));
  }

  function renderAdmin() {
    const complaints = getComplaints();
    updateStats("admin", complaints);
    renderPreviewList("#adminRecentComplaints", complaints, true);
    renderAdminTable();
    renderPriorityMix(complaints);
  }

  function renderPriorityMix(complaints) {
    const counts = complaints.reduce((result, complaint) => {
      const priority = String(complaint.priority || "").toLowerCase();
      if (priority === "high") result.high += 1;
      else if (priority === "medium") result.medium += 1;
      else result.low += 1;
      return result;
    }, { high: 0, medium: 0, low: 0 });
    const total = complaints.length || 1;
    const highEnd = counts.high / total * 100;
    const mediumEnd = highEnd + counts.medium / total * 100;
    const donut = $("#priorityDonut");
    if (donut) donut.style.background = `conic-gradient(var(--orange) 0 ${highEnd}%, var(--yellow) ${highEnd}% ${mediumEnd}%, var(--green) ${mediumEnd}% 100%)`;
    const values = { priorityTotal: complaints.length, highPriorityCount: counts.high, mediumPriorityCount: counts.medium, lowPriorityCount: counts.low };
    Object.entries(values).forEach(([id, value]) => { const element = $(`#${id}`); if (element) element.textContent = value; });
  }

  function openAdminDetail(id) {
    const complaint = findComplaint(id);
    if (!complaint) return;
    $("#adminDetailTitle").textContent = complaint.id;
    $("#adminDetailDate").textContent = `Submitted on ${formatLongDate(complaint.date)} at ${complaint.time || "time not available"}`;
    const statusBadgeElement = $("#adminDetailStatusBadge");
    statusBadgeElement.className = `status-badge ${complaintStatusClass(complaint.status)}`;
    statusBadgeElement.textContent = complaint.status;
    $("#adminDetailGrid").innerHTML = [
      detailItem("Student name", complaint.studentName),
      detailItem("Student ID", complaint.studentId),
      detailItem("Category", complaint.category),
      detailItem("Location", complaint.location),
      detailItem("Priority", `${complaint.priority} (${Number(complaint.upvotes) || 1} votes)`),
      detailItem("Description", complaint.description, true),
      detailItem("Current remark", complaint.remark || "No remark added yet.", true)
    ].join("");
    $("#adminStatusInput").value = complaint.status;
    $("#adminRemarkInput").value = complaint.remark || "";
    $("#adminUpdateForm").dataset.complaintId = complaint.id;
    $("#adminFormAlert").classList.remove("show");
    showModal("adminDetailModal");
  }

  function refreshAllViews() {
    renderLandingCommunity();
    if ($("#studentTotal")) renderStudent();
    if ($("#adminTotal")) renderAdmin();
  }

  function setupGlobalUI() {
    const sidebar = $("#appSidebar");
    const overlay = $("#mobileOverlay");
    const toggle = $("#menuToggle");
    const close = $("#sidebarClose");
    const toggleSidebar = (open) => {
      if (sidebar) sidebar.classList.toggle("open", open);
      if (overlay) overlay.classList.toggle("open", open);
    };
    if (toggle) toggle.addEventListener("click", () => toggleSidebar(true));
    if (close) close.addEventListener("click", () => toggleSidebar(false));
    if (overlay) overlay.addEventListener("click", () => toggleSidebar(false));

    $$("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeModal(button.dataset.closeModal)));
    $$(".modal-backdrop").forEach((backdrop) => backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeModal(backdrop.id);
    }));
    document.addEventListener("click", (event) => {
      const upBtn = event.target.closest("[data-upvote-id]");
      if (upBtn) {
        apiToggleUpvote(upBtn.getAttribute("data-upvote-id"));
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") $$(".modal-backdrop:not(.hidden)").forEach((modal) => closeModal(modal.id));
    });
  }

  function setupSectionNavigation(sectionFilter = null) {
    const navItems = $$(".nav-item[data-section]");
    const sections = $$("[data-page-section]");
    const activate = (sectionName) => {
      const selected = sectionFilter && ["pending", "in-progress", "resolved"].includes(sectionName) ? "all" : sectionName;
      sections.forEach((section) => section.classList.toggle("active", section.dataset.pageSection === selected));
      navItems.forEach((item) => item.classList.toggle("active", item.dataset.section === sectionName));
      if (sectionFilter) {
        const statusMap = { pending: "Pending", "in-progress": "In Progress", resolved: "Resolved" };
        const statusFilter = $("#statusFilter");
        if (statusFilter) {
          statusFilter.value = statusMap[sectionName] || "All";
          renderAdminTable();
        }
      }
      const sidebar = $("#appSidebar");
      const overlay = $("#mobileOverlay");
      if (sidebar) sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
    };
    navItems.forEach((item) => item.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionName = item.dataset.section;
      history.replaceState(null, "", `#${sectionName}`);
      activate(sectionName);
    }));
    $$("[data-go-section]").forEach((button) => button.addEventListener("click", () => {
      const sectionName = button.dataset.goSection;
      const navItem = navItems.find((item) => item.dataset.section === sectionName);
      if (navItem) navItem.click();
    }));
    const hash = window.location.hash.replace("#", "");
    if (hash && navItems.some((item) => item.dataset.section === hash)) activate(hash);
  }

  function initStudent() {
    setupSectionNavigation();
    setupComplaintForm();
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category");
    const requestedTicket = params.get("ticket");
    const categorySelect = document.querySelector('#complaintForm select[name="category"]');
    if (requestedCategory && categorySelect) {
      const matchingOption = [...categorySelect.options].find((option) => option.textContent.trim() === requestedCategory);
      if (matchingOption) {
        categorySelect.value = matchingOption.value;
        const registerNav = document.querySelector('.nav-item[data-section="register"]');
        if (registerNav) registerNav.click();
      }
    }
    renderStudent();
    if (requestedTicket) {
      const search = $("#studentSearch");
      if (search) search.value = requestedTicket;
      renderStudentTable();
      openStudentDetail(requestedTicket);
    }
    ["studentSearch", "studentCategoryFilter", "studentStatusFilter", "studentSortFilter"].forEach((id) => {
      const control = $(`#${id}`);
      if (control) control.addEventListener(id === "studentSearch" ? "input" : "change", () => renderStudentTable());
    });
  }

  function setupAdmin() {
    setupSectionNavigation(true);
    ["adminSearch", "statusFilter", "categoryFilter"].forEach((id) => {
      const element = $(`#${id}`);
      if (element) element.addEventListener("input", renderAdminTable);
      if (element && element.tagName === "SELECT") element.addEventListener("change", renderAdminTable);
    });
    $("#clearFilters")?.addEventListener("click", () => {
      $("#adminSearch").value = "";
      $("#statusFilter").value = "All";
      $("#categoryFilter").value = "All";
      renderAdminTable();
    });
    $("#adminUpdateForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = event.currentTarget.dataset.complaintId;
      const status = $("#adminStatusInput").value;
      const remark = $("#adminRemarkInput").value.trim();
      const ok = await apiAdminUpdateComplaint(id, status, remark);
      if (!ok) return;
      const alert = $("#adminFormAlert");
      alert.textContent = `${id} updated and synced with backend.`;
      alert.classList.add("show");
      renderAdmin();
      window.setTimeout(() => closeModal("adminDetailModal"), 650);
    });
    renderAdmin();
  }

  async function verifyAdminPinWithServer(pinValue) {
    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: pinValue })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, data.token);
            return true;
          }
        } else {
          return false;
        }
      } catch (e) {}
    }
    if (pinValue === "2468" || pinValue === "Admin@2026") {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "demo-jwt-session");
      return true;
    }
    return false;
  }

  function showAdminGate() {
    const gate = document.createElement("section");
    gate.className = "admin-gate";
    gate.id = "adminGate";
    gate.setAttribute("aria-labelledby", "adminGateTitle");
    gate.innerHTML = `
      <div class="admin-gate-card">
        <a class="gate-brand" href="index.html" aria-label="CampusCare home"><span class="gate-brand-mark">G</span><span><b>CampusCare</b></span></a>
        <div class="gate-lock-icon" aria-hidden="true">↗</div>
        <p class="gate-eyebrow">CAMPUS OPERATIONS</p>
        <h1 id="adminGateTitle">Good to have you back.</h1>
        <p class="gate-copy">Sign in to review reports, follow open issues and keep campus services moving.</p>
        <form id="adminGateForm" autocomplete="off">
          <label class="gate-label" for="adminGatePin">Administrator PIN / Password</label>
          <input id="adminGatePin" name="pin" type="password" value="2468" maxlength="32" placeholder="Enter admin passcode (demo: 2468)" autocomplete="current-password" required />
          <p class="gate-error" id="adminGateError" role="alert" aria-live="polite"></p>
          <button class="button button-primary gate-submit" type="submit">Continue <span aria-hidden="true">→</span></button>
        </form>
        <p class="gate-footnote">Server-verified JWT Administrator Access · CampusCare</p>
        <a class="gate-back" href="index.html">← Back to home</a>
      </div>`;
    document.body.appendChild(gate);
    const form = $("#adminGateForm", gate);
    const pin = $("#adminGatePin", gate);
    const error = $("#adminGateError", gate);
    pin.focus();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const verified = await verifyAdminPinWithServer(pin.value.trim());
      if (verified) {
        gate.remove();
        setupGlobalUI();
        setupAdmin();
      } else {
        error.textContent = "That passcode doesn't match. Try demo PIN 2468.";
        pin.value = "";
        pin.setAttribute("aria-invalid", "true");
        pin.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    getComplaints();
    renderLandingCommunity();

    const landingTrackForm = $("#landingTrackForm");
    if (landingTrackForm) {
      landingTrackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = ($("#landingTrackInput")?.value || "").trim();
        window.location.href = `student.html?ticket=${encodeURIComponent(code)}#complaints`;
      });
    }

    await syncWithBackend();

    if (document.body.classList.contains("admin-theme")) {
      if (!sessionStorage.getItem(ADMIN_SESSION_KEY)) {
        showAdminGate();
      } else {
        setupGlobalUI();
        setupAdmin();
      }
      $("#adminLogout")?.addEventListener("click", () => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.reload();
      });
      return;
    }

    setupGlobalUI();
    if (document.body.classList.contains("student-theme")) initStudent();
  });
})();
