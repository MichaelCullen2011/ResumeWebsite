---
phase: 3
slug: code-quality-maintainability
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-11
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — manual testing only (project standard) |
| **Config file** | none |
| **Quick run command** | `python3 -m py_compile src/main.py && echo OK` |
| **Full suite command** | `python3 -m py_compile src/main.py && echo OK` |
| **Estimated runtime** | ~1 second |

---

## Sampling Rate

- **After every task commit:** Run `python3 -m py_compile src/main.py && echo OK`
- **After every plan wave:** Run `python3 -m py_compile src/main.py && echo OK`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | code-quality | — | N/A | compile | `python3 -m py_compile src/main.py` | ✅ | ⬜ pending |
| 3-01-02 | 01 | 1 | code-quality | — | N/A | compile | `python3 -m py_compile src/main.py` | ✅ | ⬜ pending |
| 3-01-03 | 01 | 1 | code-quality | — | N/A | compile | `python3 -m py_compile src/main.py` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework installation needed — project uses manual testing as its standard.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All routes return 200 | code-quality | No automated test suite | `python3 src/main.py` then visit `/`, `/contact`, `/cv`, `/tableau1`, `/tableau2`, `/qc_neutrino_paper` |
| Contact form validation error feedback | code-quality | Requires browser interaction | Submit empty form, verify per-field errors appear |
| Contact form success (with real credentials) | code-quality | Requires live SMTP | Submit valid form, verify email sent and confirmation shown |
| Logging output visible | code-quality | Requires running app | Trigger routes and check terminal for `logging` module output (not print) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
