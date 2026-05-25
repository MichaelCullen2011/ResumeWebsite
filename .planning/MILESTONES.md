# Milestones

## v1.0 Maintenance & Improvements (Shipped: 2026-04-11)

**Phases completed:** 3 phases, 3 plans
**Timeline:** 2026-04-10 → 2026-04-11 (2 days)
**Files changed:** 34 | Lines added: 3,831

**Key accomplishments:**

- Python 3.12 + all dependencies updated to latest stable; unused packages removed
- CSRF bypass fixed — input name capitalization corrected, form now validates server-side
- Email send failures handled gracefully with abort(500) — no unhandled exceptions
- Dockerfile gunicorn module path fixed; Redis removed from docker-compose; `.env.example` created
- `src/main.py` restructured: 4-space indent, EmailForm before routes, section dividers, inline comments
- Environment variable setup documented in CLAUDE.md

---
