# How to read a grade

The Open-OS Index certifies operating systems against a public rubric. This page explains how to read a grade, where it comes from, and how to challenge it.

## What a grade is

A **Sovereignty Grade** is the result of applying the rubric in [`RUBRIC.md`](RUBRIC.md) to an operating system, based on publicly available evidence. Each grade:

- Is derived from seven weighted factors scored 0–100.
- Is pinned to a specific rubric version and audit date.
- Links to the sources used to reach each score.

Every audit in `data/systems.json` records the rubric version and the evidence URLs, so any grade can be reproduced by re-running the rubric against the same sources.

## How scores are reached

Scores are produced by applying the rubric to:

1. **Primary sources** — official documentation, source code, policy pages, filings.
2. **Secondary sources** — reproducible technical tests, regulatory submissions, academic work.
3. **Community sources** — specialized journalism, community wikis, corroborated reports.

No score relies on hidden information. If evidence for a factor is thin, the audit scores conservatively and records the limitation in `concerns`.

## Naming and trademarks

Operating system names, logos and product marks mentioned on this site are the property of their respective owners. They are referenced for **nominative, descriptive purposes only** — to identify the software being audited — and their use here does not imply endorsement, affiliation or sponsorship.

## Challenging a score

If you believe a score is wrong, outdated or based on misinterpreted evidence:

1. Open an issue in this repository with the slug of the affected entry.
2. Specify which factor(s) you dispute.
3. Provide **counter-evidence** (primary sources preferred).
4. Propose a revised score with reasoning.

Accepted challenges land as a commit to `data/systems.json` with a line in `CHANGELOG.md`. Full history is preserved in git.

## Limits

This site is provided "as is", without warranty of any kind. Grades reflect the state of an OS at a specific version and audit date; real-world behavior may vary between releases. Use it as one input among many when evaluating software.
