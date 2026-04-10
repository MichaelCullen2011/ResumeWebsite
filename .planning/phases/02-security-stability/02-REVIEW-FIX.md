---
phase: 02-security-stability
fixed_at: 2026-04-10T00:00:00Z
review_path: .planning/phases/02-security-stability/02-REVIEW.md
iteration: 1
findings_in_scope: 6
fixed: 5
skipped: 1
status: partial
---

# Phase 02: Code Review Fix Report

**Fixed at:** 2026-04-10
**Source review:** .planning/phases/02-security-stability/02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 6 (CR-01, CR-02, WR-01, WR-02, WR-03, WR-04)
- Fixed: 5
- Skipped: 1

## Fixed Issues

### CR-01: Personal Home Address and Phone Number Hardcoded in Public Template

**Files modified:** `src/templates/contact.html`
**Commit:** f3311aa
**Applied fix:** Removed the home address block (9 Haymarket Square, Edinburgh, EH3 8RY) and the personal phone number (+44 77 15924 881) from contact.html. Retained the email address, GitHub, and LinkedIn links. Collapsed the two-column layout into a single centered block since the address column was removed.

---

### CR-02: PDF Not-Found Handler Returns HTTP 200 Instead of 404

**Files modified:** `src/main.py`
**Commit:** 8b2100b
**Applied fix:** Replaced `return "Not Found"` with `abort(404)` in the `paper_view()` except block. `abort` was already imported on line 1.

---

### WR-01: Dockerfile Copies .env Into Image (No .dockerignore)

**Files modified:** `.dockerignore` (new file)
**Commit:** acb12fe
**Applied fix:** Created `.dockerignore` at the project root excluding `.env`, `.env.*`, `.git/`, `.gitignore`, `.planning/`, `*.md`, `__pycache__/`, and `.venv/`. This prevents secrets from being baked into Docker image layers regardless of whether a developer manually excludes them.

---

### WR-02: docker-compose.yml Volume Mount Exposes .env and .git at Runtime

**Files modified:** `docker-compose.yml`
**Commit:** aa2bd9d
**Applied fix:** Changed the volume mount from `- .:/app` (full repo root) to `- ./src:/app/src` (source directory only). The `env_file: .env` directive remains and is sufficient for credential injection without exposing `.env`, `.git/`, or `.planning/` inside the container.

---

### WR-03: Contact Form Fields Bypass WTForms Field Rendering

**Files modified:** `src/templates/contact.html`
**Commit:** 1ed50d4
**Applied fix:** Replaced bare HTML `<input name="name">`, `<input name="email">`, and `<input name="message">` with `{{ form.name() }}`, `{{ form.email() }}`, and `{{ form.message() }}` WTForms field macros. Added per-field error display loops (`{% for error in form.X.errors %}`). The `message` field now renders as a `<textarea>` (matching its `TextAreaField` definition) rather than a single-line `<input type="text">`.

---

## Skipped Issues

### WR-04: .env.example Deleted from Repository

**File:** `.env.example`
**Reason:** False positive — `.env.example` already recreated by Plan 02-02. The file exists on disk at the project root (confirmed via `ls`). The git status showing ` D .env.example` reflects an unstaged deletion that was already reversed; the file is present and does not need to be recreated.
**Original issue:** `.env.example` deleted, removing onboarding reference for required environment variables.

---

_Fixed: 2026-04-10_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
