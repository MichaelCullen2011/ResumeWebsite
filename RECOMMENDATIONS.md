# Website Review — Recommendations

**Reviewed:** 2026-07-05, on branch `claude/resume-website-redesign-X22Mw` (redesign phases 1–4 committed; this review reflects the redesigned site, not `master`).
**Purpose:** shortlist candidates for backlog spec planning. Each item has an ID, effort (S = under an hour, M = an evening, L = multi-session), and impact, so you can cherry-pick.

---

## Verdict in one paragraph

The redesign direction is right and most of the hard thinking (PRD, design system, two centerpieces) is done. The gaps now are **credibility gaps, not design gaps**: dead links to private repos, a demo with placeholder content and a broken control, a factual physics error on the page built to prove physics credentials, and a public repo carrying ~1,800 junk files including a committed virtualenv. All are cheap to fix relative to what they cost you in front of a technical visitor. On project balance: your GitHub says "talented 2020 physics graduate", your site copy says "2026 Deloitte manager" — the architecture simulator is the only bridge between the two, which is why filling it with real anonymised case studies is the single highest-value item on this list.

---

## A. Showcasing your best self

### A1. Fill the Architecture Simulator with real (anonymised) case studies — **L, highest impact**
The simulator currently shows a generic textbook migration (monolith → API gateway + microservices + event bus). Any architect or technical interviewer will recognise it as placeholder content, which *undermines* rather than demonstrates credibility — the page's disclaimer says "based on anonymised Deloitte engagements" but the content visibly isn't. This is PRD open decision #1 and it gates the site's whole professional story. Action: write 2–3 real blurbs (sector · challenge · what was architected · outcome), then replace the topology data in `src/static/js/architecture.js`. Until then, consider softening the disclaimer text so it doesn't over-claim.

### A2. Fix the neutrino oscillation date — **S, high impact for its size**
`physics.html` says mixing angles were "first confirmed in 2015". Neutrino oscillation was confirmed in **1998 (Super-Kamiokande)**; 2015 was the **Nobel Prize** for that discovery. On the one page whose entire purpose is signalling physics rigour, this is the error a physicist visitor will catch. One-line fix.

### A3. Check the "decade of physics" claim — **S**
Hero tagline: "a decade of physics". MPhys 2016–2020 is four years of formal physics; your stated tone preference is "polished but not inflated". Suggest rewording (e.g. "a physics foundation" or "an MPhys in quantum computing") — inflated claims are exactly what senior interviewers probe.

### A4. Add an Open Graph image — **S, high impact**
`base.html` has `og:title`/`og:description` but no `og:image`. When the site is shared on LinkedIn — the #1 channel where recruiters will encounter it — the card renders imageless and forgettable. Add a 1200×630 image (hero screenshot with the particle motif works well) plus `twitter:card` meta. Also: the referenced `favicon.ico` doesn't exist in `src/static/`, so every tab shows a generic icon and every page load 404s — add one (a simple ν or particle glyph on burgundy).

### A5. Remove your personal phone number from the public CV page — **S**
`cv.html` publishes `+44 77159 24881` on the open web where it will be scraped. Email + LinkedIn + the contact form are sufficient; keep the phone number for the downloadable/PDF CV only if you want it anywhere.

### A6. Resolve the identity inconsistencies — **S**
- Location: site says Edinburgh, GitHub profile says London (PRD open decision #4). Pick one everywhere.
- `cv.html` links GitHub but not LinkedIn; the footer has both. Add LinkedIn to the CV sidebar.

### A7. Refresh the GitHub side of your identity — **M**
Recruiters *will* click through from the site. Right now they land on:
- A profile README (`MichaelCullen2011/MichaelCullen2011`) untouched since **July 2021** — it predates your entire Deloitte career.
- Unpinned/default repo ordering that surfaces university work first.
- This very repo with a README whose screenshot shows the **old site**, a broken run command (`python3 flask run main.py` is not a valid invocation), a typo ("descripes"), and a placeholder author line ("ex. Michael Cullen").

Action: rewrite the profile README to match the site's story (Manager @ Deloitte · architecture · AI · quantum), pin the six repos the site features, rewrite this repo's README, retake the screenshot after the redesign ships.

### A8. Give the featured projects a "why it matters" line — **M**
Cards currently describe *what* each project is. One sentence of *so what* per card (what it demonstrates: e.g. NST → "end-to-end ML delivery: model, API, and mobile client, all mine") turns a list of hobbies into evidence of capability. Cheap copywriting, disproportionate payoff with non-technical readers.

### A9. Decide the fate of the "GR Simulator (coming soon)" tab — **S to remove, L to build**
A visible disabled "coming soon" button ages badly — it reads as abandoned if it's still there in six months. Either schedule the build (the RK4 code exists in `InterstellarMotion`) or remove the tab until it's real. Recommend: remove for launch, add back when built.

---

## B. Quick-win technical improvements

*(Performance/security deliberately out of scope per your brief.)*

### B1. Fix the four dead links on the homepage — **S, do first**
In the "More on GitHub" strip, 4 of 6 pills 404 because the repos are private or don't exist: **HodlApp, qkdbTutorials, YNABClone, stable-diffusion**. Only `PythonBlockchain` and `Chess` resolve. Dead links on a portfolio homepage are the fastest way to look unmaintained. Options per repo: make it public (after a README pass), or drop the pill. Replacement candidates that *are* public: `NeuralStyleTransfer`, `RNNGeneratorGUI`, `cookbook` (kdb+ fork — ties to the mthree story), `ArchitectureDiagrams`.

### B2. Fix or remove the Layer toggle on the Architecture page — **S**
The "Layer: All / Application / Technology" buttons in `architecture.html` have **no event handler** — `architecture.js` only wires up `data-topo` buttons. Clicking them does nothing (they don't even toggle their active state). Either implement the filter (Cytoscape makes this ~15 lines: filter nodes by the `layer` class already present in the data) or remove the buttons until A1 lands.

### B3. Purge the junk from git tracking — **S–M, big cosmetic payoff**
The public repo currently tracks:
- `venv/` — **1,574 files** of committed virtualenv
- `.history/` — 196 editor-history snapshots
- `mysite/` + `pages/` — dead Django experiment (with `.pyc` files)
- `.DS_Store`, partial `.idea/`, `.vscode/`
- root `requirements.txt` duplicating `src/requirements.txt`

Anyone assessing your engineering hygiene sees this in the first five seconds on GitHub. Action: extend `.gitignore` (`venv/`, `.history/`, `.DS_Store`, `.vscode/`), `git rm -r --cached` the lot, delete `mysite/`, `pages/`, and the root `requirements.txt` outright. (History rewrite to shrink clone size is optional and not worth the hassle.)

### B4. Fix the wrong project tag — **S**
On the homepage, the **Quantum & Neutrinos** card is tagged **"AI / NLP"**. Should be "Physics / Quantum".

### B5. Rewrite README.md and update CLAUDE.md — **S**
README issues listed under A7. Separately, `CLAUDE.md` still documents the *old* architecture (`homepage_base.html`, inlined CSS via `{% include %}`, `/tableau1` routes) — none of which exists on this branch. Update both so the repo's docs match reality before the PR merges.

### B6. Friendly error handling on the contact form — **S**
`main.py` calls `abort(500)` when mail fails, so a visitor who took the time to write to you gets a raw browser error page and loses their message. Add custom `404.html`/`500.html` templates via `@app.errorhandler`, and on mail failure re-render the form with a flash message ("Something went wrong — email me directly at …") with their text preserved.

### B7. Minor SEO plumbing — **S**
`robots.txt` and a five-URL `sitemap.xml`, plus canonical URLs once you've settled the domain. Ten minutes, helps the site rank for your own name.

---

## C. Project balance & embed-worthiness

### The honest read

Your 13 public repos: predominantly Python, mostly last touched **2020–2021** (university era). Recent activity is thin: Chess (May 2026), StockAnalyser & ArchitectureDiagrams (Mar 2025), NSTBackend (Jan 2025). Meanwhile your professional narrative is 2021–2026 enterprise architecture — which by nature produces **no public code**. So the site's two halves currently attest to two different people, five years apart. That's the balance problem to solve, and it's solved by *narrative*, not by grinding out new repos:

1. **The architecture simulator (A1) carries the professional half.** It's the only artefact that shows manager-era work. This is where effort should go.
2. **The physics playground carries the distinctive half** — it's built, it's genuinely yours (thesis), and it's the thing visitors will remember. Right investment, already made.
3. **The old repos carry the "can actually code" half** — they need curation and READMEs, not new features.

### Is building embeddable projects worth it, or wasted effort?

Rule of thumb from your own PRD constraints (no always-on paid services): **only client-side things embed well**. Applying that to your repo list:

| Project | Embed? | Reasoning |
|---|---|---|
| Physics playground | ✅ done | Pure canvas/JS — this was the right call |
| Architecture simulator | ✅ in progress | Client-side Cytoscape — right call, needs real content (A1) |
| Agentic toolkit (private, stays private) | ✅ embed a *recorded trace replay* — the centrepiece of its case-study page | See C1 — repo stays closed, so extracted artefacts carry the proof; live agent still off the table (paid backend + keys) |
| Neural Style Transfer | ⚠️ embed the *outputs*, not the model | Running TF server-side violates the no-paid-backend constraint. But a **static before/after gallery** of style-transferred images (even a slider comparison widget) is an hour's work, zero runtime cost, and visually the most impressive thing on the page. Recommended. |
| Interstellar Motion | ⚠️ optional future | The RK4 maths ports naturally to JS — this is the already-planned GR mode of the playground (A9). Don't do it separately. |
| Stock predictor | ❌ | Needs backend + live data; also, publishing ML price predictions invites the wrong conversation. Link + good README is the right treatment. |
| Chess | ❌ as an engine, ⚠️ as a board | "Play my chess engine" is a classic impressive embed, but your engine is Python — embedding means a WASM/Pyodide port or JS rewrite (multi-week). Only do this if it's fun for you; as portfolio ROI it loses to A1. |
| RNN generator, blockchain, kdb+ repos | ❌ | Breadth strip only. |

**Bottom line:** you are *not* wasting effort — the two projects you chose to embed are exactly the two that are embeddable and on-brand. Resist adding a third interactive demo; the PRD's own research (§6: 1–2 interactive moments, restraint signals competence) is correct. The marginal hour goes further in A1 content, the NST gallery, and READMEs.

### The one genuine gap: current AI → filled by the agentic toolkit (C1)

For someone whose bio claims staying close to AI, there is **no visible post-2021 AI work** — the PRD's "Current GenAI piece" slot points at `stable-diffusion`/`BERT`/`DirtyTalk`, all private or nonexistent (and reconsider ever surfacing a repo named `DirtyTalk` on a professional site).

**Resolution: the private agentic-toolkit repo** — a personal rebuild of patterns and lessons from client and internal Deloitte agentic-AI work. Strategically this is the AI-side twin of the architecture simulator: both take invisible professional work and turn it into public, personally-owned evidence.

**Decision: the repo stays private** (the code *is* the expertise; publishing it gives that away). So the showcase is built from **extracted artefacts, not a repo link** — a curated exhibit, the same way real client work is presented. Framing on the site: "selected artefacts from a private agentic toolkit". This shifts the evidential load onto the artefacts themselves, which means they must be concrete and self-evidencing (traces, decision records, evals) rather than claims.

### C1. Showcase the agentic toolkit via extracted artefacts — **M–L, same tier as A1**

**Step 1 — extraction pass (agent-run over the private repo).** The repo already holds design documents, decision records, and skill/agent details; run an extraction agent with this artefact brief:

| Artefact | Form | Feeds |
|---|---|---|
| 1–2 recorded agent runs | Sanitised JSON trace: plan → tool calls → observations → result | The replay widget (step 3) |
| System architecture | One diagram (SVG/Mermaid): agents, skills, orchestration, evals, guardrails | Case-study page hero |
| 3–5 decision records | Sanitised ADR excerpts: context · options · decision · consequence | Decision cards (reuse the `/architecture` card pattern) |
| Skill/agent catalogue | Table: name · one-line capability · pattern it demonstrates | Case-study page |
| Eval/guardrail results | Summary metrics or before/after examples | Credibility close on the page |

Sanitisation happens **at extraction time**, and traces are the main risk surface — prompts, tool names, and observation payloads can leak client/internal detail even when code doesn't. Same gate as A1: generic patterns are yours; client specifics aren't; check the employment IP/confidentiality position once for both.

**Step 2 — case-study page.** Assemble the artefacts into an `/ai` page (or a projects-section detail): narrative ("patterns for enterprise agentic systems — orchestration, tool use, evals, guardrails, failure modes") wrapping the diagram, ADR cards, catalogue, and evals. For the recruiter/hiring-manager audience this write-up outperforms code anyway — it shows judgement, not just implementation. The homepage featured card (slot vacated by the dead `stable-diffusion` pill, fixing half of B1) links here — CTA "View case study", tagged "AI / Agents", with a "code private — selected artefacts shown" note, which reads as professional rather than evasive.

**Step 3 — client-side trace replay (now the centrepiece, promoted from optional).** With no public repo to vouch for the work, the replay carries the proof: an interactive, replayable rendering of a recorded run, pure client-side from the static trace JSON, zero runtime cost. It shows the system's *behaviour* while withholding its *implementation* — exactly the split you want — and it rhymes with the Cytoscape node-graph language already on `/architecture`. A live agent embed remains off the table (always-on backend + keys, violates the PRD constraint). Keep it embedded within the case-study page, not a third nav-level centerpiece; the two-interactive-moments restraint still holds.

### Repo curation checklist (for the six repos the site links)

For each of `NSTApp`, `NSTBackend`, `InterstellarMotion`, `QuantumAndNeutrinos`, `StockAnalyserAndPredictor`, `Chess`: a README with one screenshot/GIF, a two-line "what & why", and setup that actually runs. `StockAnalyserAndPredictor` is already close; `Chess` (2 commits, sparse README) is the roughest of the recently-active ones. An afternoon total, and it upgrades every click-through from the site.

---

## Suggested shortlist order

| Priority | Items | Rationale |
|---|---|---|
| Now (pre-launch blockers) | B1, B2, B4, A2, A3, A5 | Dead links, broken control, wrong facts — cheap and visitor-facing |
| Next | B3, A4, B5, B6, A6 | Repo hygiene + share-ability + docs |
| Then | A1 (+ its content writing), C1 steps 1–2 (artefact extraction + case-study page), A7, A8, C-repo-curation | The credibility builders — A1 and C1 are the twin pillars (architecture story + AI story) |
| Later / optional | C1 step 3 (trace replay — the case-study centrepiece, worth pulling forward if the extracted traces are good), A9 (GR mode), NST gallery, B7 | Ship once the above land |
