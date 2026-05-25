# Phase 3: Code Quality & Maintainability - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Improve readability and organization of `src/main.py` without changing behavior. This phase covers code structure (section layout, class placement), indentation consistency, targeted comments, and manual testing of all routes.

**Already complete from Phase 2 (do not re-implement):**
- WTForms validation via `form.validate_on_submit()` — in place
- `app.logger.exception()` for email failure logging — in place
- All secrets via environment variables — in place
- CLAUDE.md is accurate and up-to-date — skip
</domain>

<decisions>
## Implementation Decisions

### Code organization
- **D-01:** Move `EmailForm` class to before the route handlers. Conventional order: imports → config → form classes → routes → entry point.
- **D-02:** Add section divider comments to make the file scannable: `# --- Configuration ---`, `# --- Forms ---`, `# --- Routes ---`, and `# --- Entry Point ---`.

### Indentation
- **D-03:** Standardize all indentation in `src/main.py` to 4-spaces (PEP 8). Current file mixes tabs and 4-spaces across functions — fix throughout.

### Comments
- **D-04:** Truly minimal comments only. Add inline comments only on the contact flow where logic is non-obvious:
  - Why `reply_to=email` is set on the outgoing message
  - What `abort(500)` is for after the mail failure
  - Nothing else — the file is short and readable without additional annotation.

### CLAUDE.md
- **D-05:** Skip — CLAUDE.md was updated in Phase 2 and is already current.

### Manual testing
- **D-06:** Manual test all routes after changes: homepage (`/`), CV (`/cv`), contact form GET and POST (success + failure), dashboards (`/tableau1`, `/tableau2`), PDF download (`/qc_neutrino_paper`).

### Claude's Discretion
- Exact wording of inline comments, as long as they are concise and non-obvious.
- Whether to add a blank line between section dividers and the first item in each section for readability.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/ROADMAP.md` — Phase 3 goal, scope, and success criteria.
- `.planning/REQUIREMENTS.md` — "Clean up form handling", "Improve code maintainability", "Add basic error handling" rows.
- `.planning/PROJECT.md` — Constraints: keep it simple, no over-engineering, manual testing is sufficient.

### Existing implementation
- `src/main.py` — The sole file being changed. Current issues: mixed indentation (tabs vs 4-spaces), `EmailForm` defined after `get_contact()`, no section dividers.

</canonical_refs>

<code_context>
## Existing Code Insights

### Current main.py structure (as of end of Phase 2)
- Lines 1-8: imports
- Lines 9-20: app init + config
- Lines 22-48: `home()` and `get_contact()` routes (tab-indented internally)
- Lines 51-55: `EmailForm` class (4-space indented) — defined AFTER the route that uses it
- Lines 57-74: remaining routes (`cv_view`, `tableau1_view`, `tableau2_view`, `paper_view`) — 4-space indented
- Lines 76-77: entry point

### Reusable assets
- `app.logger.exception()` already in use — no logging changes needed.
- `form.validate_on_submit()` already in use — no form handling changes needed.

### Integration points
- Changes are purely cosmetic/structural within `src/main.py`. No template or config changes required.
- Manual testing after changes covers all routes in `src/main.py`.
</code_context>

<specifics>
## Specific Ideas

- The refactor is purely mechanical: move class, add dividers, fix indentation, add 2-3 targeted comments.
- Do not add docstrings to functions — not requested, adds noise to a short readable file.
- Do not add type annotations — out of scope.
- Keep the diff minimal and reviewable.
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 03-code-quality-maintainability*
*Context gathered: 2026-04-11*
