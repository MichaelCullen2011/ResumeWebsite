# Phase 2: Security & Stability - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Harden the existing Flask app’s security and stability without changing product scope. This phase covers secret handling, CSRF enforcement, basic email failure behavior, container/deployment cleanup, and clarifying unused local infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Secrets setup
- **D-01:** Use environment variables for all runtime secrets and mail credentials.
- **D-02:** Use a local `.env` file for development and document the required environment variables for deployment.
- **D-03:** Keep the solution simple and aligned with the existing single-app Flask setup rather than introducing a new secret-management layer.

### Contact failure behavior
- **D-04:** If SMTP email sending fails, return a generic HTTP 500 response rather than a custom inline error or dedicated failure page.

### Container and deployment cleanup
- **D-05:** Fix the Dockerfile so the container starts the actual Flask app correctly under Gunicorn.
- **D-06:** Remove Redis from `docker-compose.yml` if it is unused by the application.
- **D-07:** Keep local development and deployment configuration minimal and easy to understand.

### Security posture
- **D-08:** Complete the scoped security/stability fixes from the roadmap and requirements.
- **D-09:** Allow small, natural hardening extras if they fit cleanly into the phase without turning into a larger refactor.

### Claude's Discretion
- Exact implementation of environment variable loading between local dev and deployed environments.
- Any small extra hardening improvements that naturally fit this phase and do not expand scope.
- Exact server-side structure for the generic 500 mail-failure path.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/ROADMAP.md` — Phase 2 goal, scope, success criteria, and canonical references.
- `.planning/REQUIREMENTS.md` — "Move secrets to environment variables", "Enable CSRF protection", "Add basic error handling", "Fix deployment issues", and "Clarify or remove Redis" requirements.
- `.planning/PROJECT.md` — Project constraints: keep it simple, avoid over-architecture, and prefer incremental improvements.

### Existing implementation
- `src/main.py` — Current Flask config, contact form handler, mail sending flow, and route structure.
- `src/templates/contact.html` — Current contact form markup and CSRF hidden tag usage.
- `Dockerfile` — Current container startup and Gunicorn entry point.
- `docker-compose.yml` — Current local stack, including Redis.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `EmailForm` in `src/main.py` already provides WTForms fields and validation hooks for the contact flow.
- `form.hidden_tag()` is already present in `src/templates/contact.html`, so CSRF template support exists and needs to align with server-side handling.
- `load_dotenv()` is already called in `src/main.py`, which supports the chosen `.env`-based local development flow.

### Established Patterns
- The app is a single-file Flask application with configuration and routes centered in `src/main.py`.
- Mail delivery uses Flask-Mail with app config values sourced from environment variables.
- The current contact POST path renders `contact_sent.html` on success and has no explicit exception handling around `mail.send()`.
- Container and deployment config are kept in top-level `Dockerfile` and `docker-compose.yml`, with App Engine config in `src/app.yaml`.

### Integration Points
- Secret handling changes will center on Flask configuration in `src/main.py` and deployment documentation.
- CSRF and mail-failure behavior will affect the `/contact` route and the `contact.html` template.
- Runtime startup fixes will affect the `Dockerfile` entry point and potentially related deployment docs.
- Redis clarification/removal will affect `docker-compose.yml` only.

</code_context>

<specifics>
## Specific Ideas

- Keep the security/stability work practical and low-complexity.
- Favor minimal, understandable deployment and local-development configuration.
- Use a generic 500 response for email send failures instead of designing custom user-facing failure UX in this phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-security-stability*
*Context gathered: 2026-04-10*
