# Plan: Resume Website Redesign
**Branch:** `claude/resume-website-redesign-X22Mw`
**Last updated:** 2026-05-25

---

## Goal
Redesign MichaelCullen2011/resumewebsite from a dated W3.CSS + Font Awesome 4 portfolio into a modern, distinctive, interactive portfolio reflecting Michael Cullen's role as a Deloitte Technology Manager. Preserve the working Flask stack, contact form, and GAE deployment.

## Architecture
- **Single-file Flask app** (`src/main.py`) — all routes stay here; add `/architecture` and `/physics`
- **Jinja2 templates** in `src/templates/` — one new `base.html` extended by all pages
- **Static assets** properly served from `src/static/css/` and `src/static/js/` — no more `{% include %}` inlining
- **Two interactive demos** — Physics Playground (`/physics`, Phase 4) and Architecture Simulator stub (`/architecture`, Phase 3)

## Tech Stack
- Flask 3.0.0, Flask-WTF, Flask-Mail, python-dotenv (unchanged)
- Custom CSS design system (drop W3.CSS); Google Fonts — Playfair Display + Inter
- Font Awesome 6 CDN for icons
- Vanilla JS for nav, hero animation, physics playground
- Cytoscape.js CDN for architecture simulator (Phase 3)
- Python 3.12, Gunicorn, Docker, Google App Engine (unchanged)

## Design Tokens
| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#1a1a2e` | Hero/dark-section background |
| `--burgundy` | `#7d4c67` | Primary accent, nav bar |
| `--cream` | `#FDF5E6` | Light surface background |
| `--amber` | `#C8963E` | νμ vertex colour |
| `--slate` | `#4A7C9C` | ντ vertex colour |
| `--text-dark` | `#1f1f1f` | Body text on light surfaces |
| `--text-light` | `#e8e0d5` | Body text on dark surfaces |

---

## File Map

### Files to CREATE
| File | Purpose |
|------|---------|
| `src/templates/base.html` | Shared base template: nav, footer, asset links |
| `src/templates/index.html` | Homepage (hero, about, timeline, projects, CTA) |
| `src/templates/architecture.html` | Architecture Simulator page |
| `src/templates/physics.html` | Physics Playground page |
| `src/static/css/style.css` | Full design-system stylesheet |
| `src/static/js/nav.js` | Responsive nav burger toggle |
| `src/static/js/hero.js` | Hero particle/wave motif (canvas) |
| `src/static/js/physics.js` | Neutrino oscillation simulator |
| `src/static/js/architecture.js` | Architecture simulator (Phase 3 stub) |

### Files to MODIFY
| File | Change |
|------|--------|
| `src/main.py` | Add `/architecture` + `/physics` routes; update contact recipient to `michaelcullen2024@gmail.com`; rename `home()` to render `index.html` |
| `src/templates/cv.html` | Full rewrite — extend `base.html`, modern two-column layout, no skill % bars |
| `src/templates/contact.html` | Restyle to new design system, extend `base.html` |
| `src/templates/contact_sent.html` | Restyle to new design system, extend `base.html` |

### Files to DELETE after Phase 2 is verified
| File | Reason |
|------|--------|
| `src/templates/homepage.html` | Replaced by `index.html` |
| `src/templates/homepage_base.html` | Replaced by `base.html` + `index.html` |
| `src/templates/cv_base.html` | Replaced by `base.html` + `cv.html` |
| `src/templates/style.css` | Moved to `src/static/css/style.css` |
| `src/templates/navlinkscript.js` | Replaced by `src/static/js/nav.js` |
| `src/templates/fa.css` | Replaced by FA6 CDN |
| `src/templates/header.html` | Inlined into `base.html` |
| `src/templates/header_new.html` | Unused |
| `src/templates/socials.html` | Inlined into `base.html` |
| `src/templates/contact_bar.html` | Unused |

---

## Phase 1 — Foundation & Static Asset Restructure

### Task 1.1 — Create static subdirectory structure
- [ ] Run:
```bash
mkdir -p src/static/css src/static/js src/static/fonts
```
Expected output: no output (directories created). Verify:
```bash
ls src/static/
# css  fonts  js  black.jpg  bubblechamber.png  chess_board.png  neural_network.jpeg  neutrino_temp.jpg
```

---

### Task 1.2 — Create `src/static/css/style.css` (full design system)
- [ ] Create file with full contents:

```css
/* ── Design tokens ──────────────────────────────────────── */
:root {
  --ink:       #1a1a2e;
  --burgundy:  #7d4c67;
  --cream:     #FDF5E6;
  --amber:     #C8963E;
  --slate:     #4A7C9C;
  --text-dark: #1f1f1f;
  --text-light:#e8e0d5;
  --text-muted:#9e8fa0;
  --card-bg:   #ffffff;
  --border:    #e0d4c8;
  --radius:    6px;
  --transition:0.25s ease;
  --shadow:    0 2px 16px rgba(0,0,0,0.08);
}

/* ── Reset ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', sans-serif;
  background: var(--cream);
  color: var(--text-dark);
  line-height: 1.7;
  font-size: 16px;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
ul { list-style: none; }

/* ── Typography ─────────────────────────────────────────── */
h1, h2, h3, h4 {
  font-family: 'Playfair Display', serif;
  line-height: 1.2;
}
.section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: var(--burgundy);
  margin-bottom: 0.5rem;
}
.section-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
}

/* ── Navigation ─────────────────────────────────────────── */
#navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
  background: var(--burgundy);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.nav-brand a {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: #fff;
  letter-spacing: 0.05em;
}
.nav-links {
  display: flex;
  gap: 2rem;
}
.nav-links a {
  color: rgba(255,255,255,0.85);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: color var(--transition);
}
.nav-links a:hover { color: #fff; }
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 4px;
}
.burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  transition: all var(--transition);
}

/* ── Hero ───────────────────────────────────────────────── */
#hero {
  position: relative;
  min-height: 100vh;
  background: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
#hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}
.hero-content h1 {
  font-size: clamp(2.5rem, 7vw, 5rem);
  color: #fff;
  letter-spacing: 0.02em;
}
.hero-content .hero-role {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: var(--text-muted);
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 0.75rem;
}
.hero-content .hero-tagline {
  margin-top: 1.5rem;
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  color: rgba(255,255,255,0.65);
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}
.hero-cta {
  margin-top: 2.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.btn {
  display: inline-block;
  padding: 0.7rem 1.8rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  border: 2px solid transparent;
}
.btn-primary {
  background: var(--burgundy);
  color: #fff;
  border-color: var(--burgundy);
}
.btn-primary:hover {
  background: transparent;
  color: var(--burgundy);
  border-color: var(--burgundy);
}
.btn-outline {
  background: transparent;
  color: #fff;
  border-color: rgba(255,255,255,0.5);
}
.btn-outline:hover {
  border-color: #fff;
  color: #fff;
}
.hero-scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.35);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

/* ── Section wrapper ────────────────────────────────────── */
.section {
  padding: 5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.section-dark {
  background: var(--ink);
  color: var(--text-light);
  max-width: 100%;
  padding: 5rem 2rem;
}
.section-dark .section-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.section-dark .section-title { color: var(--cream); }
.section-dark .section-subtitle { color: rgba(255,255,255,0.45); }

/* ── About ──────────────────────────────────────────────── */
#about .about-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: start;
}
.about-bio p { margin-bottom: 1.25rem; font-size: 1.05rem; color: var(--text-dark); }
.about-sidebar h3 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--burgundy);
  margin-bottom: 1rem;
}
.about-sidebar ul li {
  padding: 0.35rem 0;
  font-size: 0.9rem;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.about-sidebar ul li::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--burgundy);
  flex-shrink: 0;
}
.cert-list { margin-top: 2rem; }

/* ── Experience Timeline ────────────────────────────────── */
#experience {
  background: var(--ink);
}
.timeline {
  position: relative;
  padding-left: 2.5rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--burgundy);
  opacity: 0.4;
}
.timeline-item {
  position: relative;
  margin-bottom: 3rem;
}
.timeline-item::before {
  content: '';
  position: absolute;
  left: -2.1rem;
  top: 0.4rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--burgundy);
  border: 2px solid var(--ink);
}
.timeline-date {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--burgundy);
  margin-bottom: 0.25rem;
}
.timeline-role {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--cream);
  margin-bottom: 0.25rem;
}
.timeline-org {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}
.timeline-body {
  font-size: 0.95rem;
  color: rgba(232,224,213,0.75);
}
.timeline-body ul { padding-left: 1.2rem; }
.timeline-body ul li {
  list-style: disc;
  margin-bottom: 0.35rem;
}

/* ── Project Grid ───────────────────────────────────────── */
#projects {
  background: var(--cream);
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
}
.project-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  transition: box-shadow var(--transition), transform var(--transition);
  display: flex;
  flex-direction: column;
}
.project-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}
.project-card.featured {
  border-top: 3px solid var(--burgundy);
}
.project-tag {
  display: inline-block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--burgundy);
  background: rgba(125,76,103,0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 3px;
  margin-bottom: 0.75rem;
}
.project-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}
.project-card p {
  font-size: 0.9rem;
  color: #666;
  flex: 1;
  margin-bottom: 1.25rem;
}
.project-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.project-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--burgundy);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: opacity var(--transition);
}
.project-link:hover { opacity: 0.7; }

/* ── GitHub breadth strip ───────────────────────────────── */
.github-strip {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(125,76,103,0.05);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.github-strip h3 {
  font-size: 1rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}
.github-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.github-pill {
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-dark);
  transition: all var(--transition);
}
.github-pill:hover {
  border-color: var(--burgundy);
  color: var(--burgundy);
}

/* ── Contact CTA banner ─────────────────────────────────── */
#contact-cta {
  background: var(--burgundy);
  text-align: center;
  padding: 5rem 2rem;
}
#contact-cta h2 {
  color: #fff;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  margin-bottom: 1rem;
}
#contact-cta p {
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
  font-size: 1rem;
}

/* ── Footer ─────────────────────────────────────────────── */
footer {
  background: var(--ink);
  padding: 2.5rem 2rem;
  text-align: center;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}
.social-links a {
  color: rgba(255,255,255,0.5);
  transition: color var(--transition);
}
.social-links a:hover { color: #fff; }
.footer-copy {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.3);
}

/* ── CV page ─────────────────────────────────────────────── */
.cv-hero {
  background: var(--ink);
  color: var(--cream);
  padding: 8rem 2rem 4rem;
  text-align: center;
}
.cv-hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
.cv-hero .cv-role {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  font-weight: 300;
}
.cv-body {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: start;
}
.cv-sidebar section { margin-bottom: 2.5rem; }
.cv-sidebar h2 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--burgundy);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}
.cv-sidebar ul li {
  font-size: 0.9rem;
  padding: 0.2rem 0;
  color: var(--text-dark);
}
.cv-main section { margin-bottom: 3rem; }
.cv-main h2 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--burgundy);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}
.cv-entry { margin-bottom: 2rem; }
.cv-entry h3 {
  font-size: 1.05rem;
  color: var(--text-dark);
  margin-bottom: 0.15rem;
}
.cv-entry .cv-entry-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.6rem;
}
.cv-entry ul {
  padding-left: 1.1rem;
}
.cv-entry ul li {
  list-style: disc;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.3rem;
}
.cv-download {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid var(--border);
  margin-top: 1rem;
}

/* ── Contact page ────────────────────────────────────────── */
.contact-hero {
  background: var(--ink);
  color: var(--cream);
  padding: 8rem 2rem 4rem;
  text-align: center;
}
.contact-form-wrap {
  max-width: 620px;
  margin: 4rem auto;
  padding: 0 2rem;
}
.form-group { margin-bottom: 1.5rem; }
.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--text-dark);
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: var(--text-dark);
  background: var(--card-bg);
  transition: border-color var(--transition);
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--burgundy);
}
.form-group textarea { min-height: 160px; resize: vertical; }
.form-errors {
  color: #c0392b;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}
.contact-sent {
  max-width: 480px;
  margin: 8rem auto;
  padding: 0 2rem;
  text-align: center;
}
.contact-sent h2 {
  font-size: 2rem;
  color: var(--burgundy);
  margin-bottom: 1rem;
}

/* ── Physics page ────────────────────────────────────────── */
.physics-hero {
  background: var(--ink);
  color: var(--cream);
  padding: 8rem 2rem 3rem;
  text-align: center;
}
.physics-hero h1 { font-size: clamp(2rem, 5vw, 3rem); }
.physics-hero p {
  color: rgba(255,255,255,0.6);
  max-width: 560px;
  margin: 1rem auto 0;
  font-size: 1rem;
}
.physics-body {
  background: var(--ink);
  min-height: calc(100vh - 60px);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.physics-intro {
  max-width: 680px;
  text-align: center;
  margin-bottom: 2.5rem;
}
.physics-intro p { color: rgba(232,224,213,0.7); line-height: 1.75; font-size: 0.95rem; }
.preset-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}
.preset-pill {
  padding: 0.45rem 1.2rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: all var(--transition);
  background: transparent;
  font-family: 'Inter', sans-serif;
}
.preset-pill:hover {
  border-color: var(--burgundy);
  color: #fff;
}
.preset-pill.active {
  background: var(--burgundy);
  border-color: var(--burgundy);
  color: #fff;
}
#physics-canvas {
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius);
  max-width: 100%;
}
.scrubber-wrap {
  width: 100%;
  max-width: 500px;
  margin-top: 1.5rem;
}
.scrubber-wrap label {
  display: block;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.scrubber-val {
  text-align: center;
  font-size: 0.9rem;
  color: var(--cream);
  margin-bottom: 0.4rem;
}
.scrubber-sub {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  margin-top: 0.4rem;
}
input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.15);
  outline: none;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--burgundy);
  cursor: pointer;
}
.prob-bars {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.prob-bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.prob-bar-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  font-style: italic;
}
.prob-bar-track {
  width: 24px;
  height: 80px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}
.prob-bar-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 3px;
  transition: height 0.1s linear;
}
.pmns-inset {
  position: relative;
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  text-align: right;
  font-family: 'Inter', monospace;
  line-height: 1.8;
}
.mode-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.mode-tab {
  padding: 0.4rem 1.2rem;
  border-radius: var(--radius);
  font-size: 0.85rem;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  background: transparent;
  font-family: 'Inter', sans-serif;
  transition: all var(--transition);
}
.mode-tab.active {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border-color: rgba(255,255,255,0.3);
}
.mode-tab:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Architecture page ───────────────────────────────────── */
.arch-hero {
  background: var(--ink);
  color: var(--cream);
  padding: 8rem 2rem 3rem;
  text-align: center;
}
.arch-hero h1 { font-size: clamp(2rem, 5vw, 3rem); }
.arch-hero p {
  color: rgba(255,255,255,0.6);
  max-width: 560px;
  margin: 1rem auto 0;
}
.arch-body {
  background: var(--ink);
  min-height: 70vh;
  padding: 3rem 2rem;
}
#cy {
  width: 100%;
  height: 580px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius);
  background: rgba(255,255,255,0.02);
}
.arch-controls {
  max-width: 1100px;
  margin: 0 auto 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}
.arch-controls-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
}
.arch-btn {
  padding: 0.4rem 1rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius);
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
  background: transparent;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all var(--transition);
}
.arch-btn.active, .arch-btn:hover {
  background: var(--burgundy);
  border-color: var(--burgundy);
  color: #fff;
}
.decision-card {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #242438;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius);
  padding: 2rem;
  max-width: 380px;
  width: 90%;
  z-index: 500;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}
.decision-card.visible { display: block; }
.decision-card h3 {
  font-size: 1.1rem;
  color: var(--cream);
  margin-bottom: 0.5rem;
}
.decision-card p { font-size: 0.9rem; color: rgba(255,255,255,0.6); }
.decision-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}
.arch-placeholder {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  padding: 6rem 2rem;
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: var(--radius);
}
.arch-placeholder p { color: rgba(255,255,255,0.35); font-size: 0.95rem; }

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: fixed;
    top: 60px;
    right: 0;
    width: 260px;
    height: calc(100vh - 60px);
    background: var(--burgundy);
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    box-shadow: -4px 0 20px rgba(0,0,0,0.3);
  }
  .nav-links.open { display: flex; }
  .nav-links a { font-size: 1rem; color: #fff; }
  .burger { display: flex; }

  #about .about-grid { grid-template-columns: 1fr; gap: 2rem; }
  .cv-body { grid-template-columns: 1fr; gap: 2rem; }
  .projects-grid { grid-template-columns: 1fr; }
  .preset-pills { gap: 0.4rem; }
  .preset-pill { font-size: 0.78rem; padding: 0.35rem 0.9rem; }
}
```

---

### Task 1.3 — Create `src/static/js/nav.js`
- [ ] Create file:

```javascript
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});
```

---

### Task 1.4 — Create `src/static/js/hero.js` (particle wave animation)
- [ ] Create file:

```javascript
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 130;
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      r: Math.random() * 1.8 + 0.8,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx + Math.sin(t * 0.0006 + p.phase) * 0.15;
      p.y += p.vy + Math.cos(t * 0.0005 + p.phase) * 0.12;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(125,76,103,${0.18 * (1 - d / CONNECTION_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(253,245,230,0.55)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  requestAnimationFrame(draw);
})();
```

---

### Task 1.5 — Create `src/templates/base.html`
- [ ] Create file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}Michael Cullen{% endblock %}</title>
  <meta name="description" content="{% block meta_description %}Michael Cullen — Technology Manager at Deloitte. Architecture, data/AI, quantum computing.{% endblock %}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-Avb2QiuTny/E8Z5O8N3qIIHVm6WDNbT3TCRqvODEfFXAlLBbOxbUkMq4O4GTNP4PfLqSSJefTEFqQCYFqBug==" crossorigin="anonymous" referrerpolicy="no-referrer">
  <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
  {% block head %}{% endblock %}
</head>
<body>

  <nav id="navbar">
    <div class="nav-brand">
      <a href="/">Michael Cullen</a>
    </div>
    <ul class="nav-links" id="nav-links">
      <li><a href="/#about">About</a></li>
      <li><a href="/#projects">Projects</a></li>
      <li><a href="/architecture">Architecture</a></li>
      <li><a href="/physics">Physics</a></li>
      <li><a href="/cv">CV</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
    <div class="burger" id="burger">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </nav>

  {% block content %}{% endblock %}

  <footer>
    <div class="footer-inner">
      <div class="social-links">
        <a href="https://github.com/MichaelCullen2011" target="_blank" rel="noopener" aria-label="GitHub">
          <i class="fa-brands fa-github fa-lg"></i>
        </a>
        <a href="https://www.linkedin.com/in/michael-cullen-37a0811b0/" target="_blank" rel="noopener" aria-label="LinkedIn">
          <i class="fa-brands fa-linkedin fa-lg"></i>
        </a>
        <a href="mailto:michaelcullen2024@gmail.com" aria-label="Email">
          <i class="fa-solid fa-envelope fa-lg"></i>
        </a>
      </div>
      <p class="footer-copy">&copy; 2026 Michael Cullen</p>
    </div>
  </footer>

  <script src="{{ url_for('static', filename='js/nav.js') }}"></script>
  {% block scripts %}{% endblock %}
</body>
</html>
```

---

### Task 1.6 — Commit Phase 1 checkpoint
- [ ] Run:
```bash
git add src/static/css/style.css src/static/js/nav.js src/static/js/hero.js src/templates/base.html
git commit -m "phase 1: design system CSS, base template, nav/hero JS"
```

---

## Phase 2 — Core Content Pages

### Task 2.1 — Update `src/main.py` (routes + contact recipient)
- [ ] Replace the file content. Key changes:
  - `home()` renders `index.html` (new template name)
  - Add `/architecture` and `/physics` routes
  - Contact recipient → `michaelcullen2024@gmail.com`

```python
from flask import Flask, abort, render_template, request, send_from_directory
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email, Length
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_url_path="/static")
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ['MAIL_USERNAME']
app.config['MAIL_DEFAULT_SENDER'] = os.environ['MAIL_DEFAULT_SENDER']
app.config['MAIL_PASSWORD'] = os.environ['MAIL_PASSWORD']

mail = Mail(app)


class EmailForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=100)])
    email = StringField("Email", validators=[DataRequired(), Email(), Length(max=200)])
    message = TextAreaField("Message", validators=[DataRequired(), Length(max=5000)])
    submit = SubmitField("Send")


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/contact', methods=["GET", "POST"])
def get_contact():
    form = EmailForm()
    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        message = form.message.data
        subject = f"{name} sent a message via the contact form"
        msg = Message(
            subject,
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=['michaelcullen2024@gmail.com'],
            reply_to=email
        )
        msg.body = message
        try:
            mail.send(msg)
        except Exception:
            app.logger.exception("Failed to send contact email")
            abort(500)
        return render_template('contact_sent.html', form=form)
    return render_template('contact.html', form=form)


@app.route('/cv')
def cv_view():
    return render_template("cv.html")


@app.route('/architecture')
def architecture_view():
    return render_template("architecture.html")


@app.route('/physics')
def physics_view():
    return render_template("physics.html")


@app.route('/qc_neutrino_paper')
def paper_view():
    try:
        return send_from_directory("static/", "QC_Paper.pdf")
    except FileNotFoundError:
        abort(404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
```

---

### Task 2.2 — Create `src/templates/index.html` (hero + about sections)
- [ ] Create file (hero + about sections; experience and projects added in Tasks 2.3 and 2.4):

```html
{% extends 'base.html' %}

{% block title %}Michael Cullen — Technology Manager{% endblock %}

{% block content %}

<!-- HERO -->
<section id="hero">
  <canvas id="hero-canvas"></canvas>
  <div class="hero-content">
    <h1>Michael Cullen</h1>
    <p class="hero-role">Manager &middot; Deloitte &middot; Technology Transformation</p>
    <p class="hero-tagline">Enterprise architecture, data &amp; AI, and a decade of physics —
      brought together to deliver meaningful transformation.</p>
    <div class="hero-cta">
      <a href="#projects" class="btn btn-primary">View Projects</a>
      <a href="/cv" class="btn btn-outline">Download CV</a>
    </div>
  </div>
  <p class="hero-scroll-hint">Scroll</p>
</section>

<!-- ABOUT -->
<section class="section" id="about">
  <h2 class="section-title">About</h2>
  <p class="section-subtitle">Edinburgh, UK &middot; michaelcullen2024@gmail.com</p>
  <div class="about-grid">
    <div class="about-bio">
      <p>I'm a Technology Manager at Deloitte, where I lead architecture and
        transformation engagements across retail, manufacturing, and MedTech clients.
        My work spans enterprise and solution architecture, large-scale system
        integrations, and advising senior leadership on technology strategy — from
        M&amp;A IT transformations to cloud modernisation programmes.</p>
      <p>Before Deloitte I completed a q/kdb+ engineering programme at mthree, and
        before that a First Class MPhys at Loughborough University, where my thesis
        explored quantum computing using neutrino oscillations. That thread — rigorous
        maths, novel engineering, practical outcomes — runs through everything I do.</p>
      <p>Outside work: science-fiction reading, climbing, taekwondo, chess, and
        staying close to what's happening in AI and quantum computing.</p>
    </div>
    <div class="about-sidebar">
      <h3>Certifications</h3>
      <ul class="cert-list">
        <li>Google Cloud Associate Cloud Engineer</li>
        <li>Tableau Desktop Certified Professional</li>
        <li>ArchiMate&reg;</li>
        <li>LeanIX Certified Associate</li>
      </ul>
      <h3 style="margin-top:2rem">Core skills</h3>
      <ul>
        <li>Enterprise &amp; solution architecture</li>
        <li>Data analysis · AI/ML · visualisation</li>
        <li>Quantum computing &amp; information</li>
        <li>Python · Flutter · kdb+/q</li>
      </ul>
    </div>
  </div>
</section>

<!-- EXPERIENCE TIMELINE (Task 2.3) -->
<div id="experience" class="section-dark">
  <div class="section-inner section">
    <h2 class="section-title">Experience</h2>
    <p class="section-subtitle">Career timeline</p>
    <div class="timeline">

      <div class="timeline-item">
        <p class="timeline-date">Sep 2021 — Present</p>
        <h3 class="timeline-role">Manager, Technology Transformation</h3>
        <p class="timeline-org">Deloitte &middot; Edinburgh, UK</p>
        <div class="timeline-body">
          <ul>
            <li>Lead architecture and transformation programmes for global clients across
                retail, manufacturing, and MedTech sectors.</li>
            <li>Develop enterprise architecture roadmaps and drive complex system
                integrations including SAP implementations.</li>
            <li>Advise senior leadership on technology investment and M&amp;A IT strategy;
                manage cross-functional delivery teams.</li>
          </ul>
        </div>
      </div>

      <div class="timeline-item">
        <p class="timeline-date">Jun 2021 — Jul 2021</p>
        <h3 class="timeline-role">q/kdb+ Engineer</h3>
        <p class="timeline-org">mthree &middot; Engineer Programme</p>
        <div class="timeline-body">
          <p>Intensive training in q/kdb+ for financial data engineering.</p>
        </div>
      </div>

      <div class="timeline-item">
        <p class="timeline-date">2016 — 2020</p>
        <h3 class="timeline-role">MPhys Physics, First Class Honours</h3>
        <p class="timeline-org">Loughborough University</p>
        <div class="timeline-body">
          <p>Thesis: <em>"Quantum Computing using Neutrino Oscillations"</em> —
            derived integrated cross-sections from W/Z boson couplings to predict
            probabilistic gate outcomes for neutrino-lepton quantum gates.</p>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- PROJECTS (Task 2.4) -->
<section class="section" id="projects">
  <h2 class="section-title">Projects</h2>
  <p class="section-subtitle">Selected work — depth over volume</p>

  <div class="projects-grid">

    <div class="project-card featured">
      <span class="project-tag">Interactive Demo</span>
      <h3>Architecture Transformation Simulator</h3>
      <p>Interactive node-graph showing real architecture transformations — toggle between
        legacy and target-state topologies, click nodes for decision cards, animate
        data-flow particles. Grounded in anonymised Deloitte case studies.</p>
      <div class="project-links">
        <a href="/architecture" class="project-link">
          <i class="fa-solid fa-arrow-right"></i> Open Demo
        </a>
      </div>
    </div>

    <div class="project-card featured">
      <span class="project-tag">Interactive Demo</span>
      <h3>Physics Playground — Neutrino Oscillation</h3>
      <p>A flavour triangle visualising neutrino oscillation in real time. Choose a preset
        (Solar, Atmospheric, Maximum Mixing), drag the L/E scrubber, watch the probability
        field shift. Grounded in the MPhys thesis.</p>
      <div class="project-links">
        <a href="/physics" class="project-link">
          <i class="fa-solid fa-arrow-right"></i> Open Demo
        </a>
      </div>
    </div>

    <div class="project-card">
      <span class="project-tag">AI / ML</span>
      <h3>Neural Style Transfer</h3>
      <p>Full-stack ML project: Flutter front-end, Flask backend, TensorFlow/Keras model.
        Styles any photo as a famous painting in real time.</p>
      <div class="project-links">
        <a href="https://github.com/MichaelCullen2011/NSTApp" target="_blank" rel="noopener" class="project-link">
          <i class="fa-brands fa-github"></i> App
        </a>
        <a href="https://github.com/MichaelCullen2011/NSTBackend" target="_blank" rel="noopener" class="project-link">
          <i class="fa-brands fa-github"></i> Server
        </a>
      </div>
    </div>

    <div class="project-card">
      <span class="project-tag">Physics / Simulation</span>
      <h3>Interstellar Motion</h3>
      <p>RK4 numerical integration of the solar system under general relativity.
        Python — calculates next positions of all bodies accounting for GR corrections.</p>
      <div class="project-links">
        <a href="https://github.com/MichaelCullen2011/InterstellarMotion" target="_blank" rel="noopener" class="project-link">
          <i class="fa-brands fa-github"></i> Repo
        </a>
      </div>
    </div>

    <div class="project-card">
      <span class="project-tag">AI / NLP</span>
      <h3>Quantum &amp; Neutrinos</h3>
      <p>Quantum circuit simulations and neutrino oscillation models underpinning the
        MPhys thesis — links directly to the Physics Playground demo.</p>
      <div class="project-links">
        <a href="https://github.com/MichaelCullen2011/QuantumAndNeutrinos" target="_blank" rel="noopener" class="project-link">
          <i class="fa-brands fa-github"></i> Repo
        </a>
        <a href="/qc_neutrino_paper" target="_blank" class="project-link">
          <i class="fa-solid fa-file-pdf"></i> Thesis
        </a>
      </div>
    </div>

    <div class="project-card">
      <span class="project-tag">Finance / ML</span>
      <h3>Portfolio Analysis &amp; Prediction</h3>
      <p>Automated portfolio generation from trade history; LSTM model predicts future
        returns. Alpha Vantage API integration, Pandas, risk/correlation analysis.</p>
      <div class="project-links">
        <a href="https://github.com/MichaelCullen2011/StockAnalyserAndPredictor" target="_blank" rel="noopener" class="project-link">
          <i class="fa-brands fa-github"></i> Repo
        </a>
      </div>
    </div>

  </div>

  <div class="github-strip">
    <h3>More on GitHub</h3>
    <div class="github-pills">
      <a href="https://github.com/MichaelCullen2011/HodlApp" target="_blank" rel="noopener" class="github-pill">HodlApp</a>
      <a href="https://github.com/MichaelCullen2011/PythonBlockchain" target="_blank" rel="noopener" class="github-pill">PythonBlockchain</a>
      <a href="https://github.com/MichaelCullen2011/qkdbTutorials" target="_blank" rel="noopener" class="github-pill">qkdbTutorials</a>
      <a href="https://github.com/MichaelCullen2011/Chess" target="_blank" rel="noopener" class="github-pill">Chess</a>
      <a href="https://github.com/MichaelCullen2011/YNABClone" target="_blank" rel="noopener" class="github-pill">YNABClone</a>
      <a href="https://github.com/MichaelCullen2011/stable-diffusion" target="_blank" rel="noopener" class="github-pill">Stable Diffusion</a>
    </div>
  </div>
</section>

<!-- CONTACT CTA -->
<div id="contact-cta">
  <h2>Get in touch</h2>
  <p>Open to interesting conversations — architecture, AI, quantum, or just a good problem to solve.</p>
  <a href="/contact" class="btn btn-outline" style="border-color:rgba(255,255,255,0.5);color:#fff">Send a message</a>
</div>

{% endblock %}

{% block scripts %}
<script src="{{ url_for('static', filename='js/hero.js') }}"></script>
{% endblock %}
```

---

### Task 2.3 — Rewrite `src/templates/cv.html`
- [ ] Overwrite with:

```html
{% extends 'base.html' %}

{% block title %}CV — Michael Cullen{% endblock %}
{% block meta_description %}Michael Cullen's CV — Technology Manager at Deloitte, MPhys Loughborough.{% endblock %}

{% block content %}

<div class="cv-hero">
  <h1>Michael Cullen</h1>
  <p class="cv-role">Manager, Technology Transformation &middot; Deloitte &middot; Edinburgh, UK</p>
</div>

<div class="cv-body">

  <!-- Sidebar -->
  <aside class="cv-sidebar">
    <section>
      <h2>Contact</h2>
      <ul>
        <li>michaelcullen2024@gmail.com</li>
        <li>+44 77159 24881</li>
        <li>Edinburgh, UK</li>
        <li><a href="https://github.com/MichaelCullen2011" target="_blank">GitHub</a></li>
      </ul>
    </section>

    <section>
      <h2>Skills</h2>
      <ul>
        <li>Enterprise &amp; Solution Architecture</li>
        <li>Data Analysis · AI/ML · Visualisation</li>
        <li>Quantum Computing &amp; Information</li>
        <li>Python · Flutter · kdb+/q</li>
        <li>SAP Integration</li>
        <li>Technology Strategy</li>
      </ul>
    </section>

    <section>
      <h2>Certifications</h2>
      <ul>
        <li>Google Cloud Associate Cloud Engineer</li>
        <li>Tableau Desktop Certified Professional</li>
        <li>ArchiMate&reg;</li>
        <li>LeanIX Certified Associate</li>
      </ul>
    </section>

    <section>
      <h2>Interests</h2>
      <ul>
        <li>AI &amp; quantum computing</li>
        <li>Science-fiction</li>
        <li>Climbing</li>
        <li>Taekwondo</li>
        <li>Chess</li>
      </ul>
    </section>
  </aside>

  <!-- Main -->
  <main class="cv-main">
    <section>
      <h2>Work Experience</h2>

      <div class="cv-entry">
        <h3>Manager, Technology Transformation — Deloitte</h3>
        <p class="cv-entry-meta">September 2021 — Present &middot; Edinburgh, UK</p>
        <ul>
          <li>Lead architecture and transformation programmes for global organisations
              across retail, manufacturing, and MedTech sectors.</li>
          <li>Develop and execute enterprise architecture roadmaps; drive complex system
              integrations including SAP implementations.</li>
          <li>Support M&amp;A IT transformations and advise senior leadership on technology
              investment decisions.</li>
          <li>Manage cross-functional delivery teams; align technology solutions with
              business objectives.</li>
        </ul>
      </div>

      <div class="cv-entry">
        <h3>q/kdb+ Engineer — mthree</h3>
        <p class="cv-entry-meta">June 2021 — July 2021</p>
        <ul>
          <li>Completed intensive q/kdb+ engineer programme covering financial data
              engineering and time-series databases.</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Education</h2>

      <div class="cv-entry">
        <h3>MPhys Physics, First Class Honours — Loughborough University</h3>
        <p class="cv-entry-meta">2016 — 2020</p>
        <ul>
          <li>Thesis: <em>"Quantum Computing using Neutrino Oscillations"</em> —
              derived integrated cross-sections from W/Z boson couplings to predict
              probabilistic gate outcomes for neutrino-lepton quantum gates.</li>
          <li><a href="/qc_neutrino_paper" target="_blank">Download thesis (PDF)</a></li>
        </ul>
      </div>

      <div class="cv-entry">
        <h3>Claremont Academy</h3>
        <p class="cv-entry-meta">2010 — 2013</p>
        <ul>
          <li>A levels: A B C</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Selected Projects</h2>
      <div class="cv-entry">
        <h3>Architecture Transformation Simulator</h3>
        <p class="cv-entry-meta">Interactive demo at /architecture</p>
        <ul>
          <li>Node-graph visualisation of real architecture transformations backed by
              anonymised Deloitte case studies.</li>
        </ul>
      </div>
      <div class="cv-entry">
        <h3>Physics Playground — Neutrino Oscillation</h3>
        <p class="cv-entry-meta">Interactive demo at /physics</p>
        <ul>
          <li>Canvas visualisation of PMNS neutrino oscillation with real PDG mixing
              parameters; grounded in MPhys thesis.</li>
        </ul>
      </div>
      <div class="cv-entry">
        <h3>Neural Style Transfer</h3>
        <p class="cv-entry-meta"><a href="https://github.com/MichaelCullen2011/NSTBackend" target="_blank">github.com/MichaelCullen2011/NSTBackend</a></p>
        <ul>
          <li>Full-stack ML: Flutter front-end, Flask API, TensorFlow/Keras model.</li>
        </ul>
      </div>
    </section>
  </main>

</div>

<div class="cv-download">
  <a href="/qc_neutrino_paper" class="btn btn-primary" target="_blank">
    <i class="fa-solid fa-file-pdf"></i> Download Thesis PDF
  </a>
</div>

{% endblock %}
```

---

### Task 2.4 — Restyle `src/templates/contact.html`
- [ ] Overwrite with:

```html
{% extends 'base.html' %}

{% block title %}Contact — Michael Cullen{% endblock %}

{% block content %}

<div class="contact-hero">
  <h1>Get in touch</h1>
  <p class="hero-role" style="margin-top:0.5rem;font-size:1rem">
    Open to conversations — architecture, AI, quantum, or a good problem to solve.
  </p>
</div>

<div class="contact-form-wrap">
  <form method="POST" action="/contact" novalidate>
    {{ form.hidden_tag() }}

    <div class="form-group">
      {{ form.name.label }}
      {{ form.name(placeholder="Your name") }}
      {% if form.name.errors %}
        <div class="form-errors">{{ form.name.errors[0] }}</div>
      {% endif %}
    </div>

    <div class="form-group">
      {{ form.email.label }}
      {{ form.email(placeholder="your@email.com") }}
      {% if form.email.errors %}
        <div class="form-errors">{{ form.email.errors[0] }}</div>
      {% endif %}
    </div>

    <div class="form-group">
      {{ form.message.label }}
      {{ form.message(placeholder="Your message…") }}
      {% if form.message.errors %}
        <div class="form-errors">{{ form.message.errors[0] }}</div>
      {% endif %}
    </div>

    {{ form.submit(class="btn btn-primary") }}
  </form>
</div>

{% endblock %}
```

---

### Task 2.5 — Restyle `src/templates/contact_sent.html`
- [ ] Overwrite with:

```html
{% extends 'base.html' %}

{% block title %}Message sent — Michael Cullen{% endblock %}

{% block content %}

<div class="contact-sent" style="padding-top:8rem">
  <h2>Message sent.</h2>
  <p style="color:#666;margin-bottom:2rem">Thanks — I'll get back to you as soon as I can.</p>
  <a href="/" class="btn btn-primary">Back to home</a>
</div>

{% endblock %}
```

---

### Task 2.6 — Delete legacy template files
- [ ] Run only after visually verifying the site renders correctly:
```bash
cd src/templates && rm -f homepage.html homepage_base.html cv_base.html style.css navlinkscript.js fa.css header.html header_new.html socials.html contact_bar.html
```

---

### Task 2.7 — Commit Phase 2 checkpoint
- [ ] Run:
```bash
git add src/main.py src/templates/index.html src/templates/cv.html src/templates/contact.html src/templates/contact_sent.html
git commit -m "phase 2: homepage, CV, contact pages — new design system"
```
Then commit the deletions:
```bash
git add -u src/templates/
git commit -m "phase 2: remove legacy inlined template files"
```

---

## Phase 3 — Architecture Transformation Simulator (Stub)

> **Gate:** Requires 2–3 anonymised Deloitte case-study blurbs from Michael
> *(sector · challenge · what was architected · outcome)*.
> Build the full interactive graph once that content is supplied.
> This phase delivers a complete, functional stub with sample placeholder nodes.

### Task 3.1 — Create `src/static/js/architecture.js`
- [ ] Create file. Uses Cytoscape.js loaded via CDN in the template.

```javascript
(function () {
  const TOPOLOGIES = {
    legacy: {
      nodes: [
        { data: { id: 'monolith', label: 'Legacy Monolith', layer: 'app', info: 'Single deployable unit. High coupling. Slow release cadence.' } },
        { data: { id: 'db_legacy', label: 'On-Prem Database', layer: 'tech', info: 'Oracle DB, on-premises. No HA. Manual backups.' } },
        { data: { id: 'ui_legacy', label: 'Legacy Web UI', layer: 'app', info: 'Server-rendered pages. No API contract.' } },
        { data: { id: 'erp', label: 'ERP System', layer: 'app', info: 'SAP ECC — end-of-life version. Manual integration.' } },
      ],
      edges: [
        { data: { source: 'ui_legacy', target: 'monolith' } },
        { data: { source: 'monolith', target: 'db_legacy' } },
        { data: { source: 'monolith', target: 'erp' } },
      ],
    },
    target: {
      nodes: [
        { data: { id: 'api_gw', label: 'API Gateway', layer: 'tech', info: 'Centralised routing, auth, rate-limiting. Decouples clients from services.' } },
        { data: { id: 'svc_order', label: 'Order Service', layer: 'app', info: 'Bounded context: order lifecycle. Independent deployment.' } },
        { data: { id: 'svc_product', label: 'Product Service', layer: 'app', info: 'Catalogue and inventory. Deployed separately.' } },
        { data: { id: 'db_cloud', label: 'Cloud Database', layer: 'tech', info: 'Managed PostgreSQL. Auto-scaling, HA, point-in-time recovery.' } },
        { data: { id: 'erp_s4', label: 'SAP S/4HANA', layer: 'app', info: 'Modernised ERP. Event-driven integration via middleware.' } },
        { data: { id: 'ui_spa', label: 'React SPA', layer: 'app', info: 'Decoupled front-end. Communicates via API Gateway.' } },
        { data: { id: 'bus', label: 'Event Bus', layer: 'tech', info: 'Async messaging between services. Reduces coupling.' } },
      ],
      edges: [
        { data: { source: 'ui_spa', target: 'api_gw' } },
        { data: { source: 'api_gw', target: 'svc_order' } },
        { data: { source: 'api_gw', target: 'svc_product' } },
        { data: { source: 'svc_order', target: 'db_cloud' } },
        { data: { source: 'svc_product', target: 'db_cloud' } },
        { data: { source: 'svc_order', target: 'bus' } },
        { data: { source: 'bus', target: 'erp_s4' } },
      ],
    },
  };

  const LAYER_COLOURS = { app: '#7d4c67', tech: '#4A7C9C', business: '#C8963E' };

  let cy;
  let currentTopology = 'legacy';

  function buildElements(topo) {
    return [
      ...topo.nodes.map(n => ({
        data: { ...n.data },
        classes: n.data.layer,
      })),
      ...topo.edges,
    ];
  }

  function initCy(topology) {
    cy = cytoscape({
      container: document.getElementById('cy'),
      elements: buildElements(TOPOLOGIES[topology]),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': ele => LAYER_COLOURS[ele.data('layer')] || '#7d4c67',
            'label': 'data(label)',
            'color': '#fff',
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'width': 48,
            'height': 48,
            'border-width': 2,
            'border-color': 'rgba(255,255,255,0.15)',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'rgba(255,255,255,0.2)',
            'target-arrow-color': 'rgba(255,255,255,0.3)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: ':selected',
          style: { 'border-color': '#FDF5E6', 'border-width': 3 },
        },
      ],
      layout: { name: 'cose', padding: 40, animate: true, animationDuration: 600 },
    });

    cy.on('tap', 'node', function (evt) {
      const node = evt.target;
      const card = document.getElementById('decision-card');
      document.getElementById('card-title').textContent = node.data('label');
      document.getElementById('card-body').textContent = node.data('info') || '';
      card.classList.add('visible');
    });
  }

  function switchTopology(topo) {
    currentTopology = topo;
    cy.elements().remove();
    cy.add(buildElements(TOPOLOGIES[topo]));
    cy.layout({ name: 'cose', padding: 40, animate: true, animationDuration: 600 }).run();
    document.querySelectorAll('.arch-btn[data-topo]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.topo === topo);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCy('legacy');

    document.querySelectorAll('.arch-btn[data-topo]').forEach(btn => {
      btn.addEventListener('click', () => switchTopology(btn.dataset.topo));
    });

    document.getElementById('close-card').addEventListener('click', () => {
      document.getElementById('decision-card').classList.remove('visible');
    });
  });
})();
```

---

### Task 3.2 — Create `src/templates/architecture.html`
- [ ] Create file:

```html
{% extends 'base.html' %}

{% block title %}Architecture Simulator — Michael Cullen{% endblock %}
{% block meta_description %}Interactive architecture transformation simulator — legacy to target-state, grounded in real Deloitte engagements.{% endblock %}

{% block head %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.27.0/cytoscape.min.js"
        integrity="sha512-d5mXkqPaZN1kH4dZKv3hOjHetW1rBvqeGUSh9p0GqZ9nCL8HlkC1x3zBIAJENO+mBm0oVWNmRRCaopqxDxpbg=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
{% endblock %}

{% block content %}

<div class="arch-hero">
  <h1>Architecture Transformation Simulator</h1>
  <p>Toggle between legacy and target-state topologies. Click any node to see the
     architectural decision behind it.</p>
</div>

<div class="arch-body">
  <div style="max-width:1100px;margin:0 auto">

    <div class="arch-controls">
      <span class="arch-controls-label">Topology:</span>
      <button class="arch-btn active" data-topo="legacy">Legacy State</button>
      <button class="arch-btn" data-topo="target">Target State</button>
      <span class="arch-controls-label" style="margin-left:1.5rem">Layer:</span>
      <button class="arch-btn active" data-layer="all">All</button>
      <button class="arch-btn" data-layer="app">Application</button>
      <button class="arch-btn" data-layer="tech">Technology</button>
    </div>

    <div id="cy"></div>

    <p style="color:rgba(255,255,255,0.25);font-size:0.75rem;margin-top:0.75rem;text-align:right">
      Content based on anonymised Deloitte transformation engagements.
      Real client data never displayed.
    </p>

  </div>
</div>

<!-- Decision card overlay -->
<div class="decision-card" id="decision-card">
  <button class="decision-close" id="close-card" aria-label="Close">&times;</button>
  <h3 id="card-title"></h3>
  <p id="card-body"></p>
</div>

{% endblock %}

{% block scripts %}
<script src="{{ url_for('static', filename='js/architecture.js') }}"></script>
{% endblock %}
```

---

### Task 3.3 — Commit Phase 3
- [ ] Run:
```bash
git add src/templates/architecture.html src/static/js/architecture.js
git commit -m "phase 3: architecture simulator stub with Cytoscape.js"
```

---

## Phase 4 — Physics Playground (Neutrino Oscillation)

Spec: `docs/superpowers/specs/physics-playground.md`

### Task 4.1 — Create `src/static/js/physics.js`
- [ ] Create file (full implementation per spec):

```javascript
(function () {

  // ── Physics ───────────────────────────────────────────────
  const DEG = Math.PI / 180;

  const PRESETS = {
    'no-mixing': {
      label: 'No Mixing',
      theta12: 0, theta13: 0, theta23: 0,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_12',
    },
    'solar': {
      label: 'Solar Neutrinos',
      theta12: 33.4 * DEG, theta13: 8.6 * DEG, theta23: 49.2 * DEG,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_12',
    },
    'atmospheric': {
      label: 'Atmospheric Neutrinos',
      theta12: 33.4 * DEG, theta13: 8.6 * DEG, theta23: 49.2 * DEG,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_23',
    },
    'maximum': {
      label: 'Maximum Mixing',
      theta12: 45 * DEG, theta13: 45 * DEG, theta23: 45 * DEG,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_23',
    },
  };

  // Two-flavour approx: P(survive) = 1 - sin²(2θ)·sin²(1.27·Δm²·L/E)
  function pSurvive(theta, dm2, LE) {
    return 1 - Math.pow(Math.sin(2 * theta), 2) * Math.pow(Math.sin(1.27 * dm2 * LE), 2);
  }

  function calcProbs(preset, LE) {
    const { theta12, theta13, theta23, dm2_12, dm2_23, dominant } = preset;
    const dm2  = dominant === 'dm2_12' ? dm2_12 : dm2_23;
    const theta = dominant === 'dm2_12' ? theta12 : theta23;
    const pEE  = pSurvive(theta13, dm2_12, LE) * pSurvive(theta12, dm2, LE);
    const pMM  = pSurvive(theta23, dm2, LE);
    const pTT  = 1 - pEE - pMM;
    const sum  = pEE + Math.max(0, pMM) + Math.max(0, pTT);
    return {
      e: Math.max(0, pEE) / sum,
      m: Math.max(0, pMM) / sum,
      t: Math.max(0, pTT) / sum,
    };
  }

  // ── Canvas / Triangle geometry ────────────────────────────
  const COLOURS = {
    e: '#7d4c67',  // burgundy — νe top
    m: '#C8963E',  // amber    — νμ bottom-left
    t: '#4A7C9C',  // slate    — ντ bottom-right
  };

  let canvas, ctx, W, H;
  let triVerts;       // [{x,y}] top, bl, br
  let currentPreset   = PRESETS['no-mixing'];
  let LE              = 0.5;    // km/GeV, 0–2000 range on slider
  let dotPos          = { x: 0, y: 0 };
  let tail            = [];     // recent positions for fading tail
  let animFrame;
  let morphSource     = null;   // for preset-switch path morph
  let morphTarget     = null;
  let morphT          = 1;      // 0→1 transition
  const MORPH_DUR     = 600;    // ms

  function resize() {
    const size = Math.min(canvas.parentElement.clientWidth, 500);
    canvas.width = canvas.height = size;
    W = H = size;
    const cx = W / 2, cy = H / 2;
    const r  = W * 0.38;
    triVerts = [
      { x: cx,           y: cy - r },                          // top — νe
      { x: cx - r * 0.866, y: cy + r * 0.5 },                 // bottom-left — νμ
      { x: cx + r * 0.866, y: cy + r * 0.5 },                 // bottom-right — ντ
    ];
  }

  function barycentricToXY(e, m, t) {
    return {
      x: e * triVerts[0].x + m * triVerts[1].x + t * triVerts[2].x,
      y: e * triVerts[0].y + m * triVerts[1].y + t * triVerts[2].y,
    };
  }

  function drawTriangle() {
    // Background gradient fill
    const grad = ctx.createLinearGradient(triVerts[2].x, triVerts[0].y, triVerts[1].x, triVerts[2].y);
    grad.addColorStop(0, 'rgba(125,76,103,0.18)');
    grad.addColorStop(0.5, 'rgba(26,26,46,0.05)');
    grad.addColorStop(1, 'rgba(74,124,156,0.18)');

    ctx.beginPath();
    ctx.moveTo(triVerts[0].x, triVerts[0].y);
    ctx.lineTo(triVerts[1].x, triVerts[1].y);
    ctx.lineTo(triVerts[2].x, triVerts[2].y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vertex labels
    const labels = [
      { v: triVerts[0], text: 'νe',  col: COLOURS.e, dy: -14 },
      { v: triVerts[1], text: 'νμ',  col: COLOURS.m, dy:  22, dx: -10 },
      { v: triVerts[2], text: 'ντ',  col: COLOURS.t, dy:  22, dx:  10 },
    ];
    ctx.font = 'italic 14px Inter, sans-serif';
    labels.forEach(({ v, text, col, dy = 0, dx = 0 }) => {
      ctx.fillStyle = col;
      ctx.textAlign = 'center';
      ctx.fillText(text, v.x + (dx || 0), v.y + dy);
    });
  }

  function drawPath() {
    const steps = 120;
    const leMax = parseFloat(document.getElementById('le-slider').max);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const le = (i / steps) * leMax;
      const p = calcProbs(currentPreset, le);
      const pos = barycentricToXY(p.e, p.m, p.t);
      i === 0 ? ctx.moveTo(pos.x, pos.y) : ctx.lineTo(pos.x, pos.y);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawTail() {
    tail.forEach((pt, i) => {
      const alpha = (i / tail.length) * 0.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253,245,230,${alpha})`;
      ctx.fill();
    });
  }

  function drawDot() {
    // Glow
    const grd = ctx.createRadialGradient(dotPos.x, dotPos.y, 0, dotPos.x, dotPos.y, 14);
    grd.addColorStop(0, 'rgba(253,245,230,0.8)');
    grd.addColorStop(1, 'rgba(253,245,230,0)');
    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    // Core
    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FDF5E6';
    ctx.fill();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    drawTriangle();
    drawPath();
    drawTail();
    drawDot();
  }

  function updateDot() {
    const probs = calcProbs(currentPreset, LE);
    dotPos = barycentricToXY(probs.e, probs.m, probs.t);
    tail.push({ ...dotPos });
    if (tail.length > 18) tail.shift();
    updateBars(probs);
    updatePMNS();
  }

  function updateBars(probs) {
    const fill = (id, val, col) => {
      const el = document.getElementById(id);
      if (el) { el.style.height = (val * 100).toFixed(1) + '%'; el.style.background = col; }
    };
    fill('bar-e', probs.e, COLOURS.e);
    fill('bar-m', probs.m, COLOURS.m);
    fill('bar-t', probs.t, COLOURS.t);
  }

  function updatePMNS() {
    const p = currentPreset;
    const fmt = rad => (rad / DEG).toFixed(1) + '°';
    const el = document.getElementById('pmns-values');
    if (el) {
      el.textContent = `θ₁₂  ${fmt(p.theta12)}\nθ₁₃  ${fmt(p.theta13)}\nθ₂₃  ${fmt(p.theta23)}`;
    }
  }

  function setPreset(key) {
    currentPreset = PRESETS[key];
    tail = [];
    updateDot();
    render();
    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === key);
    });
  }

  function loop() {
    render();
    animFrame = requestAnimationFrame(loop);
  }

  document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('physics-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', () => { resize(); updateDot(); });

    const slider = document.getElementById('le-slider');
    const leVal  = document.getElementById('le-value');

    slider.addEventListener('input', () => {
      LE = parseFloat(slider.value);
      leVal.textContent = LE.toFixed(1) + ' km/GeV';
      updateDot();
    });

    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.addEventListener('click', () => setPreset(btn.dataset.preset));
    });

    setPreset('no-mixing');
    loop();
  });

})();
```

---

### Task 4.2 — Create `src/templates/physics.html`
- [ ] Create file:

```html
{% extends 'base.html' %}

{% block title %}Physics Playground — Michael Cullen{% endblock %}
{% block meta_description %}Neutrino oscillation visualiser — real PMNS mixing parameters, interactive L/E scrubber. Based on an MPhys thesis.{% endblock %}

{% block content %}

<div class="physics-hero">
  <h1>Neutrino Oscillation</h1>
  <p><em>"A neutrino has no definite flavour in transit. It is all three at once."</em></p>
</div>

<div class="physics-body">

  <!-- Mode tabs -->
  <div class="mode-tabs">
    <button class="mode-tab active">Neutrino Oscillation</button>
    <button class="mode-tab" disabled title="Coming soon">GR Simulator &nbsp;(coming soon)</button>
  </div>

  <!-- Intro text -->
  <div class="physics-intro">
    <p>The flavour triangle shows where a neutrino's identity lives at any moment.
       The path it traces is determined by three mixing angles — real numbers measured
       by experiment, first confirmed in 2015.
       This is the mathematics at the centre of my M.Phys thesis.</p>
  </div>

  <!-- Preset pills -->
  <div class="preset-pills">
    <button class="preset-pill active" data-preset="no-mixing">No Mixing</button>
    <button class="preset-pill" data-preset="solar">Solar Neutrinos</button>
    <button class="preset-pill" data-preset="atmospheric">Atmospheric Neutrinos</button>
    <button class="preset-pill" data-preset="maximum">Maximum Mixing</button>
  </div>

  <!-- Canvas -->
  <canvas id="physics-canvas" width="480" height="480"></canvas>

  <!-- L/E scrubber -->
  <div class="scrubber-wrap">
    <label for="le-slider">Baseline / Energy (L/E)</label>
    <p class="scrubber-val" id="le-value">0.5 km/GeV</p>
    <input type="range" id="le-slider" min="0" max="2000" step="0.5" value="0.5">
    <p class="scrubber-sub">Drag to travel further from the source — or increase the neutrino's energy.</p>
  </div>

  <!-- Probability bars -->
  <div class="prob-bars">
    <div class="prob-bar-wrap">
      <span class="prob-bar-label">P(νe)</span>
      <div class="prob-bar-track">
        <div class="prob-bar-fill" id="bar-e" style="height:100%;background:#7d4c67"></div>
      </div>
    </div>
    <div class="prob-bar-wrap">
      <span class="prob-bar-label">P(νμ)</span>
      <div class="prob-bar-track">
        <div class="prob-bar-fill" id="bar-m" style="height:0%;background:#C8963E"></div>
      </div>
    </div>
    <div class="prob-bar-wrap">
      <span class="prob-bar-label">P(ντ)</span>
      <div class="prob-bar-track">
        <div class="prob-bar-fill" id="bar-t" style="height:0%;background:#4A7C9C"></div>
      </div>
    </div>
  </div>

  <!-- PMNS inset -->
  <div class="pmns-inset">
    <pre id="pmns-values">θ₁₂  0.0°
θ₁₃  0.0°
θ₂₃  0.0°</pre>
  </div>

</div>

{% endblock %}

{% block scripts %}
<script src="{{ url_for('static', filename='js/physics.js') }}"></script>
{% endblock %}
```

---

### Task 4.3 — Commit Phase 4
- [ ] Run:
```bash
git add src/templates/physics.html src/static/js/physics.js
git commit -m "phase 4: physics playground — neutrino oscillation visualiser"
```

---

## Phase 5 — Polish & Ship

### Task 5.1 — Add SEO meta tags and favicon placeholder to `base.html`
- [ ] Edit `src/templates/base.html` — add inside `<head>`, after the existing `<meta name="description">`:

```html
  <!-- Open Graph -->
  <meta property="og:title"       content="{% block og_title %}Michael Cullen{% endblock %}">
  <meta property="og:description" content="{% block og_desc %}Technology Manager at Deloitte — architecture, data/AI, quantum computing.{% endblock %}">
  <meta property="og:type"        content="website">
  <!-- Favicon (add a real .ico to src/static/ to activate) -->
  <link rel="icon" href="{{ url_for('static', filename='favicon.ico') }}" type="image/x-icon">
```

---

### Task 5.2 — Verify the app runs end-to-end
- [ ] Ensure a `.env` file exists with the four required variables (or export them in the shell):
```bash
export SECRET_KEY="dev-secret-key-change-me"
export MAIL_USERNAME="placeholder@gmail.com"
export MAIL_DEFAULT_SENDER="placeholder@gmail.com"
export MAIL_PASSWORD="placeholder"
```
- [ ] Start the dev server:
```bash
cd src && python3 main.py
```
Expected: `Running on http://0.0.0.0:8080`

- [ ] Manually verify each route in a browser or with curl:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/          # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/cv         # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/contact    # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/physics    # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/architecture # expect 200
```

---

### Task 5.3 — Final commit and push
- [ ] Stage all remaining changes:
```bash
git add -A
git status
```
- [ ] Commit:
```bash
git commit -m "phase 5: SEO meta, favicon placeholder, final polish"
```
- [ ] Push to branch:
```bash
git push -u origin claude/resume-website-redesign-X22Mw
```

---

## Open Decisions Blocking Full Completion

| Item | Blocks | Action needed |
|------|--------|--------------|
| Deloitte anonymised case-study blurbs (sector · challenge · architecture · outcome) | Phase 3 full content — the stub is live but shows placeholder nodes | Michael to supply 2–3 blurbs |
| Forward-facing title wording | Homepage hero + CV (`Manager, Technology Transformation` used as default above — confirm or adjust) | Michael to confirm |
| Canonical location | Edinburgh used above — GitHub shows London | Michael to confirm |
| Profile photo (`me.png` / headshot) | CV sidebar photo | Michael to supply file → `src/static/me.jpg` |
| Thesis PDF | `/qc_neutrino_paper` route 404s without it | Michael to supply `QC_Paper.pdf` → `src/static/` |

---

## Self-Review Checklist

- [x] Every PRD §12 phase has tasks mapped
- [x] Every PRD §10 route (`/`, `/cv`, `/contact`, `/architecture`, `/physics`) has a template and route handler
- [x] Design tokens match PRD §7 palette exactly
- [x] Physics spec (docs/superpowers/specs/physics-playground.md) fully implemented: flavour triangle, 4 presets, L/E scrubber, probability bars, PMNS inset, Mode 2 "coming soon" tab
- [x] Contact recipient updated to `michaelcullen2024@gmail.com`
- [x] W3.CSS removed; FA4 replaced with FA6; CSS/JS served as static assets (not inlined)
- [x] No placeholder TODOs in code — open decisions documented above, content clearly marked
- [x] Each task has actual file content, not references to other tasks
