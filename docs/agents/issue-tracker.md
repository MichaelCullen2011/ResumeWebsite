# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- Create, read, comment on, label, assign, and close issues using `gh issue`.
- Infer the repository from `git remote -v`.
- PRs are not treated as feature-request or triage surfaces.
- When a skill says "publish to the issue tracker," create a GitHub issue.
- GitHub's shared PR/issue number space must be resolved before acting.

## Wayfinding operations

- A map is one issue labelled `wayfinder:map`.
- Tickets are child issues labelled `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`.
- Use GitHub sub-issues where available; otherwise use a map task list and `Part of #<map>` in ticket bodies.
- Use native GitHub issue dependencies where available; otherwise record `Blocked by: #<issue>` in ticket bodies.
- An open, unblocked, unassigned child is on the frontier.
- Claim a ticket by assigning it before beginning work.
- Resolve by posting the answer, closing the ticket, and adding its linked gist to the map's "Decisions so far."
