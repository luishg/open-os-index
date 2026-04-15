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

- 2026-04-15 — audit(e-os): initial v3.6, grade A, overall 84.
- 2026-04-13 — site: visual iteration v2.1 — removed header mark, rewrote hero copy to reflect the three-axis rubric (owner / ecosystem / technical), grouped factors by axis in the row detail, added grade-band dividers in the ranking, expanded methodology with axis cards and grade legend, typographic polish, focus-visible states, smoother transitions, minimal geometric favicon.
- 2026-04-13 — audit(harmonyos): initial v5.0, grade F, overall 13.
- 2026-04-13 — audit(chromeos): initial v146, grade D, overall 26.
- 2026-04-13 — audit(ubuntu): initial v24.04 LTS, grade A, overall 81.
- 2026-04-13 — audit(lineageos): initial v23.2, grade A, overall 84.
- 2026-04-13 — audit(arch-linux): initial v2026.04.01, grade A, overall 88.
- 2026-04-13 — audit(macos-tahoe): initial v26, grade D, overall 39. Slug renamed from `macos-sequoia` (current shipping macOS is Tahoe, v26).
- 2026-04-13 — audit(ios): initial v26, grade F, overall 15.
- 2026-04-13 — audit(android-stock-pixel): initial v16, grade C, overall 41.
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
