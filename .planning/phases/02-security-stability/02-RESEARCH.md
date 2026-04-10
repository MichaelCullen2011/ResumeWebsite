# Phase 2: Security & Stability - Research

**Researched:** 2026-04-10
**Domain:** Flask security hardening, CSRF, error handling, Docker/Gunicorn config
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use environment variables for all runtime secrets and mail credentials.
- **D-02:** Use a local `.env` file for development and document the required environment variables for deployment.
- **D-03:** Keep the solution simple and aligned with the existing single-app Flask setup rather than introducing a new secret-management layer.
- **D-04:** If SMTP email sending fails, return a generic HTTP 500 response rather than a custom inline error or dedicated failure page.
- **D-05:** Fix the Dockerfile so the container starts the actual Flask app correctly under Gunicorn.
- **D-06:** Remove Redis from `docker-compose.yml` if it is unused by the application.
- **D-07:** Keep local development and deployment configuration minimal and easy to understand.
- **D-08:** Complete the scoped security/stability fixes from the roadmap and requirements.
- **D-09:** Allow small, natural hardening extras if they fit cleanly into the phase without turning into a larger refactor.

### Claude's Discretion
- Exact implementation of environment variable loading between local dev and deployed environments.
- Any small extra hardening improvements that naturally fit this phase and do not expand scope.
- Exact server-side structure for the generic 500 mail-failure path.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

The codebase audit reveals that several Phase 2 items are further along than the roadmap implies, while others have subtle bugs that must be addressed. Secret handling is already correct in `src/main.py` — all four credentials are read from `os.environ`. The `.env` file exists and is gitignored. The gap is that `.env.example` was deleted (it existed in git history but is now gone) and CLAUDE.md needs documentation of the required env vars.

CSRF is the most misleading item. `form.hidden_tag()` is present in `contact.html`, and `form.validate_on_submit()` is called in the route handler — both correct. However, the form's raw HTML `<input>` fields use `name="Name"`, `name="Email"`, `name="Message"` (capitalized), while WTForms expects `name="name"`, `name="email"`, `name="message"` (lowercase). This means WTForms validation always sees empty fields and the CSRF token field is generated but the overall form never validates true on POST. The fix is either rendering WTForms fields properly or correcting the name attributes — the former is preferred and Phase 3 will complete the WTForms migration, so this phase should focus on CSRF enforcement working end-to-end.

The Dockerfile has a definitive bug: `CMD ["gunicorn", "app:app", ...]` — there is no `app.py` module. The Flask app is in `src/main.py` (relative to the WORKDIR `/app`), so the correct target is `src.main:app`. Redis in `docker-compose.yml` has zero usage in the application code and must be removed.

**Primary recommendation:** Fix the five concrete bugs found (Dockerfile CMD, CSRF field names, missing error handling on mail.send, missing .env.example, undocumented env vars in CLAUDE.md) and remove unused Redis from docker-compose.yml.

---

## Project Constraints (from CLAUDE.md)

| Directive | Detail |
|-----------|--------|
| App entry point | `src/main.py` — single file, no blueprints |
| Local run | `cd src && python3 main.py` on port 8080 |
| Docker run | `docker-compose build && docker-compose up -d` → port 80 |
| GAE deploy | `cd src && gcloud app deploy --project [GCP_PROJECT_NAME]` |
| Dependencies | `src/requirements.txt` (not root `requirements.txt`) |
| Gunicorn CMD | Must match `src/main.py` entry point — currently broken |
| Env vars | `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, `MAIL_PASSWORD`, `SECRET_KEY` |

---

## Codebase Audit Findings

### Finding 1: Secrets — Already Correct

`src/main.py` lines 12–18 already read all four secrets from `os.environ`:

```python
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['MAIL_USERNAME'] = os.environ['MAIL_USERNAME']
app.config['MAIL_DEFAULT_SENDER'] = os.environ['MAIL_DEFAULT_SENDER']
app.config['MAIL_PASSWORD'] = os.environ['MAIL_PASSWORD']
```

`load_dotenv()` is called at line 9, so local dev via `.env` file already works.
`.env` exists at project root and is gitignored (verified in `.gitignore`).

**Gap:** `.env.example` was deleted (visible in git status as `D .env.example`). Needs to be recreated to document required variables. CLAUDE.md also lacks any mention of what env vars are required. [VERIFIED: direct codebase inspection]

### Finding 2: CSRF — Hidden Bug in Form Field Names

`form.hidden_tag()` is present in `contact.html` line 57. [VERIFIED: direct file read]

`form.validate_on_submit()` is called in the `/contact` route. [VERIFIED: direct file read]

Flask-WTF 1.2.1 (installed in project, per `src/requirements.txt`) automatically validates CSRF when `validate_on_submit()` is called — no separate `CSRFProtect()` instance is required for per-form validation. [VERIFIED: flask_wtf source inspection in active Python env]

**Critical bug:** The contact form uses raw HTML inputs with capitalized `name` attributes:
- `name="Name"` — WTForms expects `name="name"`
- `name="Email"` — WTForms expects `name="email"`
- `name="Message"` — WTForms expects `name="message"`

This means `form.validate_on_submit()` always returns `False` on POST (fields appear empty to WTForms). The CSRF token IS generated but validation path is never reached. [VERIFIED: direct template inspection]

**Fix:** Change the raw `<input name="Name">` etc. to use WTForms field rendering (`{{ form.name() }}`, `{{ form.email() }}`, `{{ form.message() }}`), or simply correct the name attributes. WTForms field rendering is preferred as it keeps field names in sync automatically.

Note: Full WTForms field rendering (error display, label rendering) is scoped to Phase 3. Phase 2 must at minimum fix the name mismatch so CSRF validation actually runs on POST.

### Finding 3: Dockerfile — Broken Gunicorn Module Path

Current `CMD`:
```dockerfile
CMD ["gunicorn", "app:app", "-b", ":8080", "--timeout", "300"]
```

`WORKDIR` is `/app`. The Flask app is at `/app/src/main.py`. The Flask application variable is named `app` in `main.py`.

`app:app` refers to a module called `app` (i.e., `app.py`) — no such file exists. [VERIFIED: directory listing]

**Fix:** Change to `src.main:app` (Python module path from WORKDIR `/app`):
```dockerfile
CMD ["gunicorn", "src.main:app", "-b", ":8080", "--timeout", "300"]
```

Alternative: change `WORKDIR` to `/app/src` and use `main:app`, but this requires updating `COPY` paths and is more disruptive. The `src.main:app` approach is minimal. [VERIFIED: Python module import rules, ASSUMED: gunicorn handles dotted module paths — standard behavior]

Note: `src/__init__.py` exists (empty, confirmed), so `src` is a valid Python package and `src.main` is a valid module path. [VERIFIED: directory listing + file existence check]

Also: `COPY requirements.txt .` at line 6 copies the root `requirements.txt` (old, outdated) not `src/requirements.txt` (current). The Dockerfile should copy `src/requirements.txt`. [VERIFIED: Dockerfile lines 6-9 vs file contents]

### Finding 4: Redis — Confirmed Unused

`docker-compose.yml` defines a `redis` service. `src/main.py` has zero Redis client imports (`redis`, `flask-caching`, `flask-session`). The `web` service has `depends_on: redis` but the app never connects to Redis. [VERIFIED: full main.py read]

**Fix:** Remove the `redis` service and `depends_on` block entirely from `docker-compose.yml`.

### Finding 5: No Error Handling on mail.send()

The `/contact` route calls `mail.send(msg)` with no try/except. SMTP failures (network errors, auth failures, timeout) will bubble up as unhandled exceptions, producing a raw 500 with a stack trace in debug mode or a generic Werkzeug error page. [VERIFIED: direct code read]

**Fix per D-04:** Wrap in try/except and call `abort(500)` or return a `render_template('500.html'), 500` response. Simplest approach:

```python
try:
    mail.send(msg)
except Exception:
    app.logger.exception("Failed to send contact email")
    abort(500)
return render_template('contact_sent.html', form=form)
```

Using `app.logger.exception()` writes the traceback to application logs without exposing it to the user. [VERIFIED: Flask docs / standard Python logging patterns]

---

## Standard Stack

### Core (already in project)
| Library | Version in project | Purpose | Notes |
|---------|-------------------|---------|-------|
| Flask | 3.0.0 | Web framework | Current as of research date |
| Flask-WTF | 1.2.1 | CSRF + WTForms integration | Provides `form.hidden_tag()`, `validate_on_submit()` |
| python-dotenv | 1.0.0 | `.env` file loading | Already called in main.py |
| Flask-Mail | 0.9.1 | SMTP email sending | Latest available version |
| gunicorn | not in src/requirements.txt | WSGI server for Docker/prod | Must be added |

**Gap:** `gunicorn` is not listed in `src/requirements.txt`. The Dockerfile installs from `requirements.txt` (root, old) not `src/requirements.txt`. Both issues must be fixed:
1. Add `gunicorn` to `src/requirements.txt`
2. Fix Dockerfile to copy and install `src/requirements.txt` [VERIFIED: file contents inspection]

### Supporting
| Library | Purpose | Already present |
|---------|---------|-----------------|
| WTForms | Form field definitions and validation | Yes (via Flask-WTF) |
| itsdangerous | CSRF token signing (used by Flask-WTF internally) | Yes |

---

## Architecture Patterns

### Secret Handling Pattern (already implemented — verify and document)

```python
# src/main.py — current correct pattern
load_dotenv()  # loads .env for local dev
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']  # fails fast if missing
```

Using `os.environ['KEY']` (KeyError on missing) rather than `os.environ.get('KEY', '')` is intentional for fail-fast behavior — empty string secrets are dangerous. Keep this pattern. [ASSUMED: fail-fast preference; either approach is defensible]

### CSRF Pattern (Flask-WTF 1.2.1)

Flask-WTF's `FlaskForm` validates CSRF automatically when `SECRET_KEY` is set and `validate_on_submit()` is called. No separate `CSRFProtect()` instance is required for individual form CSRF. [VERIFIED: flask_wtf source in active env]

Template must render the hidden CSRF field:
```html
<form method="POST">
{{ form.hidden_tag() }}
<!-- form fields with correct name attributes -->
</form>
```

Form fields must use WTForms names (lowercase, matching Python attribute names):
```html
<input name="name">   <!-- not "Name" -->
<input name="email">  <!-- not "Email" -->
<input name="message"> <!-- not "Message" -->
```

Or use WTForms field rendering directly (preferred, Phase 3 will do this fully):
```html
{{ form.name(class_="w3-input") }}
{{ form.email(class_="w3-input") }}
{{ form.message(class_="w3-input") }}
```

### Error Handling Pattern

Flask's `abort(500)` triggers the registered 500 error handler (or Werkzeug default). For this phase, wrapping `mail.send()` in try/except and calling `abort(500)` is sufficient per D-04. [VERIFIED: Flask docs pattern]

```python
from flask import abort

try:
    mail.send(msg)
except Exception:
    app.logger.exception("Failed to send contact email")
    abort(500)
return render_template('contact_sent.html', form=form)
```

### Gunicorn Module Path Pattern

When app is in `src/main.py` and WORKDIR is `/app`:
```
gunicorn src.main:app -b :8080 --timeout 300
```

`src` must be a Python package (has `__init__.py`) — confirmed present. [VERIFIED]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSRF token generation/validation | Custom token scheme | Flask-WTF `form.hidden_tag()` + `validate_on_submit()` | Handles signing, expiry, double-submit protection |
| Environment variable loading | Manual file parsing | python-dotenv `load_dotenv()` | Already in project, handles quoting/encoding |
| SMTP error types | Catch `smtplib.SMTPException` specifically | Catch broad `Exception`, log it | For this phase; Phase 3 can refine |

---

## Common Pitfalls

### Pitfall 1: WTForms Field Name Case Sensitivity
**What goes wrong:** HTML `<input name="Name">` submits data under key `"Name"`, but WTForms field is `name` (lowercase). `form.validate_on_submit()` sees all fields as empty and returns False. CSRF fails silently because validation never succeeds.
**Why it happens:** WTForms field names must exactly match HTML input names.
**How to avoid:** Use WTForms rendering (`{{ form.name() }}`) or ensure `name` attributes are lowercase.
**Warning signs:** Contact form POST always falls through to GET rendering (no confirmation page).

### Pitfall 2: Dockerfile copies wrong requirements.txt
**What goes wrong:** `COPY requirements.txt .` copies the root `requirements.txt` which is outdated (Flask 2.2.2, no `gunicorn`). Container installs wrong packages.
**How to avoid:** Change to `COPY src/requirements.txt .` and ensure `gunicorn` is listed there.

### Pitfall 3: gunicorn not in src/requirements.txt
**What goes wrong:** Dockerfile installs deps from `requirements.txt` but gunicorn isn't listed anywhere in `src/requirements.txt`. Container build may succeed (if root file has it) but the correct file won't.
**How to avoid:** Add `gunicorn` to `src/requirements.txt` explicitly.

### Pitfall 4: docker-compose volume mount masks corrected Dockerfile
**What goes wrong:** `docker-compose.yml` mounts `.:/app`, which overlays the container's `/app` with the host. If testing with docker-compose, the running code is the host's files, not the built image. Container CMD is still from the Dockerfile though — so gunicorn still runs with the old path unless you rebuild.
**How to avoid:** `docker-compose build` before `docker-compose up` after any Dockerfile changes.

### Pitfall 5: .env.example must not contain real secrets
**What goes wrong:** Recreating `.env.example` with placeholder values and accidentally including a real credential.
**How to avoid:** Use placeholder strings like `your-secret-key-here` — never copy from `.env`.

---

## Code Examples

### Corrected Dockerfile CMD
```dockerfile
# Source: gunicorn docs — module path from WORKDIR
COPY src/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "src.main:app", "-b", ":8080", "--timeout", "300"]
```

### contact.html — Minimal fix (correct input names only)
```html
<form method="POST" action="/contact" role="form">
{{ form.hidden_tag() }}
<input class="w3-input" type="text" name="name" required>
<input class="w3-input" type="text" name="email" required>
<input class="w3-input" type="text" name="message" required>
<input type="submit" value="Submit" class="w3-button w3-block burgundy"/>
</form>
```

### contact route — with error handling
```python
# Source: Flask docs pattern
from flask import abort

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
            reply_to=email
        )
        msg.body = message
        try:
            mail.send(msg)
        except Exception:
            app.logger.exception("Failed to send contact email")
            abort(500)
        return render_template('contact_sent.html', form=form)
    return render_template('contact.html', form=form)
```

### docker-compose.yml — Redis removed
```yaml
version: '1.0'
services:
    web:
        build: .
        ports:
            - "80:8080"
        volumes:
            - .:/app
        env_file:
            - .env
```

### .env.example — to recreate
```
SECRET_KEY=your-secret-key-here
MAIL_USERNAME=your-gmail@gmail.com
MAIL_DEFAULT_SENDER=your-gmail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

---

## Runtime State Inventory

Not applicable — this is a security hardening phase, not a rename/refactor/migration. No stored data or OS-registered state is involved.

---

## Validation Architecture

nyquist_validation is enabled (config.json `workflow.nyquist_validation: true`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual testing (no automated test framework; REQUIREMENTS.md explicitly scopes out test suites) |
| Config file | None |
| Quick run | `cd src && python3 main.py` then manual HTTP requests |
| Full suite | Manual: GET `/`, GET `/cv`, POST `/contact`, GET `/tableau1`, GET `/tableau2`, GET `/qc_neutrino_paper` |

### Phase Requirements → Test Map

| Req | Behavior | Test Type | Command / Steps | Automated? |
|-----|----------|-----------|-----------------|------------|
| SEC-01 | No hardcoded secrets in code | Code inspection | `grep -n "SECRET_KEY\s*=" src/main.py` confirms env var read | Manual grep |
| SEC-02 | CSRF token validated on POST /contact | Functional | POST to /contact without CSRF token → 400; POST with CSRF token + valid form → confirmation page | Manual (curl or browser) |
| SEC-03 | Email failure returns 500 | Functional | Configure bad SMTP creds, POST valid contact form → HTTP 500 | Manual |
| SEC-04 | Dockerfile starts app correctly | Build test | `docker build -t test . && docker run -e SECRET_KEY=x -e MAIL_USERNAME=x -e MAIL_DEFAULT_SENDER=x -e MAIL_PASSWORD=x -p 8080:8080 test` then `curl http://localhost:8080/` | Manual |
| SEC-05 | Redis removed from docker-compose | Inspection | `grep redis docker-compose.yml` returns nothing | Manual grep |
| SEC-06 | .env.example present with all required vars | Inspection | `cat .env.example` shows 4 placeholder vars | Manual |
| SEC-07 | gunicorn in src/requirements.txt | Inspection | `grep gunicorn src/requirements.txt` | Manual grep |

### Wave 0 Gaps

No automated test infrastructure needs to be created — REQUIREMENTS.md explicitly scopes manual testing only. No Wave 0 test files needed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python 3.12 | App runtime | Yes (Phase 1 complete) | 3.12 | — |
| Docker | Container test | Assumed (per CLAUDE.md) | Unknown | Manual flask dev server |
| gunicorn | Dockerfile CMD | Not in src/requirements.txt | — | Add to src/requirements.txt |
| .env file | Local dev | Yes (exists at project root) | — | Export vars manually |

**Missing with fallback:**
- `gunicorn` not in `src/requirements.txt` — fix is to add it; Docker test relies on this.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not in scope |
| V3 Session Management | Partial | Flask SECRET_KEY for session signing — already env var |
| V4 Access Control | No | Not in scope |
| V5 Input Validation | Yes | Flask-WTF + WTForms validators (DataRequired, Email, Length) |
| V6 Cryptography | No | Not in scope |
| V10 Malicious Code | Partial | Ensure no hardcoded secrets remain after phase |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| CSRF on contact form | Spoofing | Flask-WTF hidden_tag() + validate_on_submit() |
| Credential exposure in git | Information disclosure | Env vars + .gitignore + .env.example |
| Unhandled exception leaking stack trace | Information disclosure | try/except + abort(500) + app.logger |
| SMTP open relay abuse | Not applicable | Recipients hardcoded to owner's email |

---

## Open Questions

1. **Does the contact form action attribute need updating?**
   - Current: `action="contact"` (relative) with `target="./pages/views"` (invalid target)
   - What's unclear: Whether this causes routing issues vs. just being dead HTML
   - Recommendation: Change action to `"/contact"` (absolute) and remove the invalid `target` attribute. Low risk, fits Phase 2's stability scope.

2. **Should `abort(500)` or `render_template('500.html'), 500` be used for mail failures?**
   - If a `500.html` template doesn't exist, `abort(500)` uses Werkzeug's default. The app has no custom error handler registered.
   - Recommendation: Use `abort(500)` per D-04 (generic HTTP 500 response). Phase 3 can add a custom error handler if desired.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `src.main:app` is valid gunicorn module path when src/__init__.py exists | Gunicorn fix | Container fails to start — low risk, standard Python package resolution |
| A2 | `abort(500)` without custom 500 handler returns generic Werkzeug 500 page | Error handling | Might raise another exception — negligible risk |
| A3 | Fail-fast `os.environ['KEY']` (KeyError) is preferred over `.get()` with empty default | Secrets | Empty SECRET_KEY would allow app to start with broken CSRF — keeping KeyError is safer |

---

## Sources

### Primary (HIGH confidence)
- Direct codebase read: `src/main.py`, `contact.html`, `Dockerfile`, `docker-compose.yml`, `src/requirements.txt`, `.gitignore`, `.env` (keys only), `src/__init__.py` — all findings verified by file inspection
- Python environment introspection: `flask_wtf.__version__`, `CSRFProtect.__doc__`, `validate_on_submit` docstring — verified via active Python env

### Secondary (MEDIUM confidence)
- Flask-WTF 1.2.1 CSRF behavior: validated by reading `validate_on_submit` source in active environment

### Tertiary (LOW confidence — flagged in Assumptions Log)
- gunicorn dotted module path behavior with Python packages [ASSUMED — standard behavior]

---

## Metadata

**Confidence breakdown:**
- Secrets status: HIGH — verified by direct file read
- CSRF bug (field name case): HIGH — verified by direct template + route inspection
- Dockerfile bug: HIGH — verified by file read + directory listing
- Redis unused: HIGH — zero Redis references in main.py
- gunicorn in requirements: HIGH — verified by file read

**Research date:** 2026-04-10
**Valid until:** 2026-07-10 (stable Flask ecosystem, 90 days)
