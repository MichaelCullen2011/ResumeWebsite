# Phase 1 - Context: Dependency & Runtime Updates

**Phase Goal:** Upgrade Python runtime and all dependencies to current versions, ensuring compatibility and security.

**Current State:**
- Python: 3.9 (in Dockerfile and app.yaml)
- Flask: 2.2.2 (should upgrade to 3.x)
- Flask-Mail: 0.9.1 (very outdated, current is 1.0+)
- Other deps: outdated across the board
- Unused deps: beautifulsoup4, google, python-dateutil present but not used in code

**Target State:**
- Python: 3.11+ (current LTS supported version)
- Flask: 3.x (latest stable)
- All dependencies: latest stable versions compatible with Python 3.11
- Unused dependencies: removed
- Dockerfile, app.yaml, requirements.txt: updated and consistent

**Work Items:**
1. Update Python version in Dockerfile (3.9 → 3.12)
2. Update Python version in app.yaml (python39 → python312)
3. Update all dependencies in src/requirements.txt to latest stable
4. Remove unused dependencies (beautifulsoup4, google, python-dateutil)
5. Test locally to verify app still works
6. Verify no deprecation warnings or errors

**Success Criteria:**
- Python 3.11+ across all config files
- All dependencies updated to latest stable versions
- App runs locally without errors or warnings
- All table stakes features work: homepage, CV, contact, dashboards, PDF, deployment

**Estimated Effort:** 2-3 hours (testing, dependency resolution, verification)

**Risk:** Low - straightforward updates, can test locally before deploying

**Canonical Requirements:**
- Update Python runtime to 3.11+ (High priority)
- Update all dependencies to latest stable (High priority)
- Remove unused dependencies (Medium priority)
