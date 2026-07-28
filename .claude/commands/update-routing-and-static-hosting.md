---
name: update-routing-and-static-hosting
description: Workflow command scaffold for update-routing-and-static-hosting in SoloHomeAI.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-routing-and-static-hosting

Use this workflow when working on **update-routing-and-static-hosting** in `SoloHomeAI`.

## Goal

Update application routing or static hosting to fix navigation, deep linking, or 404 issues, especially for SPAs deployed on static hosts like Vercel.

## Common Files

- `public/*.html`
- `public/*/index.html`
- `vercel.json`
- `src/App.tsx`
- `src/pages/*.tsx`
- `README.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add static HTML files for affected routes in public/ (e.g., public/app.html, public/dashboard.html).
- Update vercel.json to declare new redirects or rewrites.
- Modify React Router usage or navigation logic in src/App.tsx and related page components.
- Update documentation (README.md) if navigation behavior changes.
- Adjust package.json or dependencies if routing libraries change.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.