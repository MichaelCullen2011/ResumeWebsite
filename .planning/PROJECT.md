# Resume Website - Project Context

**Project:** Personal resume/portfolio website built with Flask
**Status:** v1.0 shipped — planning next milestone
**Last updated:** 2026-04-11 after v1.0 milestone

## What This Is

A single-file Flask application serving a personal portfolio. Displays CV, project links, and embedded Tableau dashboards. Includes a contact form that sends emails via Gmail SMTP. Deployed on Google App Engine via Docker containers.

**Core value:** Professional online presence with minimal operational overhead.

## Requirements

### Validated

- ✓ Homepage with portfolio content and social links — v1.0
- ✓ CV/resume page — v1.0
- ✓ Contact form with email delivery — v1.0
- ✓ Embedded Tableau dashboard views — v1.0
- ✓ PDF download (QC Neutrino Paper) — v1.0
- ✓ Deployed to Google App Engine (production) — v1.0
- ✓ Docker containerization for local dev and production — v1.0
- ✓ Python 3.12 + all dependencies updated to latest stable — v1.0
- ✓ Secrets (MAIL_PASSWORD, SECRET_KEY) read from environment variables — v1.0
- ✓ CSRF protection on contact form — v1.0
- ✓ Unused dependencies removed (beautifulsoup4, google, python-dateutil) — v1.0
- ✓ Email send failures handled gracefully — v1.0
- ✓ Dockerfile and gunicorn configuration fixed — v1.0
- ✓ Redis removed from docker-compose — v1.0
- ✓ Code organization cleaned up (indentation, structure, comments) — v1.0

### Active

(None — all v1.0 requirements delivered. Add next milestone requirements here.)

### Out of Scope

- New features (contact form improvements, analytics, database, etc.) — belong in future milestones
- Large architectural refactors or service splits — keeping as monolith
- Comprehensive test suite — manual testing sufficient for this project
- UI/UX redesign — focus is code quality, not visual changes
- Migration to different framework or language

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep monolithic Flask app | Low traffic, simple content, no need for complexity | ✓ Good — structure stayed simple throughout v1.0 |
| Manual testing only | Personal project, low risk, infrequent updates | ✓ Good — UAT passed all routes cleanly |
| Update, don't refactor | Move fast, fix pain points without restructuring | ✓ Good — incremental changes shipped without disruption |
| Environment variables for secrets | Basic security practice, simple to implement | ✓ Good — fail-fast KeyError on startup if missing |
| No test framework | Code is simple enough for manual validation | ✓ Good — overhead stayed low |
| WTForms macros for form rendering | Consistent field rendering, built-in CSRF | ✓ Good — fixed CSRF bypass from capitalized input names |
| `src.main:app` as gunicorn module path | WORKDIR=/app, app at src/main.py, src/__init__.py makes src a package | ✓ Good — Docker now starts correctly |
| Section dividers in main.py | Makes file scannable without docstrings | ✓ Good — clean structure with minimal overhead |

## Context

**Current state:** v1.0 shipped. Flask app is clean, secure, and well-structured.
- 84 LOC in `src/main.py`, 13 packages in `src/requirements.txt`
- Python 3.12, Flask 3.0, gunicorn 21.2.0
- All security basics in place (CSRF, env secrets, error handling)
- Docker works, GAE deployment documented

**Who:** Personal project — you maintain it, users are infrequent, no SLA.

**Constraints:**
- Don't over-architect
- No large refactors
- Keep it simple
- Manual testing is sufficient

---

*Last updated: 2026-04-11 after v1.0 milestone*
