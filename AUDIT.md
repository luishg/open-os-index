# Agent Audit Protocol

> Single source of truth for auditing an operating system and publishing the result to the Open-OS Index. Optimized for a **Claude Code** agent with access to `Read`, `Edit`, `Write`, `Bash`, `Grep`, `Glob`, `WebSearch` and `WebFetch`. Read end to end before starting — then follow the loop in §0.

## Assumed environment

- Working directory: the repo root (e.g. `/home/luis/open-os-index`). All paths below are repo-relative.
- Tools available: `Read`, `Edit`, `Write`, `Bash`, `Grep`, `Glob`, `WebSearch`, `WebFetch`.
- Commands available via `Bash`: `git`, `python3`, `curl`.
- Internet access: yes (via `WebSearch` and `WebFetch`; `curl` only for URL resolvability checks).

If any of the above is missing, stop and report it in your final message.

---

## 0. The loop (at a glance)

One audit, one pass. Ten steps:

1. Read protocol + rubric + current data. (§1)
2. Locate the target entry in `data/systems.json`. (§3.1)
3. Plan one research question per dimension. (§3.2)
4. Research each dimension with `WebSearch` + `WebFetch`. (§3.3)
5. Score each dimension 0–100 with cited URLs. (§3.4)
6. Compute `overall` + map to grade. (§3.5)
7. Draft `summary`, `highlights`, `concerns`. (§3.6)
8. Edit `data/systems.json` and `CHANGELOG.md`. (§6–§7)
9. Validate JSON + check URLs + run the self-review checklist. (§8)
10. Commit and push. (§9)

**Budget target:** ~30 min of agent time, ~14–20 tool calls total (≈2 searches + 2 fetches per dimension cap, minus dimensions where prior knowledge and one source suffice).

---

## 1. What to read first

Load these four files once, in this order. Do not re-read them unless you forgot something concrete.

```
Read AUDIT.md                 # this file (you are here)
Read RUBRIC.md                # human-readable rubric
Read data/rubric.json         # weights + grade bands (machine)
Read data/systems.json        # current database
```

From `data/rubric.json` you need: the `dimensions` array (7 entries with `id` + `weight`), and `grades` (for the final mapping).

---

## 2. Tools you will use

| Tool | Use it for | Keep in mind |
| :--- | :--- | :--- |
| `Read` | Loading the four repo files above; inspecting current entries. | Call once per file; don't re-read. |
| `WebSearch` | Discovering current primary sources for a specific claim. | Query in English. Target vendor domains (`site:apple.com`, `site:microsoft.com`, `site:<project>.org`). |
| `WebFetch` | Extracting a specific fact from a known URL. | Always pass a **narrow prompt**, not a generic summary request (see §3.3). |
| `Edit` | Patching `data/systems.json`, `CHANGELOG.md`. | **Surgical replacement** of an entry block. Preferred over `Write` because it can't accidentally clobber other entries. |
| `Grep` | Finding an existing slug or field in the repo. | Useful to confirm the entry before editing. |
| `Bash` | Running `python3 -c "..."` to validate JSON, `curl -IsS` to verify URLs, and `git add/commit/push`. | No interactive commands. |
| `Write` | Only if you are creating a new file from scratch. | Not used in a normal audit. |
| `Glob` | Rarely needed. | Skip unless looking across many files. |

Do **not** batch unrelated reads with unrelated fetches. Interleave: read one thing, decide, act.

---

## 3. Workflow A — New audit (or promoting a `pending` entry)

### 3.1 Locate the target

Use `Read data/systems.json`. Find the entry whose `slug` matches your target. Three cases:

- **Pending entry exists** (`status: "pending"`) → you will replace it in-place with an audited entry. This is the most common path.
- **Audited entry exists** (no `status` field) → switch to **Workflow B** (§4).
- **No entry at all** → you will insert a new audited entry (§6.2).

If the request is ambiguous (e.g. "audit Android" when both `android-stock-pixel` and `samsung-one-ui` are pending), stop and ask which one.

### 3.2 Plan research questions

Before calling any web tool, write one crisp research question per dimension. You can hold these in your head, but writing them keeps you focused.

Example for auditing GrapheneOS:

| Dimension | Question |
| :--- | :--- |
| `ownerAuthority` | Can the user re-lock the bootloader with their own key and control firmware? |
| `softwareFreedom` | What is the license? Is source current and buildable? |
| `privacy` | What data leaves the device on first boot; can it be disabled? |
| `transparency` | Reproducible builds? Public audits? |
| `developerAutonomy` | Can a developer ship software without OS-vendor approval or fees? |
| `appDistributionFreedom` | Can users install from any source without friction or scare dialogs? |
| `deviceNeutrality` | Are third-party apps/services granted parity with first-party? |
| `interoperability` | Open file formats? Export paths? |
| `portability` | Supported hardware; hardware binding? |

### 3.3 Research each dimension

Use **prior knowledge first** to draft a score hypothesis, then **verify with the web**. Every score needs an external URL.

For each dimension:

1. **WebSearch** — 1 query max to find the authoritative current source. Good query patterns:
   ```
   <os> <factor>            site:<vendor-domain>
   <os> telemetry OR privacy documentation
   <os> source code license
   <os> reproducible builds
   <project> <feature> site:github.com
   ```

2. **WebFetch** — 1–2 URLs per dimension, each with a **narrow extraction prompt**:
   ```
   WebFetch(
     url: "https://grapheneos.org/features",
     prompt: "Quote passages that describe (1) what data GrapheneOS transmits by default and (2) whether users can disable network connectivity checks. Return only the quoted passages plus the section headers."
   )
   ```
   A narrow prompt keeps the returned text short and relevant. A generic "summarize this page" wastes context.

3. **Stop when 2 URLs confirm the claim**. Hoarding sources wastes context and rarely improves the score.

If the primary source is thin, you may consult **community signal** (§3.3a) to confirm a claim exists; then still look for the primary source that supports it.

#### 3.3a Source buckets (what counts)

| Bucket | Examples | Role |
| :--- | :--- | :--- |
| **Primary** | `apple.com/legal`, `source.android.com`, `docs.microsoft.com`, `grapheneos.org/features`, vendor GitHub repo, regulatory filings (court PACER, EU DMA filings). | **Cite** in the `evidence` array. Every dimension scored ≥ 50 needs at least one. |
| **Supporting** | Ars Technica, The Register, 404 Media, Bleeping Computer, PrivacyGuides, EFF, peer-reviewed papers, security-researcher posts. | **Cite** when they corroborate a primary source. Acceptable alone only when primary sources are genuinely missing. |
| **Community signal** | Reddit, Hacker News, Lemmy, Mastodon, vendor forums, XDA, YouTube. | **Do not cite.** Use to discover sources and sanity-check. A Reddit thread can tip you off that telemetry still runs after a "disable" toggle — then go find the primary source. |
| **Prior LLM knowledge** | Your training data. | Use to orient and draft. **Never as a standalone basis for a score.** Every score must end with at least one live URL. |

### 3.4 Score

Assign an integer 0–100 to each dimension. Use the bands in §5.1. If you hesitate between two bands, round **down** — conservative scores are cheaper to correct than over-confident ones.

Record each source URL you actually used in the `evidence` array, tagged by factor:

```jsonc
{ "factor": "privacy", "url": "https://...", "note": "Short description of what the source shows (≤ 12 words)" }
```

### 3.5 Compute `overall` and `grade`

```
overall = round( Σ (score[dim] × weight[dim]) / 100 )
```

Verify by hand — one bad multiplication will ship. Example for the 7 dimensions:

```
overall = round( (ownerAuthority*15 + softwareFreedom*12 + privacy*10 + transparency*8
                + developerAutonomy*15 + appDistributionFreedom*13 + deviceNeutrality*12
                + interoperability*8 + portability*7) / 100 )
```

Map `overall` to a `grade` using `data/rubric.json.grades` (S ≥ 90, A ≥ 75, B ≥ 60, C ≥ 40, D ≥ 20, F otherwise).

### 3.6 Draft narrative fields

- **`summary`** — 2 to 4 plain-English sentences. Neutral tone. State what the OS is, how it fares against the rubric, and one distinguishing feature.
- **`highlights`** — 3 to 6 short, concrete bullets (positive). Each must map to real evidence you collected.
- **`concerns`** — 0 to 5 short, concrete bullets (negative or limitations). Use this when a dimension is marked down or when an evidence URL confirmed a caveat.

Do not editorialize. "Telemetry is on by default and cannot be fully disabled" ✓ — "Microsoft spies on you" ✗.

---

## 4. Workflow B — Re-audit of an existing audited entry

- If the OS shipped a new major version since `auditedVersion` → full re-score (back to §3.2).
- If `data/rubric.json.version` had a minor bump since the entry's `rubricVersion` → re-score only dimensions touched by the bump.
- Otherwise → nothing to do; report "no change needed" and stop.

Overwrite fields in place. Preserve `slug` and `name`.

---

## 5. Scoring — bands and dimensions (Rubric v2.0)

### 5.1 Score bands (apply to every dimension)

| Score | Meaning |
| :---: | :--- |
| **90–100** | Excellent. Principled, documented, no significant compromise. |
| **70–89** | Strong. Minor issues, acknowledged and bounded. |
| **50–69** | Mixed. Real trade-offs or partial support. |
| **30–49** | Weak. User-hostile defaults, limited recourse. |
| **0–29** | Absent or actively opposing the principle. |

### 5.2 Dimension probe list

The rubric has **9 dimensions across 3 axes** — Owner sovereignty, Ecosystem freedom, Technical openness. Score each dimension holistically after answering its probes. Weights come from `data/rubric.json` (total = 100).

#### Axis A — Owner sovereignty

**1. `ownerAuthority` · weight 15**
Bootloader unlockable? Root / admin / unrestricted shell available? Firmware accessible? Can the owner install custom verified-boot keys? Does hardware attestation lock the owner out?

**2. `softwareFreedom` · weight 12**
FOSS license? Source publicly available and current? Build-from-source documented? Modifications and redistribution permitted?

**3. `privacy` · weight 10**
Telemetry off or opt-in at first boot? Works without a vendor account? Works without an internet connection at setup? E2EE where applicable? Local-first by default?

**4. `transparency` · weight 8**
Reproducible builds? Public security audits or audit history? Changelogs describe actual changes (not marketing)? Binary ↔ source mapping possible?

#### Axis B — Ecosystem freedom

**5. `developerAutonomy` · weight 15**
Can a developer ship software without OS-vendor permission? Is notarisation / OS-vendor signing required? Is a developer account registration required? Are platform fees mandatory? Can the OS vendor veto app content? Can they revoke distribution rights at will?

**6. `appDistributionFreedom` · weight 13**
Can users install from any source without artificial friction? Any scare dialogs for non-store installs? Loaded terminology in system UI ("sideload", "jailbreak", "unknown publisher")? Capability degradation for non-store apps? Third-party stores natively supported and equally privileged? Install gating tied to a vendor account?

**7. `deviceNeutrality` · weight 12**
First-party and third-party apps granted the same APIs and capabilities? Every default app fully replaceable (browser, search, mail, dialer, keyboard, launcher, store)? UI nudges steering users toward vendor services? Engine monocultures (e.g. WebKit-only)? Guaranteed data portability? Third-party peripherals treated on par with first-party?

#### Axis C — Technical openness

**8. `interoperability` · weight 8**
Open file formats by default? Documented APIs? Portable data export in standards-based formats? Standards compliance?

**9. `portability` · weight 7**
CPU architecture breadth? Hardware-ID binding? Reinstall freedom across hardware?

---

## 6. Editing `data/systems.json`

Use `Edit`, not `Write`. The file contains many entries; a surgical replacement cannot break the others.

### 6.1 Promoting a pending entry → audited (most common case)

**Before** — locate the entire pending block in the file. It looks like this, with exact indentation (4 spaces outside, 6 spaces for keys):

```jsonc
    {
      "slug": "grapheneos",
      "name": "GrapheneOS",
      "category": "mobile-os",
      "status": "pending",
      "description": "..."
    }
```

**After** — replace with the full audited shape:

```jsonc
    {
      "slug": "grapheneos",
      "name": "GrapheneOS",
      "category": "mobile-os",
      "auditedVersion": "2025.03",
      "auditedAt": "2026-04-13",
      "rubricVersion": "2.0",
      "scores": {
        "ownerAuthority": 95,
        "softwareFreedom": 92,
        "privacy": 95,
        "transparency": 90,
        "developerAutonomy": 95,
        "appDistributionFreedom": 93,
        "deviceNeutrality": 94,
        "interoperability": 80,
        "portability": 60
      },
      "overall": 89,
      "grade": "A",
      "summary": "Plain-English 2–4 sentence verdict.",
      "highlights": [
        "Short, concrete positive statement."
      ],
      "concerns": [
        "Short, concrete limitation."
      ],
      "evidence": [
        { "factor": "privacy", "url": "https://...", "note": "What this shows" }
      ]
    }
```

**How to run the edit:**

- `old_string` = the **entire pending block** as it appears in the file (from the opening `{` to the closing `}`, including leading spaces).
- `new_string` = the **entire audited block** with matching indentation.
- Do **not** include the trailing comma in either string (it belongs to the separator between entries and must stay intact).

Then, in a second `Edit`, bump the top-level `"updatedAt"` to today:

```jsonc
"updatedAt": "2026-04-13",
```
→
```jsonc
"updatedAt": "YYYY-MM-DD",
```

### 6.2 Adding a brand-new entry (no pending row exists)

Find the last entry in the `systems` array. Use `Edit` to append a comma after the closing `}` of that last entry and insert the new audited block before the closing `]`.

### 6.3 Re-audit of an existing audited entry

`Edit` with `old_string` = the full existing audited block, `new_string` = the updated audited block. Keep `slug` and `name` identical.

---

## 7. CHANGELOG entry

`Edit` `CHANGELOG.md`. Add one line at the **top** of the active year's section (so newest is first).

For initial audit of a pending entry:
```
- YYYY-MM-DD — audit(<slug>): initial v<auditedVersion>, grade <grade>, overall <overall>.
```

For re-audit:
```
- YYYY-MM-DD — audit(<slug>): update v<auditedVersion>, grade <grade> (was <prevGrade>), overall <overall> (was <prevOverall>).
```

---

## 8. Validate and self-review

Do both before committing.

### 8.1 Validate the JSON

Run via `Bash`:

```bash
python3 -c "import json, sys; d=json.load(open('data/systems.json')); print(len(d['systems']),'systems; updatedAt=',d['updatedAt'])"
```

Must print the expected count and today's date. If `json.load` raises, revert and redo the edit (see §11).

### 8.2 Verify every evidence URL resolves

Run via `Bash`, once per URL:

```bash
curl -sS -o /dev/null -I -w "%{http_code} %{url_effective}\n" -L --max-time 10 "<url>"
```

Accept `200`, `301`, `302`. Reject `4xx` and `5xx`. If a URL fails, either replace it with a working primary source or remove it (and lower the score if it was the only support).

### 8.3 Self-review checklist

Every item must be **YES** before you commit. If any is NO, fix first.

**Structure**
- [ ] `data/systems.json` parses as valid JSON.
- [ ] The audited entry contains exactly these keys: `slug`, `name`, `category`, `auditedVersion`, `auditedAt`, `rubricVersion`, `scores`, `overall`, `grade`, `summary`, `highlights`, `concerns`, `evidence`.
- [ ] `scores` has all nine factor keys (`ownerAuthority`, `softwareFreedom`, `privacy`, `transparency`, `developerAutonomy`, `appDistributionFreedom`, `deviceNeutrality`, `interoperability`, `portability`).
- [ ] Each score is an integer in `[0, 100]`.
- [ ] `grade` is one of `S A B C D F`.
- [ ] `category` is one of `mobile-os`, `desktop-os`.

**Math**
- [ ] `overall` equals `round( Σ score × weight / 100 )` using the weights in `data/rubric.json`.
- [ ] `grade` matches the overall-to-grade band from `data/rubric.json.grades`.

**Evidence**
- [ ] Every dimension with a score ≥ 50 has ≥ 1 entry in `evidence`.
- [ ] Every evidence URL returns 200/301/302 under `curl -I`.
- [ ] No evidence URL is a Reddit/HN/YouTube/forum link.
- [ ] No evidence `note` is longer than ~12 words.

**Narrative**
- [ ] `summary` is 2–4 sentences, neutral tone, no editorial adjectives.
- [ ] `highlights` and `concerns` bullets are concrete and verifiable.
- [ ] No emojis, no hashtags, no marketing language.

**Metadata**
- [ ] `rubricVersion` matches `data/rubric.json.version`.
- [ ] `auditedAt` is today in `YYYY-MM-DD`.
- [ ] Top-level `updatedAt` is today.
- [ ] `CHANGELOG.md` has a new top line for this audit.

**Repo hygiene**
- [ ] `git diff --stat` shows only `data/systems.json` and `CHANGELOG.md` changed.
- [ ] No secrets, tokens, or internal URLs in any field.

If and only if every box is checked, proceed to §9.

---

## 9. Commit & push

```bash
git add data/systems.json CHANGELOG.md
git commit -m "audit(<slug>): initial v<auditedVersion>"
git push origin main
```

Commit subject format:
- `audit(<slug>): initial v<auditedVersion>` — first audit of a pending or brand-new entry.
- `audit(<slug>): update v<auditedVersion>` — re-audit.

Never `--amend` a pushed commit. If the push fails, go to §11.

After push, wait ~60 seconds and the GitHub Pages deploy will serve the new audit at `https://index.open-os.com`. You do not need to verify this from the agent.

---

## 10. Stop rules

Abort — leave the working tree clean (`git status` empty) — and explain why in your final message if any of these is true:

- A dimension you want to score ≥ 50 has zero primary sources you can cite.
- The JSON fails to validate after your edits and you cannot fix it cleanly.
- The `overall` / `grade` math you computed does not match the formula.
- You are guessing a score without corroboration.
- The target is ambiguous (multiple distinct OSes match the request).
- `WebFetch` / `WebSearch` are unavailable.

Conservative, incomplete audits with clear `concerns` are fine. Confident, unsupported audits are not.

---

## 11. Failure recovery

| Failure | Fix |
| :--- | :--- |
| JSON broken after `Edit` | `git restore data/systems.json`, redo the edit with the exact indentation. |
| `Edit` can't find the `old_string` | Re-read the file, copy the exact block verbatim (including spaces), retry. |
| Pre-commit hook fails | Read the message, fix the underlying issue, new commit (never `--amend` after push). |
| Push rejected (non-fast-forward) | `git pull --rebase origin main` → resolve → `git push`. |
| A URL you wanted to cite 404s | Search for its vendor-hosted replacement; if none, use a supporting source or drop the score. |
| WebFetch returns generic marketing text | Rewrite the prompt more narrowly, or pick a more specific URL (docs page, not the landing page). |

---

## 12. Tone rules (applies to every string written to the repo)

- Be factual. "Telemetry is on by default" ✓. "Company spies on users" ✗.
- Use the vendor's own neutral terminology (e.g. "Activation" for Windows, "Secure Boot" for Apple).
- No emojis. No hashtags. No marketing adjectives. No sarcasm.
- When uncertain, record the limitation in `concerns` — do not fudge the score.

---

## Quick-reference one-liners

Validate JSON:
```bash
python3 -c "import json; json.load(open('data/systems.json'))" && echo OK
```

Verify a URL resolves:
```bash
curl -sS -o /dev/null -I -w "%{http_code}\n" -L --max-time 10 "<url>"
```

Commit + push an audit:
```bash
git add data/systems.json CHANGELOG.md && git commit -m "audit(<slug>): initial v<ver>" && git push origin main
```

List current slugs:
```bash
python3 -c "import json; [print(s['slug']) for s in json.load(open('data/systems.json'))['systems']]"
```
