# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- Python 3.9 - Backend application logic (`src/main.py`)
- HTML/Jinja2 - Server-side templated views (`src/templates/`)
- CSS - Inline styles within templates (no separate `.css` files committed)

## Runtime

**Environment:**
- Python 3.9 (pinned in `Dockerfile` via `python:3.9-slim` base image and in `src/app.yaml` via `runtime: python39`)

**Package Manager:**
- pip
- Lockfile: `requirements.txt` present at both repo root and `src/requirements.txt` (identical content)

## Frameworks

**Core:**
- Flask 2.2.2 - Web framework; routes, template rendering, static file serving (`src/main.py`)
- Jinja2 3.1.2 - Template engine (bundled with Flask; templates in `src/templates/`)
- Werkzeug 2.2.2 - WSGI utility library (Flask dependency)

**Forms:**
- Flask-WTF 1.0.1 - WTF form integration for Flask (`src/main.py` - `EmailForm`)
- WTForms 3.0.1 - Form validation and rendering

**Email:**
- Flask-Mail 0.9.1 - SMTP email sending (`src/main.py`)

**Build/Dev:**
- gunicorn - Production WSGI server (invoked in `Dockerfile` CMD; not in `requirements.txt` — must be pre-installed in base image or missing from deps)
- Docker - Container build defined in `Dockerfile`
- Docker Compose - Local dev orchestration defined in `docker-compose.yml`

## Key Dependencies

**Critical:**
- `Flask==2.2.2` - Core web framework
- `Flask-Mail==0.9.1` - Contact form email delivery
- `Flask-WTF==1.0.1` - CSRF-protected contact form
- `itsdangerous==2.1.2` - Secret key signing (Flask session/CSRF)

**Utility:**
- `beautifulsoup4==4.11.1` - HTML parsing (imported indirectly; not used directly in `main.py`)
- `google==3.0.0` - Google package (present but no direct usage detected in `main.py`)
- `python-dateutil==2.8.2` - Date utilities (present but no direct usage detected in `main.py`)

## Configuration

**Environment:**
- `SECRET_KEY` generated at runtime via `os.urandom(32)` — not persistent across restarts (`src/main.py:9`)
- `MAIL_PASSWORD` hardcoded directly in `src/main.py:15` — security concern
- `FLASK_APP`, `FLASK_RUN_HOST`, `FLASK_DEBUG` set as Docker ENV vars in `Dockerfile`

**Build:**
- `Dockerfile` — single-stage build from `python:3.9-slim`
- `docker-compose.yml` — maps host port 80 to container port 8080; includes a Redis service (purpose unclear — no Redis usage found in application code)
- `src/app.yaml` — Google App Engine Standard configuration (Python 3.9 runtime, static handler for `/static`)

## Frontend Assets (CDN)

Loaded directly in templates via CDN (no local bundling):
- W3.CSS 4 — `https://www.w3schools.com/w3css/4/w3.css`
- Font Awesome 4.7.0 — `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`
- Google Fonts (Roboto, Montserrat) — `https://fonts.googleapis.com`

## Platform Requirements

**Development:**
- Docker + Docker Compose (recommended)
- Or: Python 3.9, pip, gunicorn

**Production:**
- Google App Engine Standard (Python 3.9) via `src/app.yaml`
- Or: Any Docker-compatible host exposing port 8080

---

*Stack analysis: 2026-04-10*
