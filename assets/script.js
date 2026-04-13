// Open-OS Index — static site script
// Fetches data/systems.json + data/rubric.json, renders the ranking.
// No framework. No build step.

(function () {
  "use strict";

  const els = {
    status: document.getElementById("status"),
    list: document.getElementById("ranking-list"),
    filterCategory: document.getElementById("filter-category"),
    filterGrade: document.getElementById("filter-grade"),
    rubricBadge: document.getElementById("rubric-version-badge"),
    updatedBadge: document.getElementById("updated-at-badge"),
    countsBadge: document.getElementById("counts-badge"),
    tpl: document.getElementById("tpl-row"),
  };

  const state = {
    rubric: null,
    systems: [],
    filters: { category: "", grade: "" },
  };

  async function loadJSON(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(url + " → HTTP " + res.status);
    return res.json();
  }

  function gradeFor(score, grades) {
    const sorted = [...grades].sort((a, b) => b.min - a.min);
    return sorted.find((g) => score >= g.min) || sorted[sorted.length - 1];
  }

  function computeOverall(scores, dimensions) {
    let sum = 0;
    for (const d of dimensions) {
      const v = typeof scores[d.id] === "number" ? scores[d.id] : 0;
      sum += v * d.weight;
    }
    return Math.round(sum / 100);
  }

  function isPending(system) {
    return system.status === "pending";
  }

  function populateFilters() {
    if (!state.rubric) return;

    for (const c of state.rubric.categories || []) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.label;
      els.filterCategory.appendChild(opt);
    }

    for (const g of state.rubric.grades) {
      const opt = document.createElement("option");
      opt.value = g.grade;
      opt.textContent = `${g.grade} — ${g.label}`;
      els.filterGrade.appendChild(opt);
    }

    const pendingOpt = document.createElement("option");
    pendingOpt.value = "pending";
    pendingOpt.textContent = "Pending audit";
    els.filterGrade.appendChild(pendingOpt);

    els.filterCategory.addEventListener("change", (e) => {
      state.filters.category = e.target.value;
      render();
    });
    els.filterGrade.addEventListener("change", (e) => {
      state.filters.grade = e.target.value;
      render();
    });
  }

  function applyFilters(systems) {
    return systems.filter((s) => {
      if (state.filters.category && s.category !== state.filters.category) return false;
      if (state.filters.grade) {
        if (state.filters.grade === "pending" && !isPending(s)) return false;
        if (state.filters.grade !== "pending" && (isPending(s) || s.grade !== state.filters.grade)) return false;
      }
      return true;
    });
  }

  function renderPendingRow(system) {
    const frag = els.tpl.content.cloneNode(true);
    const row = frag.querySelector(".row");
    const head = frag.querySelector(".row-head");
    const body = frag.querySelector(".row-body");

    row.classList.add("pending");

    frag.querySelector(".col-rank").textContent = "—";
    frag.querySelector(".name").textContent = system.name;

    const catLabel =
      (state.rubric.categories || []).find((c) => c.id === system.category)?.label ||
      system.category ||
      "";
    frag.querySelector(".category").textContent = catLabel;

    const gradePill = frag.querySelector(".grade-pill");
    gradePill.textContent = "Pending";
    gradePill.dataset.grade = "pending";

    frag.querySelector(".col-score").innerHTML = '<span class="score-num">—</span>';

    // Body: only description + audit queue note
    frag.querySelector(".factors").remove();
    frag.querySelector(".lists").remove();
    frag.querySelector(".evidence").remove();

    frag.querySelector(".summary").textContent =
      system.description || "This system is in the audit queue.";

    frag.querySelector(".audit-meta").innerHTML =
      'In the audit queue · scoring will appear here once audited · ' +
      '<a href="https://github.com/luishg/open-os-index/blob/main/AUDIT.md">see the audit protocol</a>';

    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", open ? "false" : "true");
      body.hidden = open;
    });

    return frag;
  }

  function renderAuditedRow(system, rank) {
    const frag = els.tpl.content.cloneNode(true);
    const head = frag.querySelector(".row-head");
    const body = frag.querySelector(".row-body");

    frag.querySelector(".col-rank").textContent = "#" + rank;
    frag.querySelector(".name").textContent = system.name;

    const catLabel =
      (state.rubric.categories || []).find((c) => c.id === system.category)?.label ||
      system.category ||
      "";
    frag.querySelector(".category").textContent = catLabel;

    const gradePill = frag.querySelector(".grade-pill");
    gradePill.textContent = system.grade;
    gradePill.dataset.grade = system.grade;

    frag.querySelector(".score-num").textContent = system.overall;

    const factors = frag.querySelector(".factors");
    const axes = state.rubric.axes || [];
    // Group dimensions by axis in rubric order
    const byAxis = {};
    for (const d of state.rubric.dimensions) {
      const key = d.axis || "_other";
      (byAxis[key] = byAxis[key] || []).push(d);
    }
    // Preserve declared axis order; fall back to any "_other" bucket last
    const axisOrder = [...axes.map(a => a.id), "_other"];
    for (const axisId of axisOrder) {
      const group = byAxis[axisId];
      if (!group || group.length === 0) continue;
      const axisInfo = axes.find(a => a.id === axisId);
      const axisBlock = document.createElement("div");
      axisBlock.className = "factor-axis";
      const label = axisInfo?.label || "Other";
      axisBlock.innerHTML = `<h5 class="factor-axis-label">${escapeHtml(label)}</h5>`;
      const axisGrid = document.createElement("div");
      axisGrid.className = "factor-axis-grid";
      for (const d of group) {
        const val =
          typeof system.scores?.[d.id] === "number" ? system.scores[d.id] : 0;
        const factor = document.createElement("div");
        factor.className = "factor";
        factor.innerHTML = `
          <span class="factor-label">${escapeHtml(d.label)}</span>
          <span class="factor-value">${val}</span>
          <span class="factor-bar"><span style="width:${Math.max(0, Math.min(100, val))}%"></span></span>
        `;
        axisGrid.appendChild(factor);
      }
      axisBlock.appendChild(axisGrid);
      factors.appendChild(axisBlock);
    }

    const hiUl = frag.querySelector(".list-highlights ul");
    (system.highlights || []).forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      hiUl.appendChild(li);
    });
    if (!(system.highlights || []).length) {
      frag.querySelector(".list-highlights").remove();
    }

    const coUl = frag.querySelector(".list-concerns ul");
    (system.concerns || []).forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c;
      coUl.appendChild(li);
    });
    if (!(system.concerns || []).length) {
      frag.querySelector(".list-concerns").remove();
    }

    frag.querySelector(".summary").textContent = system.summary || "";

    const evUl = frag.querySelector(".evidence ul");
    (system.evidence || []).forEach((e) => {
      const li = document.createElement("li");
      const factorLabel =
        state.rubric.dimensions.find((d) => d.id === e.factor)?.short ||
        e.factor ||
        "";
      li.innerHTML = `<span class="factor-tag">${escapeHtml(factorLabel)}</span><a href="${escapeAttr(e.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.note || e.url)}</a>`;
      evUl.appendChild(li);
    });
    if (!(system.evidence || []).length) {
      frag.querySelector(".evidence").remove();
    }

    const meta = [];
    if (system.auditedVersion) meta.push("Version " + system.auditedVersion);
    if (system.auditedAt) meta.push("Audited " + system.auditedAt);
    if (system.rubricVersion) meta.push("Rubric v" + system.rubricVersion);
    frag.querySelector(".audit-meta").textContent = meta.join(" · ");

    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", open ? "false" : "true");
      body.hidden = open;
    });

    return frag;
  }

  function insertDivider(label) {
    const li = document.createElement("li");
    li.className = "row-divider";
    li.innerHTML = `<span>${escapeHtml(label)}</span>`;
    els.list.appendChild(li);
  }

  function insertGradeDivider(grade, label) {
    const li = document.createElement("li");
    li.className = "row-divider grade-band";
    li.innerHTML =
      `<span class="gb-pill" data-grade="${escapeAttr(grade)}">${escapeHtml(grade)}</span>` +
      `<span class="gb-label">${escapeHtml(label)}</span>`;
    els.list.appendChild(li);
  }

  function render() {
    const filtered = applyFilters(state.systems);

    const audited = filtered
      .filter((s) => !isPending(s))
      .sort((a, b) => (b.overall || 0) - (a.overall || 0));

    const pending = filtered
      .filter(isPending)
      .sort((a, b) => a.name.localeCompare(b.name));

    els.list.innerHTML = "";

    if (!audited.length && !pending.length) {
      els.status.textContent = "No systems match the current filters.";
      els.status.classList.remove("error");
      return;
    }
    els.status.textContent = "";

    if (audited.length) {
      let currentGrade = null;
      audited.forEach((sys, i) => {
        if (sys.grade !== currentGrade) {
          currentGrade = sys.grade;
          const info = (state.rubric.grades || []).find((g) => g.grade === currentGrade);
          insertGradeDivider(currentGrade, info?.label || "");
        }
        els.list.appendChild(renderAuditedRow(sys, i + 1));
      });
    }

    if (pending.length) {
      insertDivider("Pending audit · scoring in the queue");
      pending.forEach((sys) => {
        els.list.appendChild(renderPendingRow(sys));
      });
    }
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  async function boot() {
    els.status.textContent = "Loading…";
    try {
      const [rubric, data] = await Promise.all([
        loadJSON("data/rubric.json"),
        loadJSON("data/systems.json"),
      ]);
      state.rubric = rubric;

      state.systems = (data.systems || []).map((s) => {
        if (isPending(s)) return s;
        const overall =
          typeof s.overall === "number"
            ? s.overall
            : computeOverall(s.scores || {}, rubric.dimensions);
        const grade = s.grade || gradeFor(overall, rubric.grades).grade;
        return { ...s, overall, grade };
      });

      els.rubricBadge.textContent = "Rubric v" + rubric.version;
      els.updatedBadge.textContent = "Last updated " + (data.updatedAt || "—");

      const total = state.systems.length;
      const auditedCount = state.systems.filter((s) => !isPending(s)).length;
      const pendingCount = total - auditedCount;
      els.countsBadge.textContent =
        `${total} systems · ${auditedCount} audited · ${pendingCount} pending`;

      populateFilters();
      render();
    } catch (err) {
      console.error(err);
      els.status.textContent = "Could not load data. " + err.message;
      els.status.classList.add("error");
    }
  }

  boot();
})();
