# PRD — Resume Website Redesign

| | |
|---|---|
| **Owner** | Michael Cullen |
| **Status** | Draft — in discussion (centerpieces not yet committed) |
| **Branch** | `claude/resume-website-redesign-X22Mw` |
| **Last updated** | 2026-05-25 |

---

## 1. Summary

Reimagine Michael Cullen's personal resume/portfolio website so it reflects who he
is *today* — a Technology **Manager** at Deloitte with a background spanning
enterprise/solution architecture, data analysis, AI/ML, quantum computing, and
full-stack software development. The current site is functional but dated in both
content and presentation. This redesign modernises the look, refreshes the content,
curates the project showcase, and introduces **one or two genuinely interactive
demos** — kept deliberately contained to a page or two so the site stays novel
without becoming gimmicky.

The build stays on the existing **Flask** stack (keeping the working contact form
and Google App Engine deployment) and layers in focused JavaScript libraries for the
interactive pieces.

---

## 2. Background & problem

The current site (`src/main.py` + Jinja templates) works but has drifted out of date:

- **Stale content.** Bio still reads "4 years of experience"; title flips between
  "Technology Architect" and "Technology Consultant" — neither reflects the current
  **Deloitte Manager** role. Skill "% bars" read as generic and arbitrary.
- **Dated presentation.** Built on W3.CSS + Font Awesome 4 with all CSS/JS inlined
  into templates via `{% include %}` rather than served as static assets.
- **Projects are just links.** The six showcased projects are outbound links with no
  live demos, and the list predates much of Michael's more recent work.
- **No interactivity.** Nothing on the site is explorable or playable.
- **Good bones.** Clean Flask app, working Flask-Mail contact form, containerised,
  deployed on GAE. Worth preserving and building on rather than rebuilding.

---

## 3. Goals & non-goals

### Goals
- Present an accurate, current professional identity (Deloitte Manager; architecture +
  data/AI + quantum background).
- Modern, distinctive-but-restrained visual design with a subtle physics/quantum
  motif as a personality signature.
- Curate the project showcase to depth-over-volume (~6 featured + a "more on GitHub" strip).
- Introduce **1–2 interactive centerpiece demos** (see §8 — *placeholders, to be confirmed*).
- Showcase **anonymised Deloitte transformation work** alongside personal projects.
- Keep operational overhead low (stay on Flask + GAE; no new always-on costs by default).

### Non-goals
- Full framework migration (no move to Next/Astro for this milestone).
- Always-interactive / heavily animated pages — interactivity is contained to 1–2 pages.
- Real client names or any confidential Deloitte material — **anonymised only**.
- A comprehensive automated test suite (manual verification remains sufficient).
- Paid/always-on backend services unless explicitly chosen later (e.g. an LLM chatbot).

---

## 4. Audience

1. **Recruiters / hiring managers / clients** — want a quick, credible read on seniority,
   skills, and proof of work.
2. **Technical peers** — appreciate genuine, explorable demos and clean engineering.
3. **General/personal network** — want a clear sense of who Michael is and how to reach him.

Design implication: a **balanced hero** — strong, scannable introduction up top, then
roughly equal weight to professional experience and project work.

---

## 5. Subject profile (confirmed)

- **Name:** Michael Cullen
- **Current role:** Manager, Deloitte (Technology Transformation; since Sep 2021,
  progressed to Manager). *Forward-facing title/wording to be finalised with Michael.*
- **Prior:** mthree — q/kdb+ Engineer Program (Jun–Jul 2021)
- **Location:** Edinburgh, UK *(note: GitHub profile lists London — confirm canonical)*
- **Education:** M.Phys, First Class Honours, Loughborough University (2016–2020).
  Thesis: *"Quantum Computing using Neutrino Oscillations."*
- **Sectors:** retail, manufacturing, MedTech
- **Core skills:** enterprise & solution architecture, data analysis (AI/ML/visualisation),
  quantum computing/information, software development (Python, Flutter), kdb+/q
- **Certifications:** Google Cloud Associate Cloud Engineer, Tableau Desktop Certified
  Professional, ArchiMate®, LeanIX Certified Associate
- **Interests:** emerging tech (AI, quantum), learning new languages/frameworks,
  science-fiction reading, climbing, taekwondo, chess
- **Contact:** `michaelcullen2024@gmail.com` (contact form recipient to be updated to this)
- **Tone/voice:** British English; polished but not inflated; concise, structured, practical.

---

## 6. Research insights (portfolio best practice, 2026)

- **Minimal beats flashy.** Restraint signals competence; one accent colour, generous whitespace.
- **3–6 projects is the sweet spot** — more and the signal gets lost.
- **One or two genuine interactive moments** outperform animation everywhere.
- **Fundamentals matter most:** responsive behaviour, performance, accessibility, clean URLs.

These align directly with the brief: distinctive personality, contained interactivity.

---

## 7. Design direction

- **Aesthetic:** *distinctive with personality* — modern and restrained, with a signature.
- **Palette:** deep ink/charcoal base · **burgundy `#7d4c67`** as the heritage accent ·
  warm cream `#FDF5E6` for light surfaces. (Evolves the current identity rather than discarding it.)
- **Signature motif:** subtle particle / wave-oscillation animation rendered on a canvas,
  **in the hero only**, evoking neutrino oscillation / quantum states.
- **Typography:** characterful display face for headings + clean sans for body (upgrade
  from current Montserrat-only setup).
- **Icons/assets:** replace Font Awesome 4 with modern icons (FA6 or inline SVG).

---

## 8. Interactive centerpieces — ⚠️ PLACEHOLDERS (REVISIT BEFORE COMMITTING)

> **These two are working assumptions only.** They are recorded here so the plan is
> concrete, but they **must be discussed and confirmed** before any build work begins.
> Alternatives are listed; the final pair (and whether it's one or two) is an open decision.

**Placeholder centerpiece A — Architecture explorer**
- Concept: an interactive system/architecture diagram (toggle legacy → modernised,
  hover nodes for detail, animated data flows), built from the `ArchitectureDiagrams` work.
- Why: most aligned with Michael's current architect/Manager identity; doubles as the
  home for anonymised Deloitte case studies.
- Tech sketch: client-side node graph (e.g. Cytoscape.js / D3 / custom SVG) from a JSON model.

**Placeholder centerpiece B — Finance / AI dashboard**
- Concept: enter a ticker → candlesticks + technical indicators + an LSTM prediction
  overlay, drawn from `FinancialDashboard` + `StockAnalyserAndPredictor`.
- Why: showcases the freshest AI/ML + data-viz work.
- Tech sketch: charting lib (e.g. Plotly/Lightweight-Charts); **open question:** pre-baked
  datasets (no API key, free) vs. live data feed (needs key/cost).

**Alternatives on the table (not yet chosen):**
- **Quantum playground** — Bloch sphere / quantum gates / hydrogen orbitals / neutrino
  oscillation viewer (`QuantumAndNeutrinos`, `QuantumPOC`).
- **AI "ask my portfolio" chatbot** — trained on Michael's context; signals AI fluency,
  but needs an LLM API key + backend + ongoing cost/maintenance.
- **Playable chess** (`Chess`) and **solar-system GR sim** (`InterstellarMotion`) —
  currently slotted as *lighter, non-centerpiece touches* but could be promoted.

**Decision needed:** confirm the two centerpieces (or swap), confirm one-vs-two, and
resolve the finance data-source question.

---

## 9. Featured projects (curation)

Curated for depth over volume; grouped by Michael's strength areas.

| # | Feature | Source repos | Role on site |
|---|---------|--------------|--------------|
| 1 | Architecture explorer | `ArchitectureDiagrams` | Interactive centerpiece *(placeholder)* + anonymised Deloitte work |
| 2 | Finance / AI dashboard | `FinancialDashboard`, `StockAnalyserAndPredictor` | Interactive centerpiece *(placeholder)* |
| 3 | Neural Style Transfer | `NSTBackend`, `NSTApp` | Full-stack ML showcase (TF + Flask + Flutter) |
| 4 | Quantum & Neutrinos | `QuantumAndNeutrinos`, `QuantumPOC` | Physics/quantum identity; lighter interactive touch |
| 5 | Interstellar Motion | `InterstellarMotion` | GR solar-system simulation; personality |
| 6 | Current GenAI piece | `stable-diffusion` *or* `BERT`/`DirtyTalk` | Demonstrates hands-on modern AI/NLP |

**"More on GitHub" strip (breadth, low emphasis):** HodlApp/HodlServer (crypto tracker,
Flutter + Flask), PythonBlockchain / MusicDapp (blockchain), qkdbTutorials / cookbook
(kdb+/q — ties to mthree roots), YNABClone (personal finance), Chess.

**Deloitte work (open input):** requires 2–3 **anonymised** blurbs from Michael —
*sector · challenge · what was architected · outcome* — to be polished and designed in.

---

## 10. Information architecture

| Route | Purpose |
|-------|---------|
| `/` | Hero (motif) → current About → experience timeline → curated project grid → contact CTA |
| `/architecture` | Interactive centerpiece A *(placeholder)* |
| `/finance` | Interactive centerpiece B *(placeholder)* |
| `/cv` | Modernised CV page + downloadable PDF |
| `/contact` | Existing Flask-Mail form, restyled (recipient → `michaelcullen2024@gmail.com`) |

The experience timeline **replaces** the current generic skill "% bars."

---

## 11. Technical approach

- **Keep:** Flask/Jinja, Flask-Mail contact form, Docker, Google App Engine deployment.
- **Fix:** move CSS/JS out of `{% include %}` inlining into properly served static assets;
  drop W3.CSS; replace Font Awesome 4.
- **Add:** focused JS libraries for the two demos (charting + node-graph), and a lightweight
  custom canvas animation for the hero motif (no heavy dependency).
- **Constraints:** no always-on paid services by default; keep the app a simple monolith;
  manual verification (run locally / in browser) before push.

---

## 12. High-level plan (phased)

1. **Foundation & hero** — design system (palette, type, layout, nav), static-asset
   restructure, base template, animated hero motif.
2. **Core content** — home (current About, experience timeline, curated project grid),
   modernised CV page + PDF, restyled contact form.
3. **Interactive centerpiece A** — *(pending confirmation)*.
4. **Interactive centerpiece B** — *(pending confirmation)*.
5. **Polish & ship** — responsive, accessibility, performance, SEO/OG tags, favicon;
   verify locally; commit, push, open a **draft PR**.

Phases 1–2 are direction-locked and can start independently of the centerpiece decisions.
Phases 3–4 are gated on §8 being confirmed.

---

## 13. Open decisions / inputs needed

1. **Centerpieces (§8)** — confirm the two (or swap / choose one), and one-vs-two.
2. **Deloitte content (§9)** — Michael to provide 2–3 anonymised case-study blurbs.
3. **Finance data source (§8B)** — pre-baked datasets vs. live API feed.
4. **Forward-facing title/wording** — exact phrasing for the Deloitte Manager role.
5. **Canonical location** — Edinburgh (CV) vs. London (GitHub profile).

---

## 14. Success criteria

- Content is accurate and current (role, experience, projects).
- Design reads as modern, distinctive, and professional — not flashy.
- 1–2 interactive demos work smoothly and are genuinely Michael's.
- Site is responsive, accessible, and fast; contact form still works.
- Deploys cleanly to GAE on the existing Flask stack.

---

## 15. Out of scope (this milestone)

- Framework migration; service splits / microservices.
- Real client data or confidential material.
- Always-on paid backends (unless the chatbot option is explicitly chosen).
- Comprehensive automated testing.
