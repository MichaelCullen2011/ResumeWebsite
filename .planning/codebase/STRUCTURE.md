# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```
ResumeWebsiteFlask/
├── src/
│   ├── main.py              # Flask application — all routes and config
│   ├── app.yaml             # Google App Engine deployment config
│   ├── templates/           # Jinja2 HTML templates and CSS/JS partials
│   └── static/              # Images and PDF assets
├── requirements.txt         # Python dependencies (pinned versions)
├── Dockerfile               # Container build for Docker/Gunicorn deployment
├── docker-compose.yml       # Local Docker Compose config
└── README.md                # Project documentation
```

## Directory Purposes

**`src/`:**
- Purpose: Entire application source
- Key files: `main.py` (application entry point and all routes)

**`src/templates/`:**
- Purpose: All Jinja2 templates rendered by Flask
- Contains: Page templates, shared partials, inline CSS, inline JS
- Key files: See "Template Hierarchy" below

**`src/static/`:**
- Purpose: Binary and document assets served directly
- Contains: `.jpg`, `.png`, `.pdf` files
- Key files: `Michael_Cullen_Headshot.jpg`, `QC_Paper.pdf`

## Template Hierarchy

Templates use two composition mechanisms: `{% extends %}` and `{% include %}`.

**Extend pattern (base + child):**
```
homepage_base.html   ← full standalone page markup
  └── homepage.html  ← extends homepage_base.html (block content is empty)

cv_base.html         ← full standalone page markup
  └── cv.html        ← extends cv_base.html (block content is empty)
```
Note: The child templates (`homepage.html`, `cv.html`) declare `{% extends %}` but provide empty `{% block content %}` blocks — all content lives in the base files.

**Include pattern (partials):**
All page templates (`homepage_base.html`, `cv_base.html`, `contact.html`, `tableau1.html`, `tableau2.html`) include:
- `{% include 'header.html' %}` — navigation bar with burger menu JS
- `{% include 'style.css' %}` — global CSS (included inside `<style>` tags)
- `{% include 'socials.html' %}` — social links footer

**All template files:**
| File | Type | Route |
|------|------|-------|
| `homepage.html` | Page (child) | `/` |
| `homepage_base.html` | Page (base) | serves `/` |
| `cv.html` | Page (child) | `/cv` |
| `cv_base.html` | Page (base) | serves `/cv` |
| `contact.html` | Page | `/contact` GET |
| `contact_sent.html` | Page | `/contact` POST response |
| `contact_bar.html` | Partial | (unused in routes) |
| `tableau1.html` | Page | `/tableau1` |
| `tableau2.html` | Page | `/tableau2` |
| `header.html` | Partial | included in all pages |
| `socials.html` | Partial | included in all pages |
| `style.css` | Partial (CSS) | included in all pages |
| `fa.css` | Partial (CSS) | Font Awesome local copy |
| `navlinkscript.js` | Partial (JS) | (available, may be included) |
| `header_new.html` | Partial | (alternate header, unused) |

## Static Asset Organization

All assets are flat in `src/static/` — no subdirectories.

```
src/static/
├── Michael_Cullen_Headshot.jpg   # Profile photo used in cv_base.html
├── Michael_Cullen_Red.jpg        # Alternate profile photo
├── QC_Paper.pdf                  # Served at /qc_neutrino_paper
├── me.png                        # Profile image variant
├── *.jpg / *.png                 # Project card background images
└── [other images]
```

## Key File Locations

**Entry Point:**
- `src/main.py`: Flask app instantiation, all route definitions, EmailForm class, mail config

**Deployment Config:**
- `Dockerfile`: Container build — Python 3.9-slim, installs `requirements.txt`, runs Gunicorn on port 8080
- `src/app.yaml`: Google App Engine — Python 3.9 runtime, static file handler for `/static`
- `docker-compose.yml`: Local container orchestration

**Dependencies:**
- `requirements.txt`: Pinned Python packages — Flask 2.2.2, Flask-Mail 0.9.1, Flask-WTF 1.0.1, Jinja2 3.1.2, WTForms 3.0.1

## Naming Conventions

**Templates:**
- Page bases: `<page>_base.html` (e.g., `homepage_base.html`, `cv_base.html`)
- Page entry points: `<page>.html` (e.g., `homepage.html`, `cv.html`)
- Partials: descriptive lowercase names (e.g., `header.html`, `socials.html`)
- Confirmation pages: `<action>_sent.html` (e.g., `contact_sent.html`)

**Static assets:**
- No consistent convention — mix of PascalCase (`Michael_Cullen_Headshot.jpg`) and lowercase

## Where to Add New Code

**New page route:**
- Add route handler to `src/main.py`
- Create `src/templates/<page>_base.html` for content
- Create `src/templates/<page>.html` that extends the base (or render base directly)
- Include `{% include 'header.html' %}`, `{% include 'style.css' %}`, `{% include 'socials.html' %}` in the base

**New static asset:**
- Drop file into `src/static/`
- Reference in templates as `static/<filename>` (no leading slash for relative refs in templates, or use `url_for('static', filename='...')`)

**New shared partial:**
- Create `src/templates/<partial-name>.html`
- Include with `{% include '<partial-name>.html' %}` in relevant page bases

## Special Directories

**`.venv/`:**
- Purpose: Local Python virtual environment
- Generated: Yes
- Committed: No (should be in `.gitignore`)

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: Yes (by GSD tooling)
- Committed: Depends on team preference

---

*Structure analysis: 2026-04-10*
