# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

**Local (Flask dev server):**
```bash
cd src
python3 main.py
```
Accessible at `http://localhost:8080`

**Docker Compose (live-reload via volume mount):**
```bash
docker-compose build
docker-compose up -d
```
Accessible at `http://localhost:80` (maps to container port 8080)

**Docker standalone:**
```bash
docker build -t resumewebsite .
docker run -p 8080:8080 resumewebsite
```

**Deploy to Google App Engine:**
```bash
cd src
gcloud app deploy --project [GCP_PROJECT_NAME]
```

## Architecture

Single-file Flask app: `src/main.py` defines all routes and the `EmailForm` WTForms class. No blueprints or separate modules.

**Routes:**
- `/` — homepage (about + projects)
- `/contact` — GET renders form, POST sends email via Flask-Mail and renders confirmation
- `/cv` — CV/resume page
- `/tableau1`, `/tableau2` — embedded Tableau dashboards
- `/qc_neutrino_paper` — serves `src/static/QC_Paper.pdf`

**Templates** live in `src/templates/` and use Jinja2 `{% extends %}` / `{% include %}`:
- `homepage_base.html` — full homepage layout (inline `style.css`, includes `header.html`, `socials.html`)
- `cv_base.html` — CV layout base
- `homepage.html` / `cv.html` extend their respective base templates
- CSS (`style.css`, `fa.css`) and JS (`navlinkscript.js`) are included inline via `{% include %}` rather than served as static files
- Static assets (images, PDF) are in `src/static/`

**Contact form** uses Flask-Mail over Gmail SMTP (TLS, port 587). Credentials are hardcoded in `src/main.py` — update `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, and `MAIL_PASSWORD` there.

**Dependencies:** `src/requirements.txt` (not the root `requirements.txt`). Install with:
```bash
pip install -r src/requirements.txt
```

## Deployment Notes

- `src/app.yaml` configures Google App Engine (Python 3.9 runtime); static files at `/static` are served directly by GAE
- The Dockerfile uses `gunicorn app:app` — if the entry point changes, update both `CMD` in `Dockerfile` and `ENV FLASK_APP`
- `src/.gcloudignore` controls what gets excluded from App Engine deploys
