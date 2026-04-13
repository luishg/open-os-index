# Open-OS Index — The Freedom Index for Operating Systems

A public ranking that certifies how operating systems treat the people who **own** devices, the **developers** who build software for them, and the **users** who install it.

🌐 **Live site:** [index.open-os.com](https://index.open-os.com)

Nine weighted factors across three axes — **owner sovereignty**, **ecosystem freedom**, **technical openness** — every grade backed by cited evidence and a versioned rubric.

**Status:** rubric `v2.0` · 11 audits published · 2 pending.

## Current ranking

<!-- Auto-synced manually with data/systems.json on every audit. See live site for the full detail. -->

| # | System | Category | Version | Overall | Grade |
| :-: | :--- | :--- | :--- | :-: | :-: |
| 1 | GrapheneOS | mobile-os | 2026020400 | **89** | **A** |
| 2 | Fedora Workstation | desktop-os | 43 | **89** | **A** |
| 3 | Arch Linux | desktop-os | 2026.04.01 | **88** | **A** |
| 4 | LineageOS | mobile-os | 23.2 | **84** | **A** |
| 5 | Ubuntu | desktop-os | 24.04 LTS | **81** | **A** |
| 6 | Android (Stock on Pixel) | mobile-os | 16 | 41 | C |
| 7 | Windows 11 | desktop-os | 25H2 | 41 | C |
| 8 | macOS Tahoe | desktop-os | 26 | 39 | D |
| 9 | ChromeOS | desktop-os | 146 | 26 | D |
| 10 | iOS | mobile-os | 26 | 15 | F |
| 11 | HarmonyOS | mobile-os | 5.0 | 13 | F |

Pending: Samsung One UI · Debian Stable.

## The rubric (v2.0)

Scores are integers `0–100` per factor. The overall is a weighted average that maps to a letter grade (S ≥ 90, A ≥ 75, B ≥ 60, C ≥ 40, D ≥ 20, F ≥ 0).

### Axis A — Owner sovereignty (45)
| Factor | Weight |
| :--- | :-: |
| Owner Authority — bootloader, root, firmware, attestation | 15 |
| Software Freedom — FOSS license, source, buildability | 12 |
| Privacy — telemetry, forced accounts, data exfiltration | 10 |
| Transparency — reproducible builds, audits, changelogs | 8 |

### Axis B — Ecosystem freedom (40)
| Factor | Weight |
| :--- | :-: |
| Developer Autonomy — no notarisation, no mandatory registration, direct distribution | 15 |
| App Distribution Freedom — no scare dialogs, no loaded terminology, no capability degradation | 13 |
| Device Neutrality — parity of APIs, replaceable defaults, no engine monocultures | 12 |

### Axis C — Technical openness (15)
| Factor | Weight |
| :--- | :-: |
| Interoperability — open formats, documented APIs, data export | 8 |
| Portability — architectures, no hardware binding, reinstall freedom | 7 |

See [`RUBRIC.md`](RUBRIC.md) for the full definitions, anti-patterns, and evidence requirements.

## Repo structure

No build step, no framework, no toolchain. Open [`index.html`](index.html) in a browser and it works.

| File / folder | Purpose |
| :--- | :--- |
| [`index.html`](index.html) | The entire site. Renders the ranking from `data/systems.json`. |
| [`assets/`](assets/) | Styles and client-side script. Zero dependencies. |
| [`data/systems.json`](data/systems.json) | The database: every audited OS and its scores. |
| [`data/rubric.json`](data/rubric.json) | Machine-readable mirror of the rubric (axes + weights + grade bands). |
| [`RUBRIC.md`](RUBRIC.md) | The scoring criteria, in plain English. |
| [`AUDIT.md`](AUDIT.md) | The full audit protocol — a Claude Code agent can run it end-to-end. |
| [`DISCLAIMER.md`](DISCLAIMER.md) | How to read a grade. |
| [`CHANGELOG.md`](CHANGELOG.md) | History of every audit, rubric change and site update. |

## How audits work

1. A human (or scheduler) asks an agent: *"audit `<target>`"*.
2. The agent reads [`AUDIT.md`](AUDIT.md) + [`RUBRIC.md`](RUBRIC.md) + current `data/systems.json`.
3. It researches the target using `WebSearch` + `WebFetch`, scoring each of the 9 factors 0–100 with cited primary evidence.
4. It patches `data/systems.json`, appends to [`CHANGELOG.md`](CHANGELOG.md), commits and pushes to `main`.
5. GitHub Pages redeploys the static site automatically.

For audits of the current pilot batch we've run single and parallel subagent flows — a typical audit takes ~15–20 tool calls and under 4 minutes.

## Contributing

- **Suggest a target** or **challenge a score** — open an issue with counter-evidence (primary sources preferred).
- **Propose a rubric change** — open a PR against [`RUBRIC.md`](RUBRIC.md) + [`data/rubric.json`](data/rubric.json) with rationale. Major changes bump the rubric to a new version and trigger re-audit of all affected entries.
- **Fork and reuse** — content is CC BY 4.0, code is MIT.

## License

- **Content** (rubric, audits, narrative): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Code** (HTML, CSS, JS, tooling): [MIT](LICENSE)
