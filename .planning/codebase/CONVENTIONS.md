# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- Python: `snake_case` — `main.py`
- Templates: `snake_case.html` — `homepage_base.html`, `contact_sent.html`, `cv_base.html`
- CSS: single flat file `style.css` co-located in `src/templates/`
- Static assets: `kebab-case` or descriptive names — `NN-logo.png`, `solar-system-logo.png`, `QC_Paper.pdf`

**Python Functions (Flask routes):**
- Route handlers: `snake_case` verbs — `home()`, `get_contact()`, `cv_view()`, `paper_view()`
- Form class: `PascalCase` — `EmailForm`
- No consistent suffix convention: some use `_view` suffix (`cv_view`, `tableau1_view`), some do not (`home`, `get_contact`)

**Variables:**
- Python: `snake_case` — `name`, `email`, `message`, `subject`, `msg`
- HTML form field names: `PascalCase` — `Name`, `Email`, `Message` (inconsistent with Python convention)

**CSS Classes:**
- W3.CSS framework classes used heavily: `w3-*` prefix — `w3-content`, `w3-card`, `w3-center`
- Custom classes: `kebab-case` — `nav-links`, `contact-display`, `text-burgundy`, `custom-background-cream`
- Card variants: numbered suffix — `card-0` through `card-6`, `card-t`

**URL Routes:**
- All lowercase, hyphenated for multi-word: `/`, `/contact`, `/cv`, `/tableau1`, `/tableau2`, `/qc_neutrino_paper`
- Minor inconsistency: `/qc_neutrino_paper` uses underscores while others use no separator

## Code Style

**Formatting:**
- No formatter config detected (no `.prettierrc`, `.flake8`, `pyproject.toml`, `setup.cfg`)
- Mixed indentation in `src/main.py`: some functions use tabs, others use 4 spaces (see lines 19-38 vs 41-50)
- HTML templates use 4-space indentation inconsistently

**Linting:**
- No linting configuration detected

## Template Architecture

**Base Templates:**
- `src/templates/homepage_base.html` — base for homepage/projects pages; includes `style.css` and `header.html` via `{% include %}`
- `src/templates/cv_base.html` — base for CV page (assumed same pattern)

**Page Templates:**
- `src/templates/homepage.html` — extends `homepage_base.html` via `{% extends %}`, defines `{% block content %}`
- `src/templates/cv.html` — extends `cv_base.html` via `{% extends %}`
- `src/templates/contact.html` — standalone (does not extend a base); includes `socials.html`

**Includes:**
- `{% include 'style.css' %}` — CSS is inlined into `<style>` tags via Jinja include (not a separate `<link>` to a static file)
- `{% include 'header.html' %}` — shared nav/header component
- `{% include 'socials.html' %}` — shared social links footer component

**Pattern Summary:**
- Two-tier inheritance: base template (provides HTML head, nav, style) → page template (provides block content)
- `contact.html` breaks this pattern — it is a full standalone HTML page with inline content, not using block inheritance

## Import Organization

**Python (`src/main.py`):**
- Standard library imports first (`os`)
- Third-party imports next (`flask`, `flask_wtf`, `wtforms`, `flask_mail`)
- No project-internal imports (single-file app)

## Error Handling

**Patterns:**
- Only one explicit error handler in the codebase: `try/except FileNotFoundError` in `paper_view()` returning a plain string `"Not Found"` (`src/main.py` line 61-65)
- No global Flask error handlers (`@app.errorhandler`)
- No validation error handling on the contact form POST (form data read directly from `request.form` without WTForms validation being invoked)

## Comments

**Usage:**
- Inline comments used to mark placeholder credentials: `# enter your email here`, `# enter your password here` (`src/main.py` lines 13-15)
- HTML comments used to label sections: `<!-- Header and Navbar -->`, `<!-- ABOUT SECTION -->`, `<!-- Socials Container -->`
- No docstrings on any functions

## Configuration Style

**Flask app config:**
- All config set directly on `app.config` dictionary at module level (`src/main.py` lines 9-15)
- Secrets hardcoded as string literals — `SECRET_KEY` uses `os.urandom(32)` (regenerated each restart), mail credentials are plaintext strings

## Inline Styles

**Pattern:**
- Heavy use of inline `style=""` attributes in templates alongside CSS classes — e.g., `style="max-width:1200px;"`, `style="width:55%"`
- Inline styles and W3.CSS utility classes are mixed with custom `style.css` classes throughout

---

*Convention analysis: 2026-04-10*
