# Michael Cullen — Portfolio

Personal portfolio site for Michael Cullen, a Technology Manager at Deloitte. The Flask app presents architecture and AI work, data/ML projects, a physics playground, CV, and a contact form.

Live site: <https://michaelcullenpersonal.nw.r.appspot.com>

## Local development

Create a `.env` from `.env.example`, fill in the four required values, then run:

```bash
python3 -m venv .venv
.venv/bin/pip install -r src/requirements.txt
.venv/bin/python src/main.py
```

The site runs at <http://localhost:8080>.

## Routes

- `/` — portfolio homepage
- `/architecture` — public-safe AI architecture case study
- `/physics` — neutrino oscillation visualiser
- `/cv` — online CV
- `/contact` — contact form
- `/qc_neutrino_paper` — MPhys thesis PDF

## Docker

```bash
docker build -t resumewebsite .
docker run --env-file .env -p 8080:8080 resumewebsite
```

## Deploy to Google App Engine

Do not place real credentials in `src/app.yaml`. Before deployment, create an ignored release-only configuration and replace its four placeholder values with the production `SECRET_KEY`, `MAIL_USERNAME`, `MAIL_DEFAULT_SENDER`, and `MAIL_PASSWORD`:

```bash
cd src
cp app.yaml app.release.yaml
# Edit app.release.yaml locally; never commit it.
```

Deploy a testable version without routing live traffic to it:

```bash
cd src
gcloud app deploy app.release.yaml --project <project-id> --version <release-id> --no-promote
```

Smoke-test the deployed version, including the contact form, then promote it using the Google Cloud console or `gcloud app services set-traffic`.
