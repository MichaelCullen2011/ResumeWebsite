# Resume Website - Requirements

**Last updated:** 2026-04-10 after initialization  
**Status:** Active requirements ready for planning

## Table Stakes (Existing Features)

These are validated capabilities the app already delivers. Must remain working after improvements.

| Requirement | Status | Acceptance Criteria | Notes |
|---|---|---|---|
| **Homepage delivery** | ✓ Validated | GET `/` returns HTML with portfolio, projects, social links | Rendered via Jinja2; content embedded in templates |
| **CV/Resume page** | ✓ Validated | GET `/cv` returns formatted resume/CV page | Static HTML rendered |
| **Contact form submission** | ✓ Validated | POST `/contact` with Name, Email, Message sends email via SMTP, returns confirmation | Uses Flask-Mail to Gmail; form currently has basic HTML validation only |
| **Embedded dashboards** | ✓ Validated | GET `/tableau1` and `/tableau2` return pages with embedded Tableau iframes | Static HTML pages |
| **PDF download** | ✓ Validated | GET `/qc_neutrino_paper` serves `QC_Paper.pdf` from static directory | Uses Flask `send_from_directory` |
| **Docker containerization** | ✓ Validated | Application runs in Docker container, accessible on port 8080 | Single-stage Dockerfile; docker-compose.yml for dev |
| **Google App Engine deployment** | ✓ Validated | Application deploys to GAE via `gcloud app deploy` | Configured in `src/app.yaml` with Python 3.9 runtime |

## Active Improvements

These are changes to implement. All must be completed in scope.

| Requirement | Priority | Acceptance Criteria | Rationale |
|---|---|---|---|
| **Update Python runtime to 3.11+** | High | Python updated from 3.9 to 3.11+; Dockerfile and app.yaml reflect new version; all tests pass locally | Current 3.9 is old; 3.11+ is supported and secure |
| **Update all dependencies to latest stable** | High | All packages in `src/requirements.txt` updated to latest stable versions compatible with Python 3.11+; app runs without warnings or errors | Old dependencies may have security issues or bugs |
| **Move secrets to environment variables** | High | MAIL_PASSWORD and SECRET_KEY read from env vars, not hardcoded in `src/main.py`; Dockerfile and deployment docs updated; local dev uses `.env` file or explicit env export | Basic security practice; prevents credential exposure in git |
| **Enable CSRF protection on contact form** | High | Contact form includes `{{ form.hidden_tag() }}` in `contact.html`; POST handler validates CSRF token via WTForms | Currently form declares CSRF but doesn't enforce it |
| **Remove unused dependencies** | Medium | Unused packages (beautifulsoup4, google, python-dateutil) removed from requirements unless actively needed; app still runs | Reduce attack surface and clutter |
| **Clarify or remove Redis from docker-compose** | Medium | If Redis not used, remove from docker-compose.yml with comment explaining why it was there; if used, document its purpose | Currently present but unused; creates confusion |
| **Clean up form handling** | Medium | Contact form uses WTForms validation (not raw `request.form`); error responses are proper HTTP responses, not silent failures | Current approach bypasses WTForms; no validation server-side |
| **Add basic error handling** | Medium | Email send failures return proper error response (not unhandled exception); 404 pages are consistent; logging via proper logger, not `print()` | Unhandled exceptions on mail failure; minimal error UX |
| **Improve code maintainability** | Medium | Code is readable with clear comments where logic is non-obvious; main.py is organized logically (imports, config, routes, entry point); CLAUDE.md updated | Existing code is well-structured but can be cleaner |
| **Fix deployment issues** | Medium | Dockerfile module path (`FLASK_APP` and `gunicorn app:app`) is consistent; deployment process is smooth and documented | Module path mismatch in Dockerfile |

## Scope Boundaries

### In Scope
- Dependency updates and compatibility fixes
- Security hardening (secrets, CSRF)
- Code quality improvements (readability, organization, error handling)
- Deployment and configuration cleanup
- Manual testing via local dev server and GAE

### Out of Scope
- New features or capabilities (features belong in backlog)
- Architectural changes or service splits
- Comprehensive test suite (manual testing sufficient)
- UI/UX redesign or visual changes
- Database or data persistence
- Authentication/authorization
- Analytics or monitoring

---

*Requirements created: 2026-04-10*
