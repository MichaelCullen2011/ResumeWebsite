---
phase: 2
slug: security-stability
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual testing (no automated test framework; REQUIREMENTS.md explicitly scopes out test suites) |
| **Config file** | None |
| **Quick run command** | `cd src && python3 main.py` then manual HTTP requests |
| **Full suite command** | Manual: GET `/`, GET `/cv`, POST `/contact`, GET `/tableau1`, GET `/tableau2`, GET `/qc_neutrino_paper` |
| **Estimated runtime** | ~5 minutes |

---

## Sampling Rate

- **After every task commit:** Run `cd src && python3 main.py` to verify app starts without errors
- **After every plan wave:** Manual smoke test of all routes
- **Before `/gsd-verify-work`:** Full manual suite must pass
- **Max feedback latency:** ~5 minutes

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-secrets | 01 | 1 | SEC-01 | — | No hardcoded secrets in code | inspection | `grep -n "SECRET_KEY\s*=" src/main.py` confirms env var read | ✅ | ⬜ pending |
| 2-csrf | 01 | 1 | SEC-02 | — | CSRF token validated on POST /contact | functional | POST to /contact without CSRF token → 400 | ✅ | ⬜ pending |
| 2-mail-error | 01 | 1 | SEC-03 | — | Email failure returns HTTP 500 | functional | Configure bad SMTP creds → POST valid form → 500 | ✅ | ⬜ pending |
| 2-dockerfile | 01 | 2 | SEC-04 | — | Dockerfile starts app correctly under gunicorn | build test | `docker build && docker run -e ... && curl localhost:8080/` | ✅ | ⬜ pending |
| 2-redis | 01 | 1 | SEC-05 | — | Redis removed from docker-compose.yml | inspection | `grep redis docker-compose.yml` returns nothing | ✅ | ⬜ pending |
| 2-env-example | 01 | 1 | SEC-06 | — | .env.example present with all required vars | inspection | `cat .env.example` shows 4 placeholder vars | ❌ W0 | ⬜ pending |
| 2-gunicorn-dep | 01 | 1 | SEC-07 | — | gunicorn in src/requirements.txt | inspection | `grep gunicorn src/requirements.txt` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `.env.example` — placeholder file with `SECRET_KEY`, `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, `MAIL_PASSWORD` vars

*No automated test framework needed — REQUIREMENTS.md explicitly scopes manual testing only.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CSRF token validated on POST /contact | SEC-02 | No test framework; requires HTTP client with session | POST to /contact without token → 400; POST with valid token + form → confirmation page |
| Email failure returns 500 | SEC-03 | Requires SMTP misconfiguration at runtime | Set bad MAIL_PASSWORD, POST valid contact form, verify HTTP 500 response |
| Dockerfile starts app correctly | SEC-04 | Requires Docker daemon and port binding | `docker build -t test . && docker run -e SECRET_KEY=x -e MAIL_USERNAME=x -e MAIL_DEFAULT_SENDER=x -e MAIL_PASSWORD=x -p 8080:8080 test && curl http://localhost:8080/` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5 minutes
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
