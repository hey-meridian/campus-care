(function () {
  "use strict";

  const STORAGE_KEY = "campuscare_complaints";
  const SAMPLE_COMPLAINTS = [
    { id: "CMP001", studentName: "Aarav Sharma", studentId: "2604827", category: "Electrical", location: "CSE Block - Room 204", description: "Ceiling fan is not working.", priority: "High", status: "Pending", date: "19 Sep 2026", time: "09:15 AM", remark: "" },
    { id: "CMP002", studentName: "Priya Verma", studentId: "2601936", category: "Plumbing", location: "Block B - First Floor", description: "Water leakage near washroom.", priority: "High", status: "In Progress", date: "18 Sep 2026", time: "11:40 AM", remark: "Maintenance team is checking the leakage source." },
    { id: "CMP003", studentName: "Rohan Singh", studentId: "2607054", category: "Furniture", location: "Mechanical Lab", description: "Two chairs are damaged.", priority: "Low", status: "Resolved", date: "17 Sep 2026", time: "02:20 PM", remark: "Replacement chairs have been placed in the lab." },
    { id: "CMP004", studentName: "Ananya Gupta", studentId: "2608612", category: "Internet/Network", location: "Library", description: "Wi-Fi connection is unstable.", priority: "Medium", status: "Resolved", date: "16 Sep 2026", time: "04:05 PM", remark: "Network access point was restarted and tested." }
  ];

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  function getComplaints() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn("CampusCare could not read saved complaints.", error);
    }
    saveComplaints(SAMPLE_COMPLAINTS);
    return SAMPLE_COMPLAINTS.slice();
  }

  function saveComplaints(complaints) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }

  function nextComplaintId(complaints) {
    const maxNumber = complaints.reduce((max, complaint) => {
      const number = Number(String(complaint.id || "").replace(/\D/g, ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0);
    return `CMP${String(maxNumber + 1).padStart(3, "0")}`;
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
    return getComplaints().find((complaint) => complaint.id === id);
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
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") $$(".modal-backdrop:not(.hidden)").forEach((modal) => closeModal(modal.id));
    });
    window.addEventListener("storage", () => {
      if (document.body.classList.contains("student-theme")) renderStudent();
      if (document.body.classList.contains("admin-theme")) renderAdmin();
    });
  }

  function setupSectionNavigation(sectionFilter = null) {
    const navItems = $$(".nav-item[data-section]");
    const sections = $$("[data-page-section]");
    const activate = (sectionName) => {
      const selected = sectionFilter && ["pending", "in-progress", "resolved"].includes(sectionName) ? "all" : sectionName;
      sections.forEach((section) => section.classList.toggle("active", section.dataset.pageSection === selected));
      navItems.forEach((item) => item.classList.toggle("active", item.dataset.section === sectionName));
      const target = sections.find((section) => section.dataset.pageSection === selected);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
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

  function renderPreviewList(selector, complaints, isAdmin = false) {
    const container = $(selector);
    if (!container) return;
    const latest = complaints.slice().sort(sortNewest).slice(0, 4);
    if (!latest.length) {
      container.innerHTML = `<div class="empty-state"><span>◌</span><h3>No complaints yet</h3><p>New submissions will appear here.</p></div>`;
      return;
    }
    container.innerHTML = latest.map((complaint) => `
      <button class="preview-complaint" data-view-id="${escapeHtml(complaint.id)}" aria-label="View ${escapeHtml(complaint.id)}">
        <span><b>${escapeHtml(complaint.id)}</b><small>${escapeHtml(complaint.category)}</small></span>
        <span class="complaint-location">${escapeHtml(complaint.location)}</span>
        ${isAdmin ? `<span>${escapeHtml(complaint.studentName)}</span>` : `<span>${escapeHtml(complaint.date)}</span>`}
        <span>${statusBadge(complaint.status)}</span>
      </button>`).join("");
    $$("[data-view-id]", container).forEach((button) => button.addEventListener("click", () => {
      if (isAdmin) openAdminDetail(button.dataset.viewId);
      else openStudentDetail(button.dataset.viewId);
    }));
  }

  function sortNewest(a, b) {
    const aNumber = Number(String(a.id || "").replace(/\D/g, ""));
    const bNumber = Number(String(b.id || "").replace(/\D/g, ""));
    return bNumber - aNumber;
  }

  function renderStudent() {
    const complaints = getComplaints();
    updateStats("student", complaints);
    renderPreviewList("#studentRecentComplaints", complaints);
    renderStudentTable(complaints);
  }

  function renderStudentTable(complaints = getComplaints()) {
    const body = $("#studentComplaintsBody");
    if (!body) return;
    const search = ($("#studentSearch")?.value || "").trim().toLowerCase();
    const filtered = complaints.filter((complaint) => [complaint.id, complaint.category, complaint.location, complaint.priority, complaint.status].some((value) => String(value).toLowerCase().includes(search))).sort(sortNewest);
    const emptyState = $("#studentEmptyState");
    if (emptyState) emptyState.classList.toggle("hidden", Boolean(filtered.length));
    const meta = $("#studentTableMeta");
    if (meta) meta.textContent = `${filtered.length} complaint${filtered.length === 1 ? "" : "s"}`;
    body.innerHTML = filtered.map((complaint) => `
      <tr>
        <td>${escapeHtml(complaint.id)}</td>
        <td>${escapeHtml(complaint.category)}</td>
        <td>${escapeHtml(complaint.location)}</td>
        <td>${priorityBadge(complaint.priority)}</td>
        <td>${escapeHtml(complaint.date)}</td>
        <td>${statusBadge(complaint.status)}</td>
        <td><button class="table-action" data-view-id="${escapeHtml(complaint.id)}">View →</button></td>
      </tr>`).join("");
    $$("[data-view-id]", body).forEach((button) => button.addEventListener("click", () => openStudentDetail(button.dataset.viewId)));
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
      detailItem("Priority", complaint.priority),
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
    form.addEventListener("submit", (event) => {
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
      const studentId = String(formData.get("studentId") || "").trim();
      if (alert) alert.classList.remove("show");
      const complaints = getComplaints();
      const now = new Date();
      const complaint = {
        id: nextComplaintId(complaints),
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
      complaints.push(complaint);
      saveComplaints(complaints);
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

  function initStudent() {
    setupSectionNavigation();
    setupComplaintForm();
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
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
    const search = $("#studentSearch");
    if (search) search.addEventListener("input", () => renderStudentTable());
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
    }).sort(sortNewest);
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
        <td>${escapeHtml(complaint.date)}</td>
        <td>${statusBadge(complaint.status)}</td>
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
      detailItem("Priority", complaint.priority),
      detailItem("Description", complaint.description, true),
      detailItem("Current remark", complaint.remark || "No remark added yet.", true)
    ].join("");
    $("#adminStatusInput").value = complaint.status;
    $("#adminRemarkInput").value = complaint.remark || "";
    $("#adminUpdateForm").dataset.complaintId = complaint.id;
    $("#adminFormAlert").classList.remove("show");
    showModal("adminDetailModal");
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
    $("#adminUpdateForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = event.currentTarget.dataset.complaintId;
      const complaints = getComplaints();
      const complaint = complaints.find((item) => item.id === id);
      if (!complaint) return;
      complaint.status = $("#adminStatusInput").value;
      complaint.remark = $("#adminRemarkInput").value.trim();
      saveComplaints(complaints);
      const alert = $("#adminFormAlert");
      alert.textContent = `${complaint.id} updated successfully.`;
      alert.classList.add("show");
      renderAdmin();
      window.setTimeout(() => closeModal("adminDetailModal"), 650);
    });
    renderAdmin();
  }

  // Demonstration-only client-side gate. This is not production authentication:
  // the PIN is present in frontend code and can be bypassed by a determined user.
  const ADMIN_DEMO_PIN = "2468";
  const ADMIN_SESSION_KEY = "campuscare_admin_demo_session";

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
          <label class="gate-label" for="adminGatePin">Administrator PIN</label>
          <input id="adminGatePin" name="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="12" placeholder="Enter admin PIN" autocomplete="current-password" required />
          <p class="gate-error" id="adminGateError" role="alert" aria-live="polite"></p>
          <button class="button button-primary gate-submit" type="submit">Continue <span aria-hidden="true">→</span></button>
        </form>
        <p class="gate-footnote">Administrator access · CampusCare</p>
        <a class="gate-back" href="index.html">← Back to home</a>
      </div>`;
    document.body.appendChild(gate);
    const form = $("#adminGateForm", gate);
    const pin = $("#adminGatePin", gate);
    const error = $("#adminGateError", gate);
    pin.focus();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (pin.value === ADMIN_DEMO_PIN) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "unlocked");
        gate.remove();
        setupGlobalUI();
        setupAdmin();
      } else {
        error.textContent = "That PIN doesn't match. Please try again.";
        pin.value = "";
        pin.setAttribute("aria-invalid", "true");
        pin.focus();
      }
    });
  }

  function setupAdminAccess() {
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "unlocked") {
      showAdminGate();
      return;
    }
    setupGlobalUI();
    setupAdmin();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("admin-theme")) {
      setupAdminAccess();
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