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

**Contact form** uses Flask-Mail over Gmail SMTP (TLS, port 587). All four credentials (`SECRET_KEY`, `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, `MAIL_PASSWORD`) are read from environment variables. See **Environment Variables** section below.

**Dependencies:** `src/requirements.txt` (not the root `requirements.txt`). Install with:
```bash
pip install -r src/requirements.txt
```

## Environment Variables

The app requires these four environment variables to start. Missing any will cause a `KeyError` on startup (fail-fast by design).

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Flask session signing key (CSRF protection depends on this) | Any long random string |
| `MAIL_USERNAME` | Gmail address used for sending | `you@gmail.com` |
| `MAIL_DEFAULT_SENDER` | From address for outgoing mail (usually same as username) | `you@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password (not your login password — generate at Google Account → Security → App Passwords) | `xxxx xxxx xxxx xxxx` |

**Local development:** Copy `.env.example` to `.env` and fill in real values. `load_dotenv()` loads `.env` automatically.

```bash
cp .env.example .env
# edit .env with real credentials
```

**Docker Compose:** Set `env_file: .env` in docker-compose.yml (already configured).

**Google App Engine:** Set environment variables in `src/app.yaml` under `env_variables:` or use Secret Manager. Never commit real credentials to the repo.

## Deployment Notes

- `src/app.yaml` configures Google App Engine (Python 3.12 runtime); static files at `/static` are served directly by GAE
- The Dockerfile uses `gunicorn src.main:app` — if the entry point changes, update `CMD` in `Dockerfile`
- `src/.gcloudignore` controls what gets excluded from App Engine deploys
