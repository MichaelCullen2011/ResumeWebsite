---
phase: 02-security-stability
plan: "02"
subsystem: infrastructure
tags: [dockerfile, docker-compose, env-vars, gunicorn, configuration]
dependency_graph:
  requires: []
  provides: [working-docker-container, env-var-documentation, env-example-template]
  affects: [Dockerfile, docker-compose.yml, .env.example, CLAUDE.md, src/requirements.txt]
tech_stack:
  added: [gunicorn==21.2.0]
  patterns: [fail-fast env var loading, placeholder .env.example committed to repo]
key_files:
  created: [.env.example]
  modified: [Dockerfile, docker-compose.yml, CLAUDE.md, src/requirements.txt]
decisions:
  - "Use src.main:app as gunicorn module path (WORKDIR=/app, app at src/main.py, src/__init__.py makes src a package)"
  - "Add gunicorn to src/requirements.txt since plan 01 runs in parallel and may not have added it yet"
  - ".env.example committed with placeholders (not gitignored) so developers have a template"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-10"
  tasks_completed: 3
  tasks_total: 3
  files_changed: 5
---

# Phase 02 Plan 02: Docker & Environment Configuration Summary

Fixed the broken Dockerfile gunicorn module path (app:app to src.main:app) and requirements copy path, removed unused Redis from docker-compose.yml, recreated the deleted .env.example with all four required env var placeholders, and added an Environment Variables section to CLAUDE.md.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Fix Dockerfile requirements path and gunicorn CMD | b50611b | Dockerfile, src/requirements.txt |
| 2 | Remove Redis from docker-compose, recreate .env.example | b271632 | docker-compose.yml, .env.example |
| 3 | Update CLAUDE.md with Environment Variables section | d9fb043 | CLAUDE.md |

## Changes Made

### Dockerfile
- **Bug fixed:** `COPY requirements.txt .` changed to `COPY src/requirements.txt .` — was copying the outdated root requirements.txt (no gunicorn) instead of the active src/requirements.txt
- **Bug fixed:** `CMD ["gunicorn", "app:app", ...]` changed to `CMD ["gunicorn", "src.main:app", ...]` — the old path referenced a non-existent `app.py` module; the Flask app is at `src/main.py` with WORKDIR `/app`, making the correct Python module path `src.main`

### src/requirements.txt
- Added `gunicorn==21.2.0` — required for the corrected Dockerfile CMD to work; added here as plan 01 runs in parallel and may not have added it yet

### docker-compose.yml
- Removed `depends_on: [redis]` from the web service — Redis was never used by the Flask app
- Removed the entire `redis:` service block — unused infrastructure creating unnecessary confusion
- All other web service configuration unchanged (build, ports, volumes, env_file)

### .env.example (recreated)
- File had been deleted (showed as `D .env.example` in git status)
- Recreated with placeholder values for all four required env vars:
  - `SECRET_KEY=your-secret-key-here`
  - `MAIL_USERNAME=your-gmail@gmail.com`
  - `MAIL_DEFAULT_SENDER=your-gmail@gmail.com`
  - `MAIL_PASSWORD=your-gmail-app-password`
- File is committed to the repo (not gitignored) so developers have a template to copy

### CLAUDE.md
- **Contact form paragraph:** Updated to list all four env vars including `SECRET_KEY` (was missing) and reference the new Environment Variables section
- **New section added:** `## Environment Variables` with a table documenting all four required variables, their descriptions, and example values
- **Local dev instructions:** `cp .env.example .env` workflow documented
- **Docker Compose instructions:** env_file usage noted
- **GAE instructions:** app.yaml env_variables or Secret Manager guidance added
- **Deployment Notes:** Updated `gunicorn app:app` reference to `gunicorn src.main:app`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] Added gunicorn to src/requirements.txt**
- **Found during:** Task 1 — reading src/requirements.txt confirmed gunicorn was absent
- **Issue:** The Dockerfile CMD uses gunicorn but gunicorn was not in src/requirements.txt; container would fail to start with a "gunicorn: command not found" error even after the CMD fix
- **Fix:** Added `gunicorn==21.2.0` to src/requirements.txt
- **Files modified:** src/requirements.txt
- **Commit:** b50611b

## Known Stubs

None — all changes are configuration/documentation with no data flow stubs.

## Threat Surface Scan

No new network endpoints, auth paths, or schema changes introduced. All changes are configuration corrections and documentation. The .env.example file contains only placeholder values — no real credentials introduced.

## Verification Results

All plan verification checks passed:
1. `grep "src/requirements.txt" Dockerfile` — returns `COPY src/requirements.txt .`
2. `grep "src.main:app" Dockerfile` — returns the CMD line
3. `grep -c redis docker-compose.yml` — returns `0`
4. `cat .env.example` — shows all four placeholder vars
5. `grep "SECRET_KEY" CLAUDE.md` — returns multiple matches including the new section
6. `grep -v "your-" .env.example` — returns empty (no real credentials)
7. App import test: fails with `KeyError: 'SECRET_KEY'` (expected — env vars not set; confirms fail-fast behavior)

## Self-Check

### Files exist:
- Dockerfile: present
- docker-compose.yml: present
- .env.example: present
- CLAUDE.md: present
- src/requirements.txt: present

### Commits exist:
- b50611b: fix(02-02): correct Dockerfile requirements path and gunicorn module path
- b271632: fix(02-02): remove unused Redis from docker-compose and recreate .env.example
- d9fb043: docs(02-02): add Environment Variables section to CLAUDE.md
