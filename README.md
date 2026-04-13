# Open-OS Index

Public ranking of operating systems scored on how well they respect **user sovereignty**, **neutrality** and **general-purpose computing**.

🌐 Live site: [index.open-os.com](https://index.open-os.com)

## What this is

A transparent, agent-maintainable ranking. Every operating system in the list is scored against a public rubric, and every score links to evidence. The grade is an opinion expressed against a standard, not a legal or industry certification.

## Structure

| File / folder | Purpose |
| :--- | :--- |
| [`index.html`](index.html) | The entire site. Renders the ranking from `data/systems.json`. |
| [`assets/`](assets/) | Styles and client-side script. No build step. |
| [`data/systems.json`](data/systems.json) | The database: every audited OS and its scores. |
| [`data/rubric.json`](data/rubric.json) | Machine-readable mirror of the rubric. |
| [`RUBRIC.md`](RUBRIC.md) | The scoring criteria, in plain English. |
| [`AUDIT.md`](AUDIT.md) | Instructions any agent follows to audit a new OS or re-audit an existing one. |
| [`DISCLAIMER.md`](DISCLAIMER.md) | Framing: what the grade means and what it doesn't. |
| [`CHANGELOG.md`](CHANGELOG.md) | History of every audit and rubric change. |

## How audits work

1. A human (or scheduler) asks an agent: "audit `<target>`".
2. The agent reads [`AUDIT.md`](AUDIT.md) + [`RUBRIC.md`](RUBRIC.md) + current `data/systems.json`.
3. It researches the target, scores each dimension 0–100 with cited evidence.
4. It patches `data/systems.json`, appends to `CHANGELOG.md`, commits and pushes to `main`.
5. GitHub Pages redeploys the site automatically.

No build step, no framework, no toolchain. Open `index.html` in any browser and it works.

## Contributing

- **Suggest a target** or **challenge a score**: open an issue with evidence (primary sources preferred).
- **Propose a rubric change**: open a PR against `RUBRIC.md` + `data/rubric.json` with rationale.
- **Fork and reuse**: content is CC BY 4.0, code is MIT.

## License

- **Content** (rubric, audits, data): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Code** (HTML, CSS, JS): [MIT](LICENSE)
