# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:** None — no test framework is installed or configured.

**Assertion Library:** None

**Run Commands:** None defined. No `pytest`, `unittest`, `nose`, or similar is present in `requirements.txt`.

## Test File Organization

**Location:** No test files exist in the project source tree.

A search of the repository found zero test files (`test_*.py`, `*_test.py`, `*.spec.*`) outside of the `.venv` virtual environment directory, which contains third-party library tests (e.g., `beautifulsoup4`). These are not project tests.

**Key files checked:**
- `/Users/michaelcullen/Documents/GitHub/ResumeWebsiteFlask/src/main.py` — application entry point, no tests
- `/Users/michaelcullen/Documents/GitHub/ResumeWebsiteFlask/requirements.txt` — no test dependencies listed
- `/Users/michaelcullen/Documents/GitHub/ResumeWebsiteFlask/src/` — no test directory present

## Coverage

**Requirements:** None enforced — no coverage tool configured.

**Coverage report:** Not available.

## Test Types

**Unit Tests:** None

**Integration Tests:** None

**E2E Tests:** None

## Notable Untested Areas

Every part of the application is untested. Priority areas if tests were to be added:

**Contact Form POST handler (`src/main.py` — `get_contact()`):**
- Form data is read directly from `request.form` without invoking WTForms validation
- `mail.send()` is called unconditionally on POST — no error handling around mail failure
- High risk: a bad request or SMTP failure raises an unhandled exception

**Route smoke tests (`src/main.py`):**
- All five routes — `/`, `/contact`, `/cv`, `/tableau1`, `/tableau2` — have zero coverage
- `GET /contact` and `POST /contact` have distinct code paths, both untested

**PDF static file serving (`src/main.py` — `paper_view()`):**
- The `try/except FileNotFoundError` branch returns a plain string `"Not Found"` instead of a proper 404 response — untested

**Template rendering:**
- No assertions that templates render without error or contain expected content

## Recommended Test Setup

To add basic tests, install and use Flask's built-in test client with `pytest`:

```bash
pip install pytest
```

Minimal test structure:

```python
# tests/test_routes.py
import pytest
from src.main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200

def test_contact_get(client):
    response = client.get('/contact')
    assert response.status_code == 200
```

---

*Testing analysis: 2026-04-10*
