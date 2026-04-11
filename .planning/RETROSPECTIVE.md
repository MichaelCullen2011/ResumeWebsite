# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Maintenance & Improvements

**Shipped:** 2026-04-11
**Phases:** 3 | **Plans:** 3 | **Timeline:** 2 days

### What Was Built
- Python 3.12 runtime + all dependencies updated to latest stable; unused packages removed
- CSRF protection enabled on contact form (fixed capitalized input name bug)
- Email failure handling added (`abort(500)` on SMTP error, no unhandled exceptions)
- Dockerfile gunicorn path fixed, Redis removed, `.env.example` created, CLAUDE.md updated
- `src/main.py` restructured: 4-space indent throughout, EmailForm before routes, section dividers, targeted inline comments

### What Worked
- GSD wave-based execution caught the CSRF capitalization bug that was hiding behind a passing form render
- Human-verify checkpoint for Phase 3 caught the `python-dotenv` missing-from-image issue early (Docker rebuild needed)
- Parallel executor agents for Phase 2 (two plans simultaneously) saved time with no merge conflicts
- YOLO mode with budget model profile kept overhead low for a straightforward maintenance pass
- The `py_compile` + tab-count automated checks in Phase 3 gave fast confidence before human verification

### What Was Inefficient
- Phase 1 (dependency updates) was done pre-GSD without planning artifacts — no SUMMARY.md, so gsd-tools counted it as 0 plans which skewed stats
- Duplicate SUMMARY.md write caused a worktree merge conflict in Phase 3 — the "approved" continuation agent wrote to main while the worktree had its own version; resolved manually
- The `one_liner` extraction from SUMMARY.md files failed (format mismatch) — MILESTONES.md needed manual correction after `milestone complete`

### Patterns Established
- Section dividers (`# --- Name ---`) in single-file Flask apps make structure scannable without docstrings
- `.env.example` committed with placeholders gives developers a setup template with zero friction
- For Docker volume-mount dev: only mount `src/` — changes outside require a rebuild

### Key Lessons
1. **Parallel worktree agents should not also update shared planning files** — the orchestrator owns STATE.md and ROADMAP.md writes after merge; executor agents skipping those updates prevents last-merge-wins corruption
2. **Human-verify checkpoints are worth the pause** — the Docker `python-dotenv` issue and SMTP auth error were both surfaced during the Phase 3 checkpoint, not after a full deploy
3. **Pre-GSD phases need a stub SUMMARY.md** — even a one-liner prevents tooling gaps in stats and traceability

### Cost Observations
- Model mix: sonnet (executors + orchestrators), haiku (verifiers)
- Notable: budget profile was appropriate — all tasks were well-scoped and mechanical; no complex reasoning required

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 3 | 3 | First GSD milestone — baseline established |

### Top Lessons (Verified Across Milestones)

1. Orchestrator owns shared artifact writes (STATE.md, ROADMAP.md) — never delegate to parallel agents
2. Human-verify checkpoints surface environment issues that automated checks miss
