---
phase: 03-code-quality-maintainability
plan: "01"
subsystem: src/main.py
tags: [refactor, code-quality, indentation, structure]
dependency_graph:
  requires: []
  provides: [clean-src-main-py]
  affects: []
tech_stack:
  added: []
  patterns: [section-dividers, pep8-indentation, conventional-module-order]
key_files:
  created: []
  modified:
    - src/main.py
decisions:
  - "D-01: Move EmailForm before route handlers for conventional Python module order"
  - "D-02: Add four section dividers (Configuration, Forms, Routes, Entry Point)"
  - "D-03: Standardize all indentation to 4-spaces (zero tabs)"
  - "D-04: Add two targeted inline comments only — reply_to and abort(500) in get_contact()"
metrics:
  duration: "< 5 minutes"
  completed: 2026-04-11T07:54:28Z
  tasks_completed: 1
  tasks_total: 2
  files_modified: 1
---

# Phase 3 Plan 1: Refactor src/main.py Structure and Indentation Summary

**One-liner:** Mechanical refactor of src/main.py — EmailForm moved before routes, tabs replaced with 4-spaces throughout, four section dividers added, two inline comments added in get_contact().

## What Was Built

src/main.py was refactored in a single pass implementing all four locked decisions from 03-CONTEXT.md:

- **D-01 (Module order):** `EmailForm` class moved from line 51 to line 25 — now appears before the first `@app.route` decorator, following conventional Python module order (imports → config → forms → routes → entry point).
- **D-02 (Section dividers):** Four `# --- Name ---` dividers inserted: `Configuration` above `app = Flask(...)`, `Forms` above `class EmailForm`, `Routes` above `@app.route('/')`, `Entry Point` above `if __name__ == "__main__":`.
- **D-03 (Indentation):** All tab characters replaced with 4-spaces. Affected: `home()` body (1 line), `get_contact()` body (lines 29-48, including double-tab nesting), `paper_view()` body (4 lines). Zero tab characters remain.
- **D-04 (Inline comments):** Two comments added in `get_contact()`: `reply_to=email  # lets the site owner reply directly to the sender` and `abort(500)  # prevents returning a blank page on mail failure`.

No logic, routes, template names, config keys, or imports were changed. No docstrings or type annotations were added.

## Automated Verification Results

| Check | Result |
|-------|--------|
| `python3 -m py_compile src/main.py` | OK |
| AST parse | OK |
| Tab characters in file | 0 |
| `# --- Configuration ---` count | 1 |
| `# --- Forms ---` count | 1 |
| `# --- Routes ---` count | 1 |
| `# --- Entry Point ---` count | 1 |
| EmailForm line < first @app.route line | 25 < 33 — OK |
| `reply_to=email` has inline comment | Yes |
| `abort(500)` has inline comment | Yes |
| Route function count | 6 (all intact) |

## Task Commits

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Refactor src/main.py — reorder, fix indentation, add dividers and comments | 87830d1 |

## Pending

| Task | Status |
|------|--------|
| Task 2: Manual test all routes | Awaiting human-verify checkpoint |

## Deviations from Plan

None — plan executed exactly as written. All four decisions implemented in a single-pass rewrite.

## Known Stubs

None — no placeholder data, hardcoded empty values, or stub patterns introduced.

## Threat Flags

None — purely structural refactor with no new network endpoints, auth paths, file access patterns, or schema changes.

## Self-Check: PASSED

- src/main.py: exists and compiles clean
- Commit 87830d1: exists (git rev-parse confirms)
- Zero tabs: confirmed via grep
- All 4 section dividers: confirmed count=1 each
- EmailForm before routes: line 25 < line 33
