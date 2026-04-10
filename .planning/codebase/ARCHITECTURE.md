# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Server-side rendered monolith (Flask MVC, no database)

**Key Characteristics:**
- Single-file application with all routes defined in `src/main.py`
- No data layer — all content is static HTML embedded in Jinja2 templates
- Template composition via `{% include %}` and `{% extends %}` rather than a formal base template hierarchy
- One stateful operation: contact form sends email via SMTP (Flask-Mail)

## Layers

**Routing / Controller:**
- Purpose: Map URLs to view functions and handle form POST logic
- Location: `src/main.py`
- Contains: All Flask route handlers, `EmailForm` WTForms class, Flask-Mail config
- Depends on: Jinja2 templates in `src/templates/`
- Used by: Gunicorn (production) or Flask dev server

**Templates (View):**
- Purpose: Render HTML pages
- Location: `src/templates/`
- Contains: Page templates, shared partials (`header.html`, `socials.html`, `style.css`)
- Depends on: W3.CSS (CDN), Font Awesome 4.7 (CDN), Google Fonts (CDN)
- Used by: Flask `render_template()` calls

**Static Assets:**
- Purpose: Serve images and a PDF file
- Location: `src/static/`
- Contains: JPEG/PNG images, `QC_Paper.pdf`
- Accessed via: `/static/<filename>` URL prefix (handled by Flask in dev, App Engine in production)

## Data Flow

**Page Request (read-only pages):**

1. Browser sends GET to `/`, `/cv`, `/tableau1`, `/tableau2`
2. Flask routes to the corresponding view function
3. View function calls `render_template("<page>.html")`
4. Jinja2 processes `{% extends %}` and `{% include %}` directives, assembles full HTML
5. Rendered HTML returned to browser

**Contact Form Submission:**

1. Browser sends POST to `/contact` with fields: `Name`, `Email`, `Message`
2. `get_contact()` reads raw `request.form` values (not the WTForms object)
3. Constructs a `flask_mail.Message` with sender set to the submitter's email
4. `mail.send(msg)` delivers via Gmail SMTP (port 587, TLS)
5. Returns `contact_sent.html` on success

**PDF Serving:**

1. GET `/qc_neutrino_paper`
2. `send_from_directory("static/", "QC_Paper.pdf")` streams the file

## Key Abstractions

**EmailForm (WTForms):**
- Purpose: CSRF token generation and form field declaration
- Location: `src/main.py` (lines 41-46)
- Note: Form fields are defined on the class but the POST handler reads `request.form` directly, bypassing WTForms validation

## Entry Points

**Development:**
- Location: `src/main.py` (line 67-68)
- Triggers: `python src/main.py` or `flask run`
- Listens on: `0.0.0.0:8080`

**Production (Docker/Gunicorn):**
- Location: `Dockerfile` CMD line
- Command: `gunicorn app:app -b :8080 --timeout 300`
- Note: Dockerfile sets `FLASK_APP=src/main.py` but Gunicorn targets `app:app` — module path mismatch exists

**Production (Google App Engine):**
- Config: `src/app.yaml`
- Runtime: Python 3.9, `script: auto`
- Static files served directly by App Engine from `src/static/`

## Error Handling

**Strategy:** Minimal

**Patterns:**
- `send_from_directory` wraps a `try/except FileNotFoundError` returning plain string "Not Found"
- No error handling on mail send — SMTP failures will raise unhandled exceptions
- No custom 404/500 error pages

## Cross-Cutting Concerns

**Logging:** `print()` only — `print(subject)` in contact handler
**Validation:** None enforced — contact form fields have HTML `required` attribute only; no server-side validation
**Authentication:** None — all routes are public
**CSRF:** Flask-WTF CSRF token is generated via `EmailForm` but the form tag in `contact.html` does not include `{{ form.hidden_tag() }}`, so CSRF protection is not active

---

*Architecture analysis: 2026-04-10*
