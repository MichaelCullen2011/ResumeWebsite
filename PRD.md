# PRD — Resume Website Redesign

| | |
|---|---|
| **Owner** | Michael Cullen |
| **Status** | Draft — centerpieces confirmed; visual/sim details TBD; build not yet started |
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
- Introduce **two interactive centerpiece demos** (see §8 — confirmed).
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

## 8. Interactive centerpieces — ✅ CONFIRMED

Both centerpieces are confirmed. Visual design and simulation details to be defined
before build begins (Phase 3/4), but the scope and technology direction are locked.

**Centerpiece A — Architecture Transformation Simulator** *(credible)*
- Concept: interactive node-graph showing a real architecture transformation — toggle
  between legacy and target-state topologies, with animated morphing between them.
  Click any node to open a decision card (trade-off, constraint, outcome). ArchiMate-style
  layer toggle (Business / Application / Technology). Animated data-flow particles on edges.
  Content is 2–3 anonymised Deloitte case studies (sector · challenge · what was
  architected · outcome) — **⚠️ requires input from Michael before build can start.**
- Why: directly reflects Michael's current role; ArchiMate certification makes it
  authentic; doubles as the home for anonymised Deloitte work.
- Source repos: `ArchitectureDiagrams` + anonymised Deloitte material.
- Tech: client-side node graph (Cytoscape.js or React Flow island), JSON model driving
  topology, CSS/canvas for data-flow particles. Fully client-side.

**Centerpiece B — Physics Playground** *(fun)*
- Concept: a single page with two switchable modes, sharing a canvas/particle visual
  language that rhymes with the hero motif.
  - **Mode 1 — Neutrino Oscillation Viewer:** sliders for energy, baseline distance, and
    mixing angles → live probability curves animate. Grounded in the M.Phys thesis
    *"Quantum Computing using Neutrino Oscillations."*
  - **Mode 2 — GR / Interstellar Simulator:** RK4 numerical integration of a small
    n-body system rendered on canvas/WebGL; configurable initial conditions.
  - **Visual/simulation details TBD** — what exactly is simulated, what the controls are,
    and how results are labelled will be defined collaboratively before build.
- Why: maximally distinctive ("this person did physics"); pure client-side math/canvas;
  visually reinforces the quantum/particle hero motif; ties directly to Michael's thesis
  and `InterstellarMotion` repo.
- Source repos: `QuantumAndNeutrinos`, `QuantumPOC`, `InterstellarMotion`.
- Tech: vanilla JS + canvas/WebGL (no heavy dependency). Fully client-side.

---

## 9. Featured projects (curation)

Curated for depth over volume; grouped by Michael's strength areas.

| # | Feature | Source repos | Role on site |
|---|---------|--------------|--------------|
| 1 | Architecture Transformation Simulator | `ArchitectureDiagrams` + Deloitte (anonymised) | **Interactive centerpiece A** — credible; own page at `/architecture` |
| 2 | Physics Playground (Neutrino + GR) | `QuantumAndNeutrinos`, `QuantumPOC`, `InterstellarMotion` | **Interactive centerpiece B** — fun; own page at `/physics` |
| 3 | Neural Style Transfer | `NSTBackend`, `NSTApp` | Full-stack ML showcase (TF + Flask + Flutter) — featured project card |
| 4 | Interstellar Motion | `InterstellarMotion` | GR solar-system simulation — also powers centerpiece B |
| 5 | Current GenAI piece | `stable-diffusion` *or* `BERT`/`DirtyTalk` | Demonstrates hands-on modern AI/NLP — featured project card |
| 6 | Quantum & Neutrinos | `QuantumAndNeutrinos`, `QuantumPOC` | Physics/quantum identity — also powers centerpiece B; links to thesis |

**"More on GitHub" strip (breadth, low emphasis):** HodlApp/HodlServer (crypto tracker,
Flutter + Flask), PythonBlockchain / MusicDapp (blockchain), qkdbTutorials / cookbook
(kdb+/q — ties to mthree roots), YNABClone (personal finance), Chess.

**Deloitte work (open input):** requires 2–3 **anonymised** blurbs from Michael —
*sector · challenge · what was architected · outcome* — to be polished and designed in.

---

## 10. Information architecture

| Route | Purpose |
|-------|---------|
| `/` | Hero (motif) → About → experience timeline → curated project grid → contact CTA |
| `/architecture` | Centerpiece A — Architecture Transformation Simulator |
| `/physics` | Centerpiece B — Physics Playground (Neutrino Oscillation + GR Simulator) |
| `/cv` | Modernised CV page + downloadable PDF |
| `/contact` | Existing Flask-Mail form, restyled (recipient → `michaelcullen2024@gmail.com`) |

The experience timeline **replaces** the current generic skill "% bars."

---

## 11. Technical approach

- **Keep:** Flask/Jinja, Flask-Mail contact form, Docker, Google App Engine deployment.
- **Fix:** move CSS/JS out of `{% include %}` inlining into properly served static assets;
  drop W3.CSS; replace Font Awesome 4.
- **Add:** focused JS libraries for the two demos — node-graph lib (Cytoscape.js or
  React Flow island) for the architecture simulator; vanilla JS + canvas/WebGL for the
  physics playground — plus a lightweight custom canvas animation for the hero motif.
- **Constraints:** no always-on paid services by default; keep the app a simple monolith;
  manual verification (run locally / in browser) before push.

---

## 12. High-level plan (phased)

1. **Foundation & hero** — design system (palette, type, layout, nav), static-asset
   restructure, base template, animated hero motif.
2. **Core content** — home (current About, experience timeline, curated project grid),
   modernised CV page + PDF, restyled contact form.
3. **Architecture Transformation Simulator** — node-graph topology, legacy→target morph,
   decision cards, layer toggle, data-flow particles. Gated on anonymised Deloitte
   case-study blurbs from Michael.
4. **Physics Playground** — neutrino oscillation viewer + GR/interstellar simulator,
   two-mode single page. Gated on visual/sim detail definition (to be done collaboratively
   before build).
5. **Polish & ship** — responsive, accessibility, performance, SEO/OG tags, favicon;
   verify locally; commit, push, open a **draft PR**.

Phases 1–2 are direction-locked and can start now. Phase 3 is gated on Deloitte content.
Phase 4 is gated on visual/sim detail definition.

---

## 13. Open decisions / inputs needed

1. **Deloitte content (§8A / §9)** — Michael to provide 2–3 anonymised case-study blurbs
   *(sector · challenge · what was architected · outcome)*. Gates Phase 3.
2. **Physics playground details (§8B)** — exact simulation scope, controls, and visual
   treatment to be defined collaboratively before build. Gates Phase 4.
3. **Forward-facing title/wording** — exact phrasing for the Deloitte Manager role on
   the homepage hero and CV.
4. **Canonical location** — Edinburgh (CV) vs. London (GitHub profile).

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
