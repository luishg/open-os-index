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
    // grades are sorted high→low by min; pick first match.
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
      if (state.filters.grade && s.grade !== state.filters.grade) return false;
      return true;
    });
  }

  function renderRow(system, rank) {
    const frag = els.tpl.content.cloneNode(true);
    const row = frag.querySelector(".row");
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

    // Factors
    const factors = frag.querySelector(".factors");
    for (const d of state.rubric.dimensions) {
      const val =
        typeof system.scores?.[d.id] === "number" ? system.scores[d.id] : 0;
      const factor = document.createElement("div");
      factor.className = "factor";
      factor.innerHTML = `
        <span class="factor-label">${escapeHtml(d.label)}</span>
        <span class="factor-value">${val}</span>
        <span class="factor-bar"><span style="width:${Math.max(0, Math.min(100, val))}%"></span></span>
      `;
      factors.appendChild(factor);
    }

    // Highlights
    const hiUl = frag.querySelector(".list-highlights ul");
    (system.highlights || []).forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      hiUl.appendChild(li);
    });
    if (!(system.highlights || []).length) {
      frag.querySelector(".list-highlights").remove();
    }

    // Concerns
    const coUl = frag.querySelector(".list-concerns ul");
    (system.concerns || []).forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c;
      coUl.appendChild(li);
    });
    if (!(system.concerns || []).length) {
      frag.querySelector(".list-concerns").remove();
    }

    // Summary
    frag.querySelector(".summary").textContent = system.summary || "";

    // Evidence
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

    // Audit meta
    const meta = [];
    if (system.auditedVersion) meta.push("Version " + system.auditedVersion);
    if (system.auditedAt) meta.push("Audited " + system.auditedAt);
    if (system.rubricVersion) meta.push("Rubric v" + system.rubricVersion);
    frag.querySelector(".audit-meta").textContent = meta.join(" · ");

    // Toggle
    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", open ? "false" : "true");
      body.hidden = open;
    });

    return frag;
  }

  function render() {
    const filtered = applyFilters(state.systems);
    const sorted = [...filtered].sort((a, b) => (b.overall || 0) - (a.overall || 0));

    els.list.innerHTML = "";

    if (!sorted.length) {
      els.status.textContent = state.systems.length
        ? "No systems match the current filters."
        : "No audits yet. The first systems will appear here shortly.";
      els.status.classList.remove("error");
      return;
    }

    els.status.textContent = "";
    sorted.forEach((sys, i) => {
      els.list.appendChild(renderRow(sys, i + 1));
    });
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

      // Ensure each system has a grade + overall derived from rubric if missing.
      state.systems = (data.systems || []).map((s) => {
        const overall =
          typeof s.overall === "number"
            ? s.overall
            : computeOverall(s.scores || {}, rubric.dimensions);
        const grade = s.grade || gradeFor(overall, rubric.grades).grade;
        return { ...s, overall, grade };
      });

      els.rubricBadge.textContent = "Rubric v" + rubric.version;
      els.updatedBadge.textContent = "Last updated " + (data.updatedAt || "—");

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
