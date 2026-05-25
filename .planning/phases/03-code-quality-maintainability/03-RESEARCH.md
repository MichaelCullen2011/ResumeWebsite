# Phase 3: Code Quality & Maintainability - Research

**Researched:** 2026-04-11
**Domain:** Python / Flask code organization, PEP 8 indentation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Move `EmailForm` class to before the route handlers. Conventional order: imports → config → form classes → routes → entry point.
- **D-02:** Add section divider comments: `# --- Configuration ---`, `# --- Forms ---`, `# --- Routes ---`, and `# --- Entry Point ---`.
- **D-03:** Standardize all indentation in `src/main.py` to 4-spaces (PEP 8). Current file mixes tabs and 4-spaces — fix throughout.
- **D-04:** Truly minimal comments only. Add inline comments only on the contact flow where logic is non-obvious: why `reply_to=email` is set, what `abort(500)` is for after mail failure. Nothing else.
- **D-05:** Skip CLAUDE.md — updated in Phase 2 and already current.
- **D-06:** Manual test all routes after changes: homepage (`/`), CV (`/cv`), contact form GET and POST (success + failure), dashboards (`/tableau1`, `/tableau2`), PDF download (`/qc_neutrino_paper`).

### Already Complete (do not re-implement)
- WTForms validation via `form.validate_on_submit()` — in place
- `app.logger.exception()` for email failure logging — in place
- All secrets via environment variables — in place
- CLAUDE.md is accurate and up-to-date

### Claude's Discretion
- Exact wording of inline comments, as long as they are concise and non-obvious.
- Whether to add a blank line between section dividers and the first item in each section for readability.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 3 is a purely mechanical refactor of `src/main.py` (77 lines). No new dependencies, no behavioral changes. The work is:

1. Fix mixed indentation — 24 lines currently use hard tabs; `home()` and `get_contact()` are tab-indented, `paper_view()` body is also tab-indented; all other functions use 4-spaces. Replace every tab with 4-spaces throughout.
2. Move `EmailForm` class (lines 51-55) to before the first route, so the conventional Python module order is maintained (imports → config → classes → routes → entry point).
3. Add four section-divider comments.
4. Add two targeted inline comments in the contact handler.

All other Phase 3 goals (WTForms validation, `app.logger`, env vars) are already implemented. The only remaining work is cosmetic/structural.

**Primary recommendation:** Edit `src/main.py` in a single pass — fix indentation, reorder the class, add dividers and two comments. Keep the diff minimal and review it for correctness before manual-testing.

---

## Project Constraints (from CLAUDE.md)

| Directive | Constraint |
|-----------|------------|
| Single-file architecture | All routes and `EmailForm` live in `src/main.py` — no blueprints, no new modules |
| Run app | `cd src && python3 main.py` (port 8080) or docker-compose |
| Dependencies | `src/requirements.txt` — do not add new packages for this phase |
| CLAUDE.md | Already up-to-date — skip |
| `.dockerignore` | Do not remove or modify |

---

## Standard Stack

No new libraries required. The existing stack is sufficient.

| Library | In Use | Purpose |
|---------|--------|---------|
| Flask | Yes | Routing, request handling, templating |
| Flask-WTF | Yes | CSRF-protected forms |
| WTForms | Yes | Form field definitions and validation |
| Flask-Mail | Yes | SMTP email sending |
| python-dotenv | Yes | `.env` loading in dev |

**No installation needed for this phase.** [VERIFIED: src/main.py imports confirm all libraries present]

---

## Architecture Patterns

### Target module order (PEP 8 / Flask convention)
```
# Imports
# --- Configuration ---
# --- Forms ---
# --- Routes ---
# --- Entry Point ---
```

This order is standard for single-file Flask apps: imports and app setup at the top, form classes before the routes that reference them, routes in the middle, `if __name__ == "__main__"` at the bottom. [ASSUMED — well-established Python convention, not requiring external verification for a 77-line file]

### Current vs target structure

| Block | Current lines | Current indentation | Target position |
|-------|--------------|--------------------|----|
| Imports (lines 1-8) | 1-8 | n/a | Keep in place |
| App init + config (lines 9-20) | 9-20 | n/a | Keep — add `# --- Configuration ---` divider above |
| `home()` route (lines 22-24) | 22-24 | **tabs** | Move after `EmailForm` — add `# --- Routes ---` divider above |
| `get_contact()` route (lines 27-48) | 27-48 | **tabs (body)** | Keep in routes section — add two inline comments |
| `EmailForm` class (lines 51-55) | 51-55 | 4-spaces | Move UP to before `home()` — add `# --- Forms ---` divider above |
| Remaining routes (lines 57-74) | 57-74 | 4-spaces (body) / tabs (`paper_view` body) | Keep in routes section |
| Entry point (lines 76-77) | 76-77 | n/a | Keep — add `# --- Entry Point ---` divider above |

### Indentation audit [VERIFIED: python3 character scan, 2026-04-11]

Lines containing hard tabs (to be replaced with 4-spaces each):
- Line 24: `home()` body
- Lines 29-48: `get_contact()` body (single and double tabs — normalize to 4 and 8 spaces respectively)
- Lines 71-74: `paper_view()` body

All other function bodies are already 4-space indented.

### Inline comments to add (D-04)

Two comments in the `get_contact()` handler:

```python
# reply_to lets the site owner reply directly to the sender's address
reply_to=email

# abort(500) prevents returning a blank page on mail failure
abort(500)
```

Exact wording is Claude's discretion; the above is illustrative. [ASSUMED — wording not decided; must be concise and non-obvious]

### Anti-patterns to avoid
- **Docstrings on every function:** Not requested, adds noise to a short file (D-04 and SPECIFICS section of CONTEXT.md explicitly prohibit this).
- **Type annotations:** Out of scope per CONTEXT.md.
- **Blank lines between every statement:** Only add blank line between section divider and first item if it aids readability (Claude's discretion).
- **Rewriting logic:** No behavioral changes — pure structural edit.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Indentation fix | Custom script | Direct text edit in file — 24 lines, straightforward |
| Tab-to-space conversion | Shell `expand` or `sed` | Edit tool with precise line-by-line replacement — avoids accidental changes |

---

## Common Pitfalls

### Pitfall 1: Incomplete tab replacement
**What goes wrong:** A find-and-replace of `\t` converts leading tabs but also hits any tab characters inside string literals (there are none here, but worth verifying).
**Why it happens:** Global replace is too broad.
**How to avoid:** Replace indentation tabs only at line start; verify no string literals contain tab characters.
**Warning signs:** `SyntaxError` or `IndentationError` after edit.

### Pitfall 2: Mixed indentation after partial fix
**What goes wrong:** Fixing some lines but missing others leaves Python's indentation parser confused — a `TabError` at runtime.
**Why it happens:** Manual edits miss a nested block.
**How to avoid:** After editing, run `python3 -m py_compile src/main.py` to confirm zero syntax errors before manual testing.
**Warning signs:** `TabError: inconsistent use of tabs and spaces in indentation`.

### Pitfall 3: EmailForm forward-reference breaks
**What goes wrong:** After moving `EmailForm` above the routes, a developer worries that something depended on the old order.
**Why it happens:** Flask registers routes at import time via `@app.route`, but Python evaluates `EmailForm()` inside `get_contact()` at call time — so the class just needs to be defined before the function is *called*, not before it is *defined*. Moving it higher is safe.
**How to avoid:** Understand that `get_contact()` references `EmailForm` inside the function body, not at decoration time — there is no forward-reference risk.
**Warning signs:** `NameError: name 'EmailForm' is not defined` (would only happen if the class were removed or misspelled).

### Pitfall 4: Section dividers with wrong syntax
**What goes wrong:** Using `#--- Configuration ---` (no spaces) or `## --- Section ---` (double hash) inconsistently.
**How to avoid:** Use exactly `# --- Section Name ---` with spaces around the dashes, as decided in D-02.

---

## Code Examples

### Target file structure (after refactor)

```python
# Source: D-01 and D-02 from 03-CONTEXT.md
from flask import Flask, abort, render_template, request, send_from_directory
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email, Length
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

load_dotenv()

# --- Configuration ---
app = Flask(__name__, static_url_path="/static")
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
# ... remaining config ...
mail = Mail(app)


# --- Forms ---
class EmailForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=100)])
    email = StringField("Email", validators=[DataRequired(), Email(), Length(max=200)])
    message = TextAreaField("Message", validators=[DataRequired(), Length(max=5000)])
    submit = SubmitField("Send")


# --- Routes ---
@app.route('/')
def home():
    return render_template("homepage.html")


@app.route('/contact', methods=["GET", "POST"])
def get_contact():
    form = EmailForm()
    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        message = form.message.data
        subject = f"{name} sent a message via the contact form"
        msg = Message(
            subject,
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=['michaelcullen2011@hotmail.co.uk'],
            reply_to=email  # lets the site owner reply directly to the sender
        )
        msg.body = message
        try:
            mail.send(msg)
        except Exception:
            app.logger.exception("Failed to send contact email")
            abort(500)  # prevents returning a blank page on mail failure
        return render_template('contact_sent.html', form=form)
    return render_template('contact.html', form=form)


# ... remaining routes ...

# --- Entry Point ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
```

### Verify no syntax errors after edit
```bash
cd /path/to/repo
python3 -m py_compile src/main.py && echo "OK"
```

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual (no automated test suite — project decision per REQUIREMENTS.md and ROADMAP.md) |
| Config file | None |
| Quick run command | `cd src && python3 main.py` then manually visit each route |
| Full suite command | Same — manual testing is the full suite for this project |

`nyquist_validation` is enabled in config.json, but the project explicitly defers a test suite to out-of-scope ("Test suite (manual testing sufficient for this project)" in ROADMAP.md Deferred section). There are no existing test files to run.

### Phase Requirements to Test Map

| Behavior | Test Type | How to Verify | Automated? |
|----------|-----------|---------------|-----------|
| App starts without error after refactor | smoke | `python3 -m py_compile src/main.py` | Yes (compile check) |
| Homepage loads | manual | GET `http://localhost:8080/` | No |
| CV page loads | manual | GET `http://localhost:8080/cv` | No |
| Contact form GET renders | manual | GET `http://localhost:8080/contact` | No |
| Contact form POST success | manual | Submit valid form data | No |
| Contact form POST validation failure | manual | Submit blank fields, observe per-field errors | No |
| Dashboards load | manual | GET `/tableau1` and `/tableau2` | No |
| PDF download | manual | GET `/qc_neutrino_paper` | No |

### Sampling Rate
- **After edit:** Run `python3 -m py_compile src/main.py` (automated, < 1 second)
- **Phase gate:** Manual walkthrough of all 8 routes above before marking phase complete

### Wave 0 Gaps
No test files to create — manual testing is the project standard. The compile check (`py_compile`) requires no setup.

---

## Security Domain

This phase makes no security-relevant changes. All security hardening (CSRF, secrets, error handling) was completed in Phase 2. No ASVS categories are newly implicated by cosmetic code reorganization.

---

## Environment Availability

Step 2.6: No new external dependencies introduced by this phase. Python 3.12 is already confirmed present (Phase 1). No additional tools required.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python 3.12 | `py_compile` syntax check | Confirmed (Phase 1) | 3.12 | — |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Conventional Flask module order is imports → config → classes → routes → entry point | Architecture Patterns | Planner might second-guess ordering; risk is negligible for a 77-line file |
| A2 | Exact wording of inline comments | Code Examples | Wording shown is illustrative; implementer has discretion per D-04 |

---

## Open Questions

None — the phase is fully constrained by CONTEXT.md decisions. All implementation choices are either locked or explicitly delegated to Claude's discretion (comment wording, optional blank line after dividers).

---

## Sources

### Primary (HIGH confidence)
- `src/main.py` — Direct file read and character-level tab audit [VERIFIED: 2026-04-11]
- `.planning/phases/03-code-quality-maintainability/03-CONTEXT.md` — All locked decisions [VERIFIED: 2026-04-11]
- `.planning/config.json` — Workflow settings (nyquist_validation: true, commit_docs: true) [VERIFIED: 2026-04-11]

### Tertiary (LOW confidence)
- A1: Conventional Python module ordering — [ASSUMED] based on PEP 8 and common Flask practice

---

## Metadata

**Confidence breakdown:**
- What needs doing: HIGH — direct code inspection, all decisions locked
- Architecture patterns: HIGH — simple reorder with no ambiguity
- Pitfalls: HIGH — derived from direct observation of the actual file

**Research date:** 2026-04-11
**Valid until:** Stable indefinitely (no external dependencies, no version drift risk)
