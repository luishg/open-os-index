# The Open-OS Sovereignty Rubric

**Version:** 2.0
**Status:** active

Every operating system in the Index is scored against this rubric. Scores are integers `0–100` per dimension; the **overall** score is the weighted average of all nine dimensions.

The rubric is organised into three **axes** so the structure is legible at a glance: *who controls the device*, *whether the ecosystem is free*, and *whether the technical surface is open*.

---

## The three axes

| Axis | Weight | What it asks |
| :--- | :-: | :--- |
| **Owner sovereignty** | 45 | Does the owner of the hardware control the software, the data and the boot process? |
| **Ecosystem freedom** | 40 | Can developers build and ship software — and can users install it — without gatekeepers, artificial friction, or one-vendor approval? |
| **Technical openness** | 15 | Are formats, APIs and architectures open? |

## Dimensions (9)

### Axis A — Owner sovereignty (45)

#### 1. Owner Authority — weight 15

Who is in charge of the hardware?

- Can the owner unlock the bootloader and boot any OS they choose?
- Is root / administrator / unrestricted shell available, by default or by documented path?
- Is firmware accessible and updatable by the owner?
- Can the owner install their own verified-boot keys or re-lock with custom keys?
- Does hardware attestation lock the owner out of their own machine?

**Penalises:** fused bootloaders, hardware attestation used against the owner, irrecoverable secure-boot chains, "administrator" accounts that cannot perform privileged operations without vendor approval.

#### 2. Software Freedom — weight 12

Is the OS free and open-source software?

- License: FOSS (GPL, MIT, Apache, permissive, etc.)?
- Is the source code publicly available and current?
- Is there a documented path to build from source?
- Can users legally modify and redistribute the OS?

**Penalises:** closed source, proprietary license, unbuildable-from-source binaries, non-redistributable terms.

#### 3. Privacy — weight 10

What data leaves the device by default?

- Telemetry off or opt-in at first boot?
- Can the OS work without a vendor account?
- Can it work without an internet connection at setup?
- Are data transmissions end-to-end encrypted where relevant?
- Is there a local-first mode for core features?

**Penalises:** mandatory telemetry, forced vendor accounts, forced cloud sync, silent first-boot data exfiltration.

#### 4. Transparency — weight 8

Can outsiders verify what the OS does?

- Reproducible builds?
- Public security audits or visible audit history?
- Honest technical changelogs (not marketing copy)?
- Binaries mappable to source commits?

**Penalises:** opaque release notes, hidden build pipelines, absence of any third-party scrutiny.

### Axis B — Ecosystem freedom (40)

This axis is the heart of the v2.0 rubric. It scores *whether the OS respects developers and users in the software ecosystem* — the single concept the user-sovereignty movement has most often had to defend in court.

Conceptually it echoes **Device Neutrality** (see [Wikipedia](https://en.wikipedia.org/wiki/Device_neutrality) and the [Device Neutrality Manifesto](https://github.com/devneutrality/manifesto)): users have the right to non-discrimination of the services and apps they use, regardless of who sells the hardware.

#### 5. Developer Autonomy — weight 15

Can a developer build and ship software for this OS without asking the vendor for permission?

- Can a developer distribute software directly to users, without going through an OS-vendor-controlled store?
- Is a developer registration or account with the OS vendor **required** to publish?
- Is OS-vendor notarisation (signing by the OS vendor) required for code to run?
- Are platform-mandated fees applied to software distribution?
- Can the OS vendor veto the *content* or *business model* of a third-party app?
- Can the OS vendor **revoke** a developer's right to distribute at will?

**Penalises:** mandatory notarisation, mandatory developer account registration with the OS vendor, 30 %-style distribution taxes, content review as a distribution gate, arbitrary revocation of signing certificates, "only signed apps run" policies.

#### 6. App Distribution Freedom — weight 13

Can the end user install any software, from any source, without artificial friction?

- Can a user install an app from a direct download (web) without disabling protections or flipping hidden toggles?
- Does the OS require a specific store to be the *trusted* source?
- Does the OS use loaded terminology — *sideload*, *jailbreak*, *unknown sources*, *unknown publisher*, *risky* — to describe normal third-party installation?
- Do apps installed outside the official store get fewer capabilities (background tasks, notifications, APIs)?
- Are third-party app stores natively supported and equally privileged?
- Is app-install gating tied to a vendor account (e.g. Play Protect tied to a Google login)?

**Penalises:** scare dialogs for non-store installs, capability degradation for non-store apps, loaded terminology in system UI, per-vendor-account install gating, store-exclusivity at OS level.

#### 7. Device Neutrality — weight 12

Does the OS treat third-party apps, services and peripherals on equal footing with its own?

- Are first-party and third-party apps granted the same APIs and capabilities?
- Can every default app be fully replaced (browser, search, mail, dialer, keyboard, launcher, store)?
- Does the OS steer users toward vendor services (search engine, cloud drive, music, maps, assistant) through UI nudges, periodic re-prompts or dark patterns?
- Does the OS mandate a specific engine for a core capability (e.g. WebKit-only browser engines)?
- Is data portability guaranteed (user can export their data in open formats)?
- Are third-party peripherals granted parity with first-party accessories?

**Penalises:** first-party-only APIs, unreplaceable defaults, engine monocultures, "Microsoft Edge is your default browser" style re-nags, OS-level preference for vendor search/storage/music/etc.

### Axis C — Technical openness (15)

#### 8. Interoperability — weight 8

Can data and software cross the boundary of this OS without loss?

- Are open file formats used by default?
- Are OS APIs publicly documented?
- Can the user export their data in portable, standards-based formats?
- Does the OS adhere to relevant open standards?

**Penalises:** proprietary formats as default, undocumented APIs, export gated behind the vendor's cloud.

#### 9. Portability — weight 7

Does the OS run on owned hardware without being bound to it?

- How many CPU architectures are officially supported?
- Is the OS / license tied to a specific hardware ID?
- Can the owner reinstall freely on the same or different hardware?

**Penalises:** tight hardware-ID binding, single-vendor-only hardware support, activation systems that tie the license to a machine.

---

## Scoring guide (applies to every dimension)

| Band | Meaning |
| :-: | :--- |
| **90–100** | Excellent. Principled, documented, no significant compromise. |
| **70–89** | Strong. Minor issues, acknowledged and bounded. |
| **50–69** | Mixed. Real trade-offs or partial support. |
| **30–49** | Weak. User-hostile defaults, limited recourse. |
| **0–29** | Absent or actively opposing the principle. |

The **overall** score is:

```
overall = round( Σ (dimension_score × dimension_weight) / 100 )
```

Weights sum to exactly 100.

## Grade bands (unchanged from v1.0)

| Grade | Score | Label |
| :-: | :-: | :--- |
| **S** | 90–100 | Absolute Sovereignty |
| **A** | 75–89  | High Sovereignty |
| **B** | 60–74  | Functional Sovereignty |
| **C** | 40–59  | Controlled Environment |
| **D** | 20–39  | Walled Garden |
| **F** | 0–19   | Hostile |

## Evidence requirements

Every score ≥ 50 on any dimension must be backed by at least one cited URL in the system's `evidence` array. Accepted sources, in order of preference:

1. **Primary** — official documentation, source code, policy pages, regulatory filings.
2. **Secondary** — reproducible technical tests, academic work, published security audits.
3. **Community** — specialised journalism, community wikis, corroborated user reports.

Community-only citations cap a dimension score at `69` (the low end of "Mixed"). If evidence is thin, score conservatively and record the limitation in `concerns`. Do not guess.

## Scope of an OS audit

- **Mobile OS** — the OS as shipped on its representative hardware.
- **Desktop OS** — the distribution as installed with its default ISO and default installer flow.

The primary grade reflects the **default shipping configuration**. Alternative configurations (hardened mode, enterprise-only options, local-account-only installs) may be added later as variants.

## Versioning

This rubric uses semver:

- **Patch** (`2.0.x`) — typos, clarifications, no semantic change.
- **Minor** (`2.x.0`) — new sub-criteria or evidence rules within existing dimensions; existing scores remain valid.
- **Major** (`x.0.0`) — weight changes, added or removed dimensions; all affected audits must be re-run.

Every entry in `data/systems.json` pins the `rubricVersion` it was scored against. Rubric history lives in `CHANGELOG.md`.
