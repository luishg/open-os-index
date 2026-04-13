# Changelog

All notable changes to the Open-OS Index (rubric + audits + site) are recorded here, newest first.

Format:

- `YYYY-MM-DD — <scope>(<slug>): <summary>`

Scopes:

- `add` — first-time audit of a system.
- `update` — re-audit of an existing system.
- `rubric` — change to the rubric.
- `site` — change to the static site.
- `chore` — housekeeping.

---

## 2026

- 2026-04-13 — audit(fedora-workstation): update v43 against rubric v2.0, grade A (was A), overall 89 (was 87).
- 2026-04-13 — audit(windows-11): update v25H2 against rubric v2.0, grade C (was D), overall 41 (was 33).
- 2026-04-13 — audit(grapheneos): update v2026020400 against rubric v2.0, grade A (was A), overall 89 (was 88).
- 2026-04-13 — rubric: v2.0 bump — 9 dimensions across owner / ecosystem / technical axes; new Developer Autonomy, App Distribution Freedom, Device Neutrality; Owner Authority split from former General-Purpose Computing; weights rebalanced to total 100.
- 2026-04-13 — audit(fedora-workstation): initial v43, grade A, overall 87.
- 2026-04-13 — audit(windows-11): initial v25H2, grade D, overall 33.
- 2026-04-13 — audit(grapheneos): initial v2026020400, grade A, overall 88.
- 2026-04-13 — chore: AUDIT.md rewritten for Claude Code agents — tool-specific calls (Read/Edit/Bash/WebSearch/WebFetch), typed source buckets, compact dimension probes, Edit templates for pending→audited promotion, automated validation steps and a self-review checklist.
- 2026-04-13 — data: refined initial list — removed CalyxOS, added HarmonyOS (mobile) and Ubuntu (desktop); 13 total (6 mobile + 7 desktop).
- 2026-04-13 — site: new tagline "The Freedom Index for Operating Systems"; added `pending` status support in data and UI; seeded 12 popular operating systems as pending audits; reframed disclaimer as "how to read a grade".
- 2026-04-13 — chore: initial repository scaffold — rubric v1.0, empty systems database, static site, agent audit protocol.
