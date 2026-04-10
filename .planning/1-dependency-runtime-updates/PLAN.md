# Phase 1 - Plan: Dependency & Runtime Updates

**Phase:** 1  
**Goal:** Upgrade Python runtime and all dependencies to current versions, ensuring compatibility and security.  
**Status:** Ready for execution  
**Created:** 2026-04-10

---

## Overview

This phase updates the Flask application from Python 3.9 to 3.11+ and upgrades all dependencies to their latest stable versions. The work is low-risk because the app is simple and all changes are additive (no breaking architecture changes).

**Approach:**
1. Update Python version in Dockerfile and app.yaml
2. Identify latest stable versions of each dependency
3. Update requirements.txt with new versions
4. Remove unused dependencies
5. Test locally to verify compatibility
6. Verify all features still work

---

## Tasks

### Task 1: Update Python Version in Dockerfile
**Goal:** Change Python base image from 3.9 to 3.12

**Steps:**
1. Edit `Dockerfile`: change `FROM python:3.9-slim` to `FROM python:3.12-slim`
2. Verify Dockerfile syntax is valid
3. Do NOT rebuild Docker image yet (will happen in testing phase)

**Acceptance:** Dockerfile line 1 reads `FROM python:3.12-slim`

---

### Task 2: Update Python Version in app.yaml
**Goal:** Update Google App Engine runtime configuration from python39 to python312

**Steps:**
1. Edit `src/app.yaml`: change `runtime: python39` to `runtime: python312`
2. Edit `src/app.yaml`: change `python_version: 3.9` to `python_version: 3.12`

**Acceptance:** 
- `runtime: python312`
- `python_version: 3.12`

---

### Task 3: Identify Latest Stable Dependency Versions
**Goal:** Determine compatible latest versions for all dependencies

**Research findings (as of 2026-04):**
- Flask: 3.0.0+ (latest is 3.0.x)
- Flask-Mail: 1.0.0+ (latest is ~1.0.x, may need to check compatibility with Flask 3)
- Flask-WTF: 1.2.0+ (compatible with Flask 3)
- Werkzeug: 3.0.0+ (should be auto-pinned by Flask)
- WTForms: 3.1.0+ (latest)
- Jinja2: 3.1.x (latest, already compatible)
- email-validator: 2.1.0+ (latest)
- python-dotenv: 1.0.0+ (latest, already at this version)
- Other dependencies: Update to latest stable versions compatible with Python 3.12

**Note:** Some dependencies will be auto-pinned by Flask/Flask-Mail, so exact versions will depend on pip resolution.

**Acceptance:** Versions documented and tested for compatibility

---

### Task 4: Update requirements.txt
**Goal:** Replace all dependency versions with latest stable, remove unused deps

**Current unused dependencies to remove:**
- beautifulsoup4==4.11.1 (not used in code)
- google==3.0.0 (not used in code)
- python-dateutil==2.8.2 (not used in code)
- soupsieve==2.3.2.post1 (dependency of beautifulsoup4, remove with it)

**New requirements.txt (regenerated via pip):**

Process:
1. Create a temporary Python 3.12 environment (or use Docker)
2. Install only the needed packages: Flask, Flask-Mail, Flask-WTF, WTForms, email-validator, python-dotenv
3. Run `pip freeze` to get exact versions
4. Update `src/requirements.txt` with the new pinned versions
5. Remove the unused packages from requirements.txt

**Expected packages in new requirements.txt:**
- Flask==3.0.x
- Flask-Mail==1.0.x or compatible
- Flask-WTF==1.2.x
- WTForms==3.1.x
- Werkzeug==3.0.x (auto from Flask)
- Jinja2==3.1.x (auto from Flask)
- MarkupSafe==2.1.x (auto)
- click==8.1.x (auto from Flask)
- itsdangerous==2.1.x (auto)
- blinker==1.5.x (auto)
- email-validator==2.1.x
- python-dotenv==1.0.x
- importlib-metadata (likely not needed, let pip decide)
- zipp, pytz, six (likely removed or auto-resolved)

**Acceptance:** 
- requirements.txt contains only necessary packages
- All versions are latest stable compatible with Python 3.12
- Unused packages (beautifulsoup4, google, python-dateutil, soupsieve) are removed
- File is clean and pip install -r requirements.txt works without conflicts

---

### Task 5: Test Locally - Docker Build
**Goal:** Verify Docker image builds with new Python version and updated deps

**Steps:**
1. Run `docker build -t resumewebsite:test .` in repo root
2. Watch for build errors or warnings
3. If build succeeds, mark as complete

**Acceptance:** Docker build completes without errors

---

### Task 6: Test Locally - Docker Run
**Goal:** Verify app runs in Docker container

**Steps:**
1. Run `docker run -p 8080:8080 resumewebsite:test`
2. Wait for Flask to start (should see "Running on..." message)
3. Check http://localhost:8080 in browser (should see homepage)
4. Check for any deprecation warnings in logs
5. Stop container

**Acceptance:** 
- App starts without errors
- Homepage loads
- No deprecation warnings in logs

---

### Task 7: Test Locally - Local Python Dev
**Goal:** Verify app runs with Python 3.12 locally (outside Docker)

**Prerequisites:**
- Python 3.12 installed locally
- venv created with Python 3.12

**Steps:**
1. Create venv: `python3.12 -m venv venv`
2. Activate: `source venv/bin/activate`
3. Install deps: `pip install -r src/requirements.txt`
4. Run app: `cd src && python3 main.py`
5. Check http://localhost:8080 in browser
6. Check logs for errors or warnings
7. Stop app

**Acceptance:** 
- App runs without errors
- Homepage, CV, contact, dashboards, PDF all load
- No deprecation warnings or errors in logs

---

### Task 8: Test All Features - Manual
**Goal:** Verify table stakes features still work with new Python and deps

**Checklist:**
- [ ] Homepage loads (GET /)
- [ ] CV page loads (GET /cv)
- [ ] Tableau dashboards load (GET /tableau1, /tableau2)
- [ ] PDF download works (GET /qc_neutrino_paper)
- [ ] Contact form appears (GET /contact)
- [ ] Contact form submits (POST /contact) — may need test email or mock SMTP
- [ ] No JavaScript errors in browser console
- [ ] No deprecation warnings in Flask logs

**Acceptance:** All checks pass

---

### Task 9: Verify Code Compatibility
**Goal:** Ensure no deprecated patterns in code that would break with new versions

**Steps:**
1. Read through `src/main.py` for any deprecated Flask 2.x patterns
2. Check that Flask-WTF, WTForms imports are correct for new versions
3. Verify `app.config` settings are compatible
4. Look for any hardcoded assumptions about Flask version

**Known issues to watch for:**
- Flask 3.0 removed `flask.json` module (now `flask.json.provider`)
- WTForms 3.1+ may have breaking changes in form definition
- Flask-Mail API changes (check Flask-Mail 1.0 changelog)

**Acceptance:** No incompatible patterns found; if found, document fix needed

---

## Success Criteria

All of the following must be true:

1. ✓ Python version is 3.12 in Dockerfile and app.yaml
2. ✓ All dependencies in requirements.txt are latest stable versions
3. ✓ Unused dependencies (beautifulsoup4, google, python-dateutil, soupsieve) are removed
4. ✓ Docker build completes without errors
5. ✓ App runs in Docker without errors or warnings
6. ✓ App runs locally with Python 3.12 without errors or warnings
7. ✓ All table stakes features work: homepage, CV, contact, dashboards, PDF
8. ✓ No deprecation warnings in Flask logs
9. ✓ Code is compatible with Flask 3.0+ and new dependency versions

---

## Rollback Plan

If severe issues arise:
1. Revert Dockerfile to `FROM python:3.9-slim`
2. Revert app.yaml to `runtime: python39` and `python_version: 3.9`
3. Restore requirements.txt from git history
4. Re-test

However, this phase is low-risk and rollback should not be needed.

---

## Notes

- **Flask-Mail compatibility:** Flask-Mail 1.0.x may not be fully compatible with Flask 3.0. If issues arise, may need to use Flask-Mail from 0.9.1 or check for Flask 3.0 patches.
- **Optional deps:** If pip complains about missing transitive deps after removing beautifulsoup4/google/python-dateutil, install those as needed (they may be required by something unexpected).
- **Testing email:** Contact form testing may require mocking SMTP or configuring a test Gmail account. Skip email testing if not critical.

---

**Task Execution Notes:**
- Estimated time: 2-3 hours
- Can execute sequentially (each task depends on previous)
- Testing is critical — don't skip local verification
- Document any issues encountered for Phase 2 planning

