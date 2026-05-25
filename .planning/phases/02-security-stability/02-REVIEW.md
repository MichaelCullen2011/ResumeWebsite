---
phase: 02-security-stability
reviewed: 2026-04-10T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - .env.example
  - CLAUDE.md
  - Dockerfile
  - docker-compose.yml
  - src/main.py
  - src/requirements.txt
  - src/templates/contact.html
findings:
  critical: 2
  warning: 4
  info: 5
  total: 11
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-10
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Reviewed all files in scope for the security and stability phase. The app is a small single-file Flask application with a contact form, static pages, and a PDF download route. Flask-WTF CSRF protection is active and server-side validators are in place, which is a solid baseline.

Two critical issues were found: PII (personal home address, phone number, and email) is hardcoded in a publicly rendered template, and the PDF-not-found handler returns an HTTP 200 response with a plain-text body instead of a proper 404. Four warnings cover form field inconsistencies, incorrect HTTP status on error, and the Docker setup inadvertently leaking credentials into image layers due to a missing `.dockerignore`. Five informational items cover minor HTML/UX, dead code, and code organisation.

---

## Critical Issues

### CR-01: Personal Home Address and Phone Number Hardcoded in Public Template

**File:** `src/templates/contact.html:26-32, 37`
**Issue:** The rendered contact page includes a full home postal address (9 Haymarket Square, Edinburgh, EH3 8RY), a personal phone number (+44 77 15924 881), and a personal email address (`michaelcullen2024@gmail.com`). This PII is served to every visitor without authentication and is indexed by search engines. Beyond privacy risk, the address and phone number cannot be updated without a code change and redeployment.
**Fix:** Move contact details out of the template. At minimum, replace them with only the channels you want public (e.g., GitHub and LinkedIn links already present). If the phone number and address are intentional (e.g., for a CV-style site), they should be acknowledged as a deliberate choice and documented — but the current state appears unintentional given the phone and address are not displayed consistently elsewhere.

```html
<!-- Remove or replace with only public-facing channels -->
<div class="w3-container contact-display">
    <h5 class="w3-opacity w3-padding-medium"><b>michaelcullen2024@gmail.com</b></h5>
    <!-- keep GitHub / LinkedIn links -->
</div>
```

---

### CR-02: PDF Not-Found Handler Returns HTTP 200 Instead of 404

**File:** `src/main.py:73-74`
**Issue:** When `QC_Paper.pdf` is missing, `paper_view()` catches `FileNotFoundError` and returns the plain string `"Not Found"` with an implicit HTTP 200 status code. Clients, caches, and monitoring tools will treat this as a successful response. Any caller checking for success will be silently misled.
**Fix:** Use `abort(404)` — `abort` is already imported on line 1.

```python
@app.route('/qc_neutrino_paper')
def paper_view():
    try:
        return send_from_directory("static/", "QC_Paper.pdf")
    except FileNotFoundError:
        abort(404)
```

---

## Warnings

### WR-01: Dockerfile Copies .env Into Image (No .dockerignore)

**File:** `Dockerfile:11`
**Issue:** `COPY . .` copies the entire project root into the image. There is no `.dockerignore` file in the repository. If a developer has a populated `.env` file (with real `MAIL_PASSWORD` and `SECRET_KEY` values), running `docker build` will bake those secrets into the image layer. Any image pushed to a registry (public or private) will contain the credentials.
**Fix:** Add a `.dockerignore` at the project root that excludes sensitive and unnecessary files:

```
.env
.env.*
.git/
.gitignore
.planning/
*.md
__pycache__/
.venv/
```

This prevents `.env` from ever entering the image regardless of whether the developer remembered to exclude it manually.

---

### WR-02: docker-compose.yml Volume Mount Exposes .env and .git at Runtime

**File:** `docker-compose.yml:8`
**Issue:** `volumes: - .:/app` mounts the entire repository root (including `.env`, `.git/`, and `.planning/`) into the running container. While `.env` is needed for environment variable injection (already handled by `env_file`), the full mount is broader than necessary and exposes the live credential file inside the container at runtime.
**Fix:** Remove the volume mount for production/staging use, or restrict it to source-only directories for development. `env_file` on its own is sufficient to inject credentials:

```yaml
services:
  web:
    build: .
    ports:
      - "80:8080"
    env_file:
      - .env
    # volumes removed — use `docker-compose build && docker-compose up` for code changes
```

If live-reload during development is the goal, scope the mount to source only:

```yaml
volumes:
  - ./src:/app/src
```

---

### WR-03: Contact Form Fields Bypass WTForms Field Rendering

**File:** `src/templates/contact.html:60-69`
**Issue:** The form uses bare HTML `<input name="name">`, `<input name="email">`, and `<input name="message">` rather than `{{ form.name() }}`, `{{ form.email() }}`, and `{{ form.message() }}`. Server-side validation via `form.validate_on_submit()` still runs correctly (WTForms reads `request.form` by field name), so this is not a validation bypass. However, WTForms validation error messages are never surfaced to the user — if the email field fails the `Email()` validator or a field exceeds its `Length` limit, the form simply re-renders silently with no feedback. Additionally, the `message` field is rendered as a single-line `<input type="text">` rather than a `<textarea>`, which contradicts the `TextAreaField` definition and truncates multi-line input.
**Fix:** Use WTForms field macros so validators and error messages render correctly:

```html
<div class="w3-section text-burgundy w3-center">
    {{ form.name.label }}
    {{ form.name(class="w3-input w3-border-thin w3-center") }}
    {% for error in form.name.errors %}
        <span class="w3-text-red">{{ error }}</span>
    {% endfor %}
</div>
<div class="w3-section text-burgundy">
    {{ form.email.label }}
    {{ form.email(class="w3-input w3-border-thin w3-center") }}
    {% for error in form.email.errors %}
        <span class="w3-text-red">{{ error }}</span>
    {% endfor %}
</div>
<div class="w3-section text-burgundy">
    {{ form.message.label }}
    {{ form.message(class="w3-input w3-border-thin w3-center") }}
    {% for error in form.message.errors %}
        <span class="w3-text-red">{{ error }}</span>
    {% endfor %}
</div>
```

---

### WR-04: .env.example Deleted from Repository

**File:** `.env.example` (deleted per git status)
**Issue:** `.env.example` is the canonical reference for required environment variables for new contributors and CI/CD setup. Its deletion (tracked in git status as ` D .env.example`) removes the onboarding guide and means any developer cloning the repo has no indication that `SECRET_KEY`, `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, and `MAIL_PASSWORD` must be set before the app will start. The CLAUDE.md references this file (`cp .env.example .env`) — that instruction will now fail.
**Fix:** Restore `.env.example` (or re-create it) with placeholder values:

```
SECRET_KEY=your-secret-key-here
MAIL_USERNAME=your-gmail@gmail.com
MAIL_DEFAULT_SENDER=your-gmail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

---

## Info

### IN-01: Email Input Uses type="text" Instead of type="email"

**File:** `src/templates/contact.html:64`
**Issue:** `<input ... type="text" ... name="email">` uses a text input type. Using `type="email"` enables browser-level format validation and shows the correct keyboard on mobile devices.
**Fix:** Change `type="text"` to `type="email"` on the email field.

---

### IN-02: Commented-Out CMD in Dockerfile

**File:** `Dockerfile:18`
**Issue:** `# CMD [ "python3", "-m" , "flask", "run", ...]` is dead code left from development. It adds noise and could cause confusion about the intended entrypoint.
**Fix:** Remove the commented-out line.

---

### IN-03: Broken Stylesheet Reference in contact.html

**File:** `src/templates/contact.html:8`
**Issue:** `<link rel="stylesheet" href="templates/app.js">` references a non-existent file (`templates/app.js`) and incorrectly uses `rel="stylesheet"` for what appears to be a JavaScript file. This generates a 404 on every page load.
**Fix:** Remove this line. The app's styles are already included via `{% include 'style.css' %}` in the base templates. If a JS file is needed, reference it with `<script src="...">` and the correct Flask `url_for('static', filename='...')` path.

---

### IN-04: EmailForm Class Defined After First Use

**File:** `src/main.py:51` (used at line 29)
**Issue:** `EmailForm` is defined on line 51 but instantiated in `get_contact()` on line 29. This works at runtime because `get_contact` is only invoked after the module finishes loading, but it violates the Python convention of defining classes before their use and makes the module harder to navigate.
**Fix:** Move the `EmailForm` class definition to before the route functions (e.g., after the `mail = Mail(app)` line on line 20).

---

### IN-05: docker-compose.yml Uses Non-Standard Schema Version

**File:** `docker-compose.yml:1`
**Issue:** `version: '1.0'` is not a recognised Docker Compose file format version. Valid schema versions are `'2'`, `'3'`, `'3.8'`, etc. While recent versions of `docker compose` (V2) ignore this field, older tooling may warn or behave unexpectedly.
**Fix:** Change to `version: '3.8'` or remove the `version` key entirely (it is optional and ignored in Compose V2+).

---

_Reviewed: 2026-04-10_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
