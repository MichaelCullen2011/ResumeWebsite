# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**Data Visualisation:**
- Tableau Public — Embeds hosted Tableau dashboards via `<iframe>` in `src/templates/tableau1.html` and `src/templates/tableau2.html`
  - No API key required; public embeds only
  - Profile: `https://public.tableau.com/profile/michael.cullen`

## Data Storage

**Databases:**
- None in active use by the application code

**Redis:**
- A Redis container is declared in `docker-compose.yml` (`image: redis`, listed as a dependency of the web service), but no Redis client library is present in `requirements.txt` and no Redis usage exists in `src/main.py`. This service appears unused.

**File Storage:**
- Local filesystem only
- Static files (images, PDF) served from `src/static/` via Flask's `send_from_directory` and the `/static` route handler in `src/app.yaml`
- `src/static/QC_Paper.pdf` served at `/qc_neutrino_paper` route (`src/main.py:60-64`)

**Caching:**
- None implemented

## Authentication & Identity

**Auth Provider:**
- None — no user authentication exists in this application

## Email / Messaging

**SMTP via Gmail:**
- Provider: Google Mail SMTP (`smtp.googlemail.com:587`, TLS)
- Implementation: Flask-Mail (`src/main.py:10-17`)
- Sender address: `swiftyblaze@gmail.com` (hardcoded in `src/main.py:13-14`)
- Recipient address: `michaelcullen2011@hotmail.co.uk` (hardcoded in `src/main.py:33`)
- App password: hardcoded directly in source at `src/main.py:15` — **not via environment variable**
- Triggered by: Contact form POST at `/contact` route

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- `print()` statements only (`src/main.py:31`)
- Docker stdout via `ENV PYTHONUNBUFFERED True` in `Dockerfile`

## CI/CD & Deployment

**Hosting:**
- Google App Engine Standard — `src/app.yaml` configures Python 3.9 runtime with static file handler
- Docker — `Dockerfile` and `docker-compose.yml` available for containerised deployment

**CI Pipeline:**
- None detected

## CDN Dependencies

All loaded from external CDNs in `src/templates/homepage_base.html` and `src/templates/tableau1.html`:
- W3.CSS: `https://www.w3schools.com/w3css/4/w3.css`
- Font Awesome 4.7.0: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`
- Google Fonts: `https://fonts.googleapis.com` (Roboto, Montserrat)

## Environment Configuration

**Required env vars:**
- None currently required — all config is hardcoded in `src/main.py`

**Secrets location:**
- `MAIL_PASSWORD` hardcoded in `src/main.py:15` — should be moved to an environment variable
- `MAIL_USERNAME` / `MAIL_DEFAULT_SENDER` hardcoded in `src/main.py:13-14`
- `SECRET_KEY` generated dynamically at startup via `os.urandom(32)` in `src/main.py:9` — not stable across restarts

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-04-10*
