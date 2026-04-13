# Agent Audit Protocol

> If you are an agent and you were asked to audit an operating system, this file is your only source of instructions. Read it top to bottom before touching anything.

## 0. Prerequisites

Before starting, confirm:

1. You have read this file, [`RUBRIC.md`](RUBRIC.md) and [`DISCLAIMER.md`](DISCLAIMER.md).
2. You have loaded the current [`data/systems.json`](data/systems.json) and [`data/rubric.json`](data/rubric.json).
3. You have write access to this repository and can commit to `main`.
4. You have a specific target. A target is the name of an operating system + (optional) version. Example: "GrapheneOS 2025", "Windows 11", "Fedora Workstation 40".

If any of those is missing, stop and report what is missing.

---

## A. Adding a new system

### A.1 Confirm it is a new entry

Search `data/systems.json` for a matching `slug`. If it already exists, switch to section **B** (re-audit).

Generate a stable `slug`:

- kebab-case.
- Include the vendor/variant where disambiguation matters (`aosp-pixel`, `ios-stock`, `macos-sequoia`).
- Do not include audit date or version in the slug.

### A.2 Research the target

Gather evidence from these source types, in order of preference:

1. Official documentation of the OS.
2. The OS's source repository (if any).
3. Official policy / privacy / security pages.
4. Regulatory filings, court documents, published security audits.
5. Specialized technical journalism (corroborated).

Collect, at a minimum, enough evidence to answer, with a cited URL, each of the sub-questions under each dimension in §C.

Reject:

- Marketing copy unless it makes a verifiable technical claim.
- Single-source community rumors.
- Outdated information (pre-dates the version you are auditing).

### A.3 Score each dimension

Follow §C. For each of the seven dimensions, assign an integer 0–100 and record at least one supporting evidence URL in the `evidence` array.

If you cannot find evidence for a dimension, score conservatively (lean lower) and add a one-line entry to `concerns`.

### A.4 Compute the overall score and grade

Use the weights in [`data/rubric.json`](data/rubric.json):

```
overall = round( Σ (score[dim] × weight[dim]) / 100 )
```

Map to a grade using the bands in `data/rubric.json`.

### A.5 Write the entry

Append a new object to `systems` in `data/systems.json`. Required fields:

```jsonc
{
  "slug": "example-os",
  "name": "Example OS",
  "category": "mobile-os",          // or "desktop-os"
  "auditedVersion": "2025.4",
  "auditedAt": "YYYY-MM-DD",         // today, ISO date
  "rubricVersion": "1.0",
  "scores": {
    "generalPurposeComputing": 0,
    "freedom": 0,
    "privacy": 0,
    "transparency": 0,
    "interoperability": 0,
    "neutrality": 0,
    "portability": 0
  },
  "overall": 0,
  "grade": "F",
  "summary": "One plain-English paragraph (2–4 sentences) summarizing the verdict.",
  "highlights": [
    "Short positive statements, each one concrete and verifiable."
  ],
  "concerns": [
    "Short negative statements, each one concrete and verifiable."
  ],
  "evidence": [
    { "factor": "privacy", "url": "https://...", "note": "What the source shows" }
  ]
}
```

Update the top-level `updatedAt` to today's date.

### A.6 Update `CHANGELOG.md`

Append one line at the top of the active section:

```
- YYYY-MM-DD — add(<slug>): initial audit v<auditedVersion>, grade <grade>, overall <overall>.
```

### A.7 Commit and push

```
git add data/systems.json CHANGELOG.md
git commit -m "audit(<slug>): initial v<auditedVersion>"
git push origin main
```

GitHub Pages will redeploy automatically. Verify at [https://index.open-os.com](https://index.open-os.com) that the new row appears.

---

## B. Re-auditing an existing system

### B.1 Load the current entry

Find it by `slug` in `data/systems.json`. Note its current `rubricVersion` and `auditedVersion`.

### B.2 Decide the scope

- If the OS has not shipped a new version since the last audit **and** the rubric is unchanged → skip; no action needed.
- If the OS has shipped a new version → full re-audit (§A.2–A.4 on the new version).
- If the rubric has had a minor bump → re-check only dimensions affected by the new sub-criteria.
- If the rubric has had a major bump → full re-audit.

### B.3 Update the entry in-place

Overwrite `auditedVersion`, `auditedAt`, `rubricVersion`, `scores`, `overall`, `grade`, `summary`, `highlights`, `concerns` and `evidence` as appropriate. **Do not change `slug`.** Keep historical context concise in `summary` if scores moved significantly.

Update the top-level `updatedAt`.

### B.4 Update `CHANGELOG.md`

```
- YYYY-MM-DD — update(<slug>): re-audit v<auditedVersion>, grade <grade> (was <previousGrade>), overall <overall> (was <previousOverall>).
```

### B.5 Commit and push

```
git commit -m "audit(<slug>): update v<auditedVersion>"
git push origin main
```

---

## C. Dimension-by-dimension scoring guide

For each dimension, check at least the sub-questions listed. Each sub-question is a rough proxy; your final integer score should reflect the overall state of the dimension, not a mechanical sum.

### C.1 General-Purpose Computing (weight 20)

- Can the owner unlock the bootloader or equivalent without voiding support?
- Is root / admin / unrestricted shell access available, by default or via a documented path?
- Can the owner install and run arbitrary code without vendor approval?
- Is sideloading supported natively (no developer mode gymnastics)?
- Does hardware attestation restrict third-party software?

### C.2 Degree of Freedom (weight 20)

- Is the OS released under a FOSS license?
- Is the source code publicly available and current?
- Can someone build the OS from source with documented steps?
- Are users free to modify and redistribute?

### C.3 Privacy (weight 15)

- Is telemetry off by default, opt-in, or easily disabled?
- Does the OS work offline, with a local account, without a vendor account?
- What data leaves the device on first boot?
- Is end-to-end encryption used where data crosses the network?

### C.4 Transparency (weight 15)

- Are builds reproducible?
- Are security audits public?
- Do changelogs describe actual changes (not marketing)?
- Is there a clear mapping from published binaries to source commits?

### C.5 Interoperability (weight 12)

- Are open file formats used by default?
- Are APIs open and documented?
- Can the user export their data in portable formats?
- Does the OS follow relevant open standards?

### C.6 Neutrality (weight 10)

- Is the default install free of pre-installed ads, upsells and bloatware?
- Are default apps chosen on merit, not vendor steering?
- Can default apps be replaced or removed?
- Does the UI push the user toward vendor services?

### C.7 Portability (weight 8)

- Which CPU architectures are supported?
- Can the OS be moved between devices, or is it bound to hardware IDs?
- Can the owner reinstall freely, without activation tied to the original device?

---

## D. Stopping rules

Do not commit if any of these is true:

- You could not find at least one evidence URL for a dimension you are scoring above 0.
- You are guessing a score without a basis you can point to.
- You cannot resolve one of the evidence URLs you plan to cite.
- You are about to introduce `"grade"` values outside S / A / B / C / D / F.
- The JSON fails to parse after your edit.

When in doubt, commit a smaller, more conservative audit and leave a note in `concerns` — correctness over completeness.

---

## E. Commit conventions

- `audit(<slug>): initial v<version>` — new entry.
- `audit(<slug>): update v<version>` — re-audit.
- `rubric: <short summary>` — rubric changes (and always bump `RUBRIC.md` version + `data/rubric.json` version).
- `site: <short summary>` — changes to `index.html` / `assets/`.
- `chore: <short summary>` — everything else.

One commit per system audit. Don't batch unrelated changes.
