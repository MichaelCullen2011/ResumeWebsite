# Context: ResumeWebsiteFlask

Personal portfolio website built with Flask and deployed to Google App Engine.

## What This Project Does

The website presents Michael Cullen's professional profile, selected public projects, CV, an AI architecture case study, a neutrino oscillation visualiser, a downloadable quantum computing paper, and a contact path.

## Pages

| Route | Page |
|---|---|
| `/` | Homepage with profile, experience, and selected projects |
| `/architecture` | Public-safe AI architecture case study |
| `/physics` | Three-flavour neutrino oscillation visualiser |
| `/cv` | CV/resume |
| `/contact` | Contact form and direct-email fallback |
| `/qc_neutrino_paper` | Downloadable quantum computing paper |

## Tech Stack

| Component | Technology |
|---|---|
| Language | Python 3.12 |
| Web framework | Flask |
| Templates | Jinja2 |
| Forms | Flask-WTF / WTForms |
| Email | Flask-Mail over Gmail SMTP |
| WSGI server | Gunicorn |
| Containers | Docker and Docker Compose |
| Hosting | Google App Engine |

## Repository

- Remote: `https://github.com/MichaelCullen2011/ResumeWebsite.git`
- Release pull request: PR #7 from `release/prelaunch-2026-07` into `master`
- Canonical branch after shipping: `master`

## Language

**Ready to ship**:
PR #7 contains all updates and changes Michael wants in the release, all public-facing information is final rather than placeholder content, every linked GitHub repository and the GitHub profile present a consistent public identity, and Michael has accepted every page, interaction, responsive state, and failure page in a full-site walkthrough.
_Avoid_: Merge-ready, code-complete

**Shipped**:
The ready-to-ship PR has been merged into `master` and deployed to the production personal website.
_Avoid_: Released, promoted

**Public identity**:
Manager, Technology Transformation at Deloitte, based in Edinburgh, UK, with `michaelcullen2024@gmail.com` as the sole public contact address.
_Avoid_: Technology Architect, Technology Consultant, London, `michaelcullen2011@hotmail.co.uk`

**Contact path**:
The public way to contact Michael: retain the website form when it works with minimal intervention; otherwise present a direct link to `michaelcullen2024@gmail.com` rather than delaying the release for form repair.
_Avoid_: Contact service, messaging system
