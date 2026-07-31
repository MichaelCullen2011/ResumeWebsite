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
Accessible at `http://localhost:80` (maps to container port 8080). Only `src/` is mounted (`./src:/app/src`) — changes outside `src/` require a rebuild.

**Docker standalone:**
```bash
docker build -t resumewebsite .
docker run -p 8080:8080 resumewebsite
```

**Deploy to Google App Engine** (project `michaelcullenpersonal`):
```bash
cd src
gcloud app deploy app.release.yaml --project michaelcullenpersonal \
  --version "release-$(date +%Y%m%d)-$(git rev-parse --short=8 HEAD)" --no-promote
```
Deploy `app.release.yaml`, never the tracked `app.yaml` — the latter carries
`REPLACE_BEFORE_DEPLOY` placeholders, so deploying it publishes a `SECRET_KEY` that is
public in this repo and breaks the contact form. See `README.md` for the full release
flow: deploy with `--no-promote`, smoke-test the versioned URL including the contact
form, then promote traffic.

## Architecture

Single-file Flask app: `src/main.py` defines all routes and the `EmailForm` WTForms class. No blueprints or separate modules.

**Routes:**
- `/` — homepage (about, experience, and selected projects)
- `/contact` — GET renders form, POST sends email via Flask-Mail and renders confirmation
- `/cv` — CV/resume page
- `/architecture` — selected AI architecture case study
- `/cv.pdf` — downloadable public CV PDF
- `/physics` — neutrino oscillation visualiser
- `/laurels` — Laurels case study, embedding the game from another repo (see **The Laurels embed** below)
- `/qc_neutrino_paper` — serves `src/static/QC_Paper.pdf`
- `/robots.txt` and `/sitemap.xml` — served from `src/static/` at their canonical root URLs

**Templates** live in `src/templates/` and extend `base.html`. Shared CSS and JavaScript are served from `src/static/`:
- `index.html`, `cv.html`, `contact.html`, `architecture.html`, `physics.html`, and `laurels.html` are the public pages.
- `src/static/css/style.css` is the design system.
- `src/static/js/hero.js`, `nav.js`, and `physics.js` are page interactions.
- Static assets include images, the thesis PDF, sitemap, and robots rules.

**Contact form** uses Flask-Mail over Gmail SMTP (TLS, port 587). All four credentials (`SECRET_KEY`, `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, `MAIL_PASSWORD`) are read from environment variables. See **Environment Variables** section below. Fields are rendered with WTForms and validation errors are displayed per field.

## The Laurels embed

`/laurels` is the only page that depends on something outside this repository. It is a
case study for **Laurels**, a roguelike chess variant whose source lives in the separate
**`Chuss`** repository (private; repo codename Chuss, public game name Laurels). The game
is a Vite/React/TypeScript app deployed to **Firebase Hosting** at
`https://laurels-game.web.app`, and `laurels.html` embeds that deployment in an iframe.

**Nothing about the game is vendored here.** This repo holds a page that frames it, so:

- Game changes go live by deploying the Chuss project to Firebase. This site does not need
  redeploying to pick them up, and nothing here needs rebuilding.
- If the embed ever renders blank, suspect the game's deployment or its response headers
  first — not this codebase.

The alternative was building the game and committing its `dist/` under `src/static/`. That
was rejected: it puts a ~400K build artifact in this repo and makes every game tweak a
two-repo release. The trade-off is that this page depends on a third-party origin staying
available and frameable.

**Two things the embed depends on, both easy to break by accident:**

- `allow="clipboard-write; fullscreen"` on the iframe. The game copies seed-share links
  with `navigator.clipboard`, which a cross-origin frame refuses without this grant — and
  it fails silently, with no console error.
- The game's origin must permit framing by this site. It relies on
  `frame-ancestors` in the Chuss project's `firebase.json` allowing
  `https://michaelcullenpersonal.nw.r.appspot.com`. If this site ever moves to a custom
  domain, that value needs updating in the **Chuss** repo or the embed breaks here.

The iframe's mobile height is deliberately sized so the game's own "how to play" dialog
fits with its Play button reachable. Shrink it and the game becomes unstartable on a
phone. `tests/test_app.py` covers the clipboard grant and the iframe's accessible name.

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

**Recovering the production values on a new machine:** `.env` and `src/app.release.yaml`
are both gitignored, so neither reaches a fresh clone. The values are not lost — App
Engine stores them on the deployed version, so read them back rather than minting new
ones:

```bash
gcloud app versions list --project michaelcullenpersonal --hide-no-traffic
gcloud app versions describe <version-id> --service=default \
  --project michaelcullenpersonal --format=json   # see .envVariables
```

Generating a fresh `SECRET_KEY` instead is survivable (it only invalidates existing
sessions and in-flight CSRF tokens), but `MAIL_PASSWORD` would have to be reissued as a
new Gmail App Password.

**Docker Compose:** Set `env_file: .env` in docker-compose.yml (already configured).

**Google App Engine:** Set environment variables in `src/app.yaml` under `env_variables:` or use Secret Manager. Never commit real credentials to the repo.

## Deployment Notes

- `src/app.yaml` configures Google App Engine (Python 3.12 runtime); static files at `/static` are served directly by GAE
- The Dockerfile uses `gunicorn src.main:app` — if the entry point changes, update `CMD` in `Dockerfile`
- `src/.gcloudignore` controls what gets excluded from App Engine deploys
- `.dockerignore` excludes local credentials, Git metadata, planning files, Markdown documentation, and Python caches from image layers

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-role triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository using root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.
