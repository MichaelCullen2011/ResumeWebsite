# Phase 2: Security & Stability - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 02-security-stability
**Areas discussed:** Contact failures, Container cleanup, Security posture, Secrets setup

---

## Contact failures

| Option | Description | Selected |
|--------|-------------|----------|
| Inline error | Stay on the contact page and show a visible error message above the form saying the email could not be sent. | |
| Failure page | Render a separate failure page with a retry message. | |
| Generic 500 | Return a plain server error response and let Flask handle the page. | ✓ |

**User's choice:** Generic 500
**Notes:** User wants the app to return a generic 500 if email sending fails.

---

## Container cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Fix Dockerfile | Ensure the container starts the actual Flask app correctly under Gunicorn. | ✓ |
| Remove Redis | Remove Redis from docker-compose if it is not used by the app. | ✓ |
| Keep config minimal | Keep local dev and deployment setup minimal and understandable. | ✓ |

**User's choice:** Fix Dockerfile, remove unused Redis, keep setup minimal.
**Notes:** User asked for direction, then confirmed this direction works.

---

## Security posture

| Option | Description | Selected |
|--------|-------------|----------|
| Phase-only hardening | Only do the scoped fixes: env-based secrets, working CSRF, generic 500 on mail failure, and container/deploy cleanup. | |
| Small extras | Do the scoped fixes plus a few low-effort hardening tweaks if they naturally fit, without turning this into a larger refactor. | ✓ |
| Maximum within scope | Push security/stability as far as possible within the current app structure, even if it adds a bit more implementation work. | |

**User's choice:** Small extras
**Notes:** User wants a modest amount of additional hardening if it fits naturally.

---

## Secrets setup

| Option | Description | Selected |
|--------|-------------|----------|
| Env vars + .env | Use environment variables everywhere, with `.env` for local development and documented required vars for deployment. | ✓ |
| Env vars only | Use environment variables everywhere, but do not rely on `.env` locally. | |
| Claude decides | Let planning pick the simplest secure setup based on the current repo. | |

**User's choice:** Env vars + .env
**Notes:** User wants local development to use `.env` while deployment remains environment-variable based.

---

## Claude's Discretion

- Exact implementation details for environment variable loading and documentation updates.
- Any small extra hardening improvements that fit naturally within Phase 2.
- Exact structure of the mail-failure 500 path.

## Deferred Ideas

None.
