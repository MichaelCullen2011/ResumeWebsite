# Resume Website - Roadmap

**Created:** 2026-04-10  
**Milestone:** 1.0 - Maintenance & Improvements  
**Status:** Ready for planning

---

## Phase 1: Dependency & Runtime Updates

**Goal:** Upgrade Python runtime and all dependencies to current versions, ensuring compatibility and security.

**Scope:**
- Update Python from 3.9 to 3.11+
- Update all dependencies in `src/requirements.txt` to latest stable versions compatible with Python 3.11
- Remove unused dependencies (beautifulsoup4, google, python-dateutil)
- Update Dockerfile and app.yaml to reflect Python 3.11+
- Verify app runs without warnings or errors

**Success Criteria:**
- Python version is 3.11+ across Dockerfile, app.yaml, and local dev
- All dependencies updated to latest stable versions
- App runs locally without errors or deprecation warnings
- All table stakes features still work (homepage, CV, contact form, dashboards, PDF, deployment)

**Canonical refs:**
- `REQUIREMENTS.md` — Table Stakes and "Update Python runtime" / "Update all dependencies" / "Remove unused dependencies" rows

---

## Phase 2: Security & Stability

**Goal:** Harden security, enable CSRF protection, improve error handling, and fix deployment issues.

**Scope:**
- Move `MAIL_PASSWORD` and `SECRET_KEY` from hardcoded values to environment variables
- Enable CSRF protection on contact form (add `{{ form.hidden_tag() }}` to template, validate in handler)
- Add basic error handling for email send failures
- Fix Dockerfile module path and gunicorn configuration
- Update deployment documentation (CLAUDE.md) with env var setup
- Remove or clarify Redis usage in docker-compose.yml

**Success Criteria:**
- No hardcoded secrets in code (all from environment)
- Contact form CSRF token is generated and validated
- Email send failures return proper error responses (not unhandled exceptions)
- Dockerfile correctly invokes the Flask app via gunicorn
- docker-compose.yml either removes Redis with explanation or documents its purpose
- Deployment steps documented and tested locally

**Canonical refs:**
- `REQUIREMENTS.md` — "Move secrets to environment variables", "Enable CSRF protection", "Add basic error handling", "Fix deployment issues", "Clarify or remove Redis"

---

## Phase 3: Code Quality & Maintainability

**Goal:** Improve code readability, form handling, logging, and overall maintainability.

**Scope:**
- Refactor contact form handler to use WTForms validation (not raw `request.form`)
- Improve logging (use Python `logging` module instead of `print()`)
- Clean up main.py organization (imports, config, routes, entry point in logical order)
- Add comments where logic is non-obvious
- Ensure CLAUDE.md is accurate and up-to-date
- Manual testing of all routes and contact form

**Success Criteria:**
- Contact form uses WTForms validation with proper error feedback
- All logging via `logging` module, not `print()`
- Code is organized logically and readable
- CLAUDE.md reflects current architecture and deployment process
- Manual testing passes: homepage, CV, contact form (success and error cases), dashboards, PDF, deployment

**Canonical refs:**
- `REQUIREMENTS.md` — "Clean up form handling", "Add basic error handling", "Improve code maintainability"

---

## Deferred (Out of Scope)

- Test suite (manual testing sufficient for this project)
- UI/UX redesign
- New features (backlog)
- Database or persistence
- Authentication/authorization
- Analytics or monitoring

---

*Roadmap created: 2026-04-10*  
*Milestone: 1.0 - Maintenance & Improvements*
