# Resume Website - Project Context

**Project:** Personal resume/portfolio website built with Flask  
**Status:** Maintenance & improvements phase  
**Last updated:** 2026-04-10 after initialization

## What This Is

A single-file Flask application serving a personal portfolio. Displays CV, project links, and embedded dashboards. Includes a contact form that sends emails via Gmail SMTP. Deployed on Google App Engine via Docker containers.

**Core value:** Professional online presence with minimal operational overhead.

## Requirements

### Validated

- ✓ Homepage with portfolio content and social links
- ✓ CV/resume page
- ✓ Contact form with email delivery
- ✓ Embedded Tableau dashboard views
- ✓ PDF download (QC Neutrino Paper)
- ✓ Deployed to Google App Engine (production)
- ✓ Docker containerization for local dev and production

### Active

- [ ] Update Python and dependencies to current versions (3.11+, Flask 3.x)
- [ ] Move hardcoded secrets to environment variables
- [ ] Enable CSRF protection on contact form
- [ ] Remove unused dependencies
- [ ] Clean up code patterns (form handling, error handling)
- [ ] Improve code readability and maintainability
- [ ] Fix deployment issues (Dockerfile/gunicorn config, module paths)
- [ ] Remove or clarify unused infrastructure (Redis in docker-compose)

### Out of Scope

- New features (contact form improvements, analytics, database, etc.) — belong in future phases
- Large architectural refactors or service splits — keeping as monolith
- Comprehensive test suite — manual testing sufficient for this project
- UI/UX redesign — focus is code quality, not visual changes
- Migration to different framework or language

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep monolithic Flask app | Low traffic, simple content, no need for complexity | Simplify → focus on quality of existing structure |
| Manual testing only | Personal project, low risk, infrequent updates | Validate via local testing before GAE deploy |
| Update, don't refactor | Move fast, fix pain points without restructuring | Incremental improvements: deps, security, code cleanup |
| Environment variables for secrets | Basic security practice, simple to implement | Move MAIL_PASSWORD and SECRET_KEY to env |
| No test framework | Code is simple enough for manual validation | Reduces overhead, complexity stays low |

## Context

**Why now:** Old project, dependencies are stale, security practices need basic hardening, code has accumulated small quality issues.

**Who:** Personal project — you maintain it, users are infrequent, no SLA.

**Constraints:**
- Don't over-architect
- No large refactors
- Keep it simple
- No unnecessary complexity
- Manual testing is sufficient

**Success criteria:**
- Dependencies updated and working
- Hardcoded secrets gone
- Code is cleaner and more maintainable
- Deployment process is smooth
- Manual testing passes

---

*Last updated: 2026-04-10 after initialization*
