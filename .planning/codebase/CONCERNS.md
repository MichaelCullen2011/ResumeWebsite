# Codebase Concerns

**Analysis Date:** 2026-04-10

---

## Security Considerations

### [CRITICAL] Hardcoded Email Credentials in Source Code

- **Risk:** A real Gmail app password is committed directly in the source file and visible in git history. Anyone with repo access can authenticate as this Gmail account.
- **Files:** `src/main.py` lines 13–15
- **Current mitigation:** None. The password is a plain string literal.
- **Recommendations:** Move `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, and `MAIL_PASSWORD` to environment variables read via `os.environ.get()`. Add these variable names to `.gitignore`-tracked `.env` documentation. Rotate the compromised app password immediately.

### [HIGH] CSRF Token Missing from Contact Forms

- **Risk:** The contact form at `/contact` accepts POST requests without a CSRF token. Although `flask-wtf` and `FlaskForm` are imported and a form object (`EmailForm`) is passed to the template, the template never renders the form object — it uses raw HTML `<input>` fields with no `{{ form.hidden_tag() }}` or `{{ form.csrf_token }}`. This means CSRF protection provided by Flask-WTF is entirely bypassed.
- **Files:** `src/templates/contact.html` line 56–70, `src/templates/contact_sent.html` lines 57–71, `src/templates/contact_bar.html` lines 37–51, `src/main.py` lines 24–38
- **Current mitigation:** None effective — the WTForms `EmailForm` class is instantiated but none of its fields are used in the template.
- **Recommendations:** Add `{{ form.hidden_tag() }}` inside the `<form>` tag in all three contact templates, and switch from `request.form["Name"]` raw access to `form.validate_on_submit()` in the route handler.

### [HIGH] Random SECRET_KEY Regenerated on Every App Start

- **Risk:** `app.config['SECRET_KEY'] = os.urandom(32)` generates a new key on every process start. This invalidates all existing sessions and CSRF tokens on restart, and in multi-worker deployments (e.g., gunicorn with multiple workers) each worker gets a different key, causing session/CSRF failures across requests.
- **Files:** `src/main.py` line 9
- **Current mitigation:** None.
- **Recommendations:** Set `SECRET_KEY` from an environment variable: `os.environ.get('SECRET_KEY')`. Generate a stable value once and store it securely.

### [MEDIUM] No Input Validation on Contact Form Fields

- **Risk:** The contact route reads `request.form["Name"]`, `request.form["Email"]`, and `request.form["Message"]` with no validation, sanitisation, or length limits. A missing field causes an unhandled `KeyError`. An attacker can submit arbitrary content as the email sender or inject long strings.
- **Files:** `src/main.py` lines 28–35
- **Current mitigation:** HTML `required` attribute only (client-side, easily bypassed).
- **Recommendations:** Use `form.validate_on_submit()` with WTForms validators (`DataRequired`, `Email`, `Length`) defined on the `EmailForm` class.

### [MEDIUM] `FLASK_DEBUG=True` Set in Dockerfile

- **Risk:** The Dockerfile sets `ENV FLASK_DEBUG=True`, which enables the Werkzeug interactive debugger. If the app were served via the Flask dev server in production, this would expose a full Python REPL to any visitor. Even with gunicorn, this env var leaking into the container image signals an incorrect deployment posture.
- **Files:** `Dockerfile` line 14
- **Current mitigation:** Gunicorn is used as the server, which ignores the Flask debug flag. However, the setting is still wrong and misleading.
- **Recommendations:** Remove `ENV FLASK_DEBUG=True` from the Dockerfile. Set it only in local development via a `.env` file or docker-compose override.

### [LOW] Personal Contact Information Hardcoded in Templates

- **Risk:** Full home address, phone number, and personal email appear as static strings in multiple templates. Changing contact details requires editing multiple files.
- **Files:** `src/templates/contact.html` lines 28–38, `src/templates/contact_sent.html` lines 28–38, `src/templates/contact_bar.html` lines 9–26
- **Current mitigation:** None — duplicated across three files.
- **Recommendations:** Extract contact details into a single shared partial (e.g., `contact_info.html`) included by all three templates. Or pass them as Jinja2 template variables from the route.

---

## Tech Debt

### [HIGH] Dockerfile CMD References Non-Existent `app:app` Module

- **Issue:** The Dockerfile CMD is `gunicorn app:app -b :8080 --timeout 300`. The Flask application is defined in `src/main.py` as the variable `app`, but the gunicorn module path `app:app` does not match this location. The correct path would be `src.main:app` or `main:app` depending on working directory and Python path. The actual working CMD is commented out on line 19.
- **Files:** `Dockerfile` line 18
- **Impact:** The Docker image will fail to start with a `ModuleNotFoundError` or `Failed to find application` error.
- **Fix approach:** Update the CMD to `gunicorn src.main:app -b :8080 --timeout 300` and verify with `docker build && docker run`.

### [MEDIUM] Two Separate `requirements.txt` Files with Different Content

- **Issue:** There is both `/requirements.txt` (root) and `/src/requirements.txt`. The root-level file is untracked (shown in git status as `??`). The Dockerfile copies from the root (`COPY requirements.txt .`), making it unclear which file is authoritative. The `src/requirements.txt` contains pinned versions; the root file's contents are unknown.
- **Files:** `/requirements.txt` (root, untracked), `/src/requirements.txt`
- **Impact:** Inconsistent dependency installation depending on which file is used. The root file may be stale or diverged.
- **Fix approach:** Consolidate to a single `requirements.txt` at the root, update the Dockerfile accordingly, and commit it.

### [MEDIUM] Docker Compose References Redis but App Has No Redis Usage

- **Issue:** `docker-compose.yml` defines a `redis` service and makes the `web` service depend on it (`depends_on: redis`), but `src/main.py` imports nothing from Redis, and `src/requirements.txt` does not list any Redis client library.
- **Files:** `docker-compose.yml` lines 7–12, `src/main.py`, `src/requirements.txt`
- **Impact:** Unnecessary container started on every `docker-compose up`. Could cause confusion for future contributors.
- **Fix approach:** Remove the `redis` service and `depends_on` block from `docker-compose.yml` unless Redis is intentionally planned.

### [MEDIUM] Outdated Dependencies (circa 2022)

- **Issue:** All pinned versions in `src/requirements.txt` are from mid-2022. Current versions (as of 2026) are significantly newer and include security patches.
  - `Flask==2.2.2` (current: 3.x)
  - `Werkzeug==2.2.2` (current: 3.x — several CVEs fixed in intervening versions)
  - `Flask-WTF==1.0.1` (current: 1.2.x)
  - `Flask-Mail==0.9.1` (unmaintained — last release 2014; consider `flask-mailman`)
  - `Jinja2==3.1.2` (current: 3.1.x — patch releases with security fixes)
- **Files:** `src/requirements.txt`
- **Impact:** Known security vulnerabilities may be present. `Flask-Mail` is effectively unmaintained.
- **Fix approach:** Run `pip list --outdated` in the venv, update to current stable versions, and run a smoke test. Evaluate replacing `Flask-Mail` with `flask-mailman`.

### [LOW] Docker Compose Volume Mounts Entire Repo into `/app`

- **Issue:** `docker-compose.yml` mounts `.:/app`, which means the entire project root (including `.venv`, `.git`, `.idea`) is mounted into the container at runtime. This overrides the `COPY . .` layer from the Dockerfile and can cause the container to use local dev files rather than the built image contents.
- **Files:** `docker-compose.yml` line 8
- **Impact:** Inconsistent behaviour between `docker run` and `docker-compose up`. Local `.venv` may shadow the container's installed packages.
- **Fix approach:** Replace the volume mount with a named volume for only the directories that need hot-reload (e.g., `./src:/app/src`), or remove it for production-style compose usage.

---

## Missing Critical Features

### [HIGH] No Rate Limiting on Contact Form Endpoint

- **Problem:** The `/contact` POST endpoint sends an email on every request with no throttling. An attacker can trivially spam the endpoint to exhaust the Gmail sending quota or flood the recipient inbox.
- **Blocks:** Safe production deployment.
- **Recommendation:** Add `flask-limiter` with a per-IP rate limit on the `/contact` POST route (e.g., `5 per minute`).

### [MEDIUM] No Error Handling for Mail Send Failures

- **Problem:** `mail.send(msg)` in `src/main.py` line 35 is called with no try/except. If the SMTP server is unavailable or credentials are wrong, the user receives an unhandled 500 error with a traceback.
- **Files:** `src/main.py` lines 35–36
- **Recommendation:** Wrap in `try/except Exception` and render an error template or flash a user-friendly message.

---

## Test Coverage Gaps

### [HIGH] No Tests of Any Kind

- **What's not tested:** Every route, the email send logic, form validation, and error handling paths.
- **Files:** Entire `src/` directory — no `*.test.*` or `*.spec.*` files found, no test runner config.
- **Risk:** Any code change can silently break the site with no automated signal.
- **Priority:** Medium — this is a small personal site, but the contact form send path and error handling are the most important areas to cover first.

---

## Fragile Areas

### [MEDIUM] Contact Form POST Reads Raw `request.form` Keys

- **Files:** `src/main.py` lines 28–30
- **Why fragile:** Uses dictionary-style access (`request.form["Name"]`). If the HTML field `name` attribute ever changes in any of the three contact templates, the route raises an unhandled `KeyError` at runtime with no user-facing error.
- **Safe modification:** Switch to `request.form.get("Name", "")` as a minimum, or migrate to proper WTForms field binding.

### [LOW] Invalid HTML Element `<h7>` in contact_sent.html

- **Files:** `src/templates/contact_sent.html` line 55
- **Why fragile:** `<h7>` is not a valid HTML element. Browsers will render it as an inline element with no default styling. The intended visual hierarchy is broken.
- **Safe modification:** Replace with `<h6>` or a `<p>` with a CSS class.

### [LOW] Broken CSS `<link>` Tag in Multiple Templates

- **Files:** `src/templates/contact.html` line 8, `src/templates/contact_sent.html` line 8, `src/templates/homepage_base.html` line 6
- **Why fragile:** `<link rel="stylesheet" href="templates/app.js">` references a `.js` file as a stylesheet using a relative path that is not served via Flask's static file routing. This link will 404 in production and load nothing.
- **Safe modification:** If `app.js` is a JavaScript file, change the tag to `<script src="{{ url_for('static', filename='app.js') }}"></script>`. If it is a CSS file, rename it and use `url_for('static', ...)`.

---

*Concerns audit: 2026-04-10*
