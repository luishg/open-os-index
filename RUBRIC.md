# The Open-OS Sovereignty Rubric

**Version:** 1.0
**Status:** active

Every operating system in the Index is scored against this rubric. Scores are integers `0–100` per dimension; the overall score is a weighted average.

## Dimensions

| # | Dimension | Weight | What it measures |
| :-: | :--- | :-: | :--- |
| 1 | **General-Purpose Computing** | 20 | Bootloader unlockable, root/admin path, sideloading, no OS-level store exclusivity, no hardware-attestation gating of third-party code. |
| 2 | **Degree of Freedom** | 20 | FOSS license, availability of source code, ease of build-from-source, forkability. |
| 3 | **Privacy** | 15 | Telemetry off or opt-in, local-first defaults, no forced accounts, end-to-end encryption where relevant. |
| 4 | **Transparency** | 15 | Reproducible builds, public security audits, honest changelogs, binaries↔source mapping. |
| 5 | **Interoperability** | 12 | Open formats, open APIs, export/portability, compliance with open standards. |
| 6 | **Neutrality** | 10 | No pre-installed ads or bloat, unbiased defaults, absence of vendor steering. |
| 7 | **Portability** | 8 | Architecture breadth, no hardware-ID binding, install/reinstall freedom. |

Weights add up to 100 and are tuned so the two dimensions closest to sovereignty (General-Purpose Computing + Degree of Freedom) dominate.

## Scoring guide

For each dimension, assign an integer from 0 to 100:

| Band | Meaning |
| :-: | :--- |
| **90–100** | Excellent. Documented, principled, no significant compromise. |
| **70–89** | Strong. Minor issues, acknowledged and bounded. |
| **50–69** | Mixed. Real trade-offs or partial support. |
| **30–49** | Weak. User-hostile defaults, limited recourse. |
| **0–29** | Absent or actively opposing the principle. |

The **overall score** is:

```
overall = Σ (dimension_score × dimension_weight) / 100
```

Rounded to the nearest integer.

## Grading bands

The overall score maps to a letter grade shown on the site.

| Grade | Score | Label |
| :-: | :-: | :--- |
| **S** | 90–100 | Absolute Sovereignty |
| **A** | 75–89 | High Sovereignty |
| **B** | 60–74 | Functional Sovereignty |
| **C** | 40–59 | Controlled Environment |
| **D** | 20–39 | Walled Garden |
| **F** | 0–19 | Hostile |

Grade bands are intentionally uneven with reality: most commercial mobile OSes will cluster in C/D, most community-governed distros in A/S. That clustering is itself informative.

## Evidence requirements

Every score must be backed by at least one cited URL in the system's `evidence` array. Acceptable evidence, in order of preference:

1. **Primary** — official documentation, source repository, policy pages, filings.
2. **Secondary** — reproducible technical tests, regulatory submissions, academic work.
3. **Community** — specialized journalism, community wikis, corroborated user reports.

If evidence is thin, score conservatively and record the limitation in `concerns`. Do not guess.

## Scope (what an OS audit covers)

- **Mobile OS** — the OS as shipped on its representative hardware (e.g. GrapheneOS on Pixel; stock Android on Pixel; iOS on iPhone).
- **Desktop OS** — the distribution as installed with its default ISO and default installer flow.

Variants (hardened mode, locked bootloader, local-account-only Windows install, etc.) may be added later as separate entries once the design supports it. The default shipping configuration is what the primary grade reflects.

## Versioning

This rubric is versioned with semver:

- **Patch** (`1.0.x`) — typos, clarifications, no semantic change.
- **Minor** (`1.x.0`) — new sub-criteria or evidence rules; existing scores still valid.
- **Major** (`x.0.0`) — weight changes or removed dimensions; all affected audits must be re-run.

Every entry in `data/systems.json` pins the `rubricVersion` it was scored against. Rubric changes are tracked in `CHANGELOG.md`.
