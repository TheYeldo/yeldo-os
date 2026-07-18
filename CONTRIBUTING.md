# Contributing to YeldoOS

Thanks for improving YeldoOS. Contributions should preserve the portfolio's honest content model, accessibility, localization completeness, and lightweight browser-first architecture.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

`GITHUB_TOKEN` is optional. Never commit `.env.local` or a token.

## Before opening a change

Run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

For interface changes, verify Russian and English at desktop, tablet, and mobile widths. Test keyboard focus, reduced motion, and at least one touch-friendly route.

## Content rules

- Do not invent jobs, clients, education, awards, revenue, or experience.
- Keep concept and prototype statuses explicit.
- Use `null` for unavailable external links.
- Add every new interface string to both message catalogs.
- Keep source code, commands, paths, package names, and filenames untranslated where natural.

## Architecture rules

- Keep applications isolated under `src/components/apps`.
- Put cross-application navigation in the system store or command registry, not implicit DOM events.
- Validate external data before it reaches UI components.
- Do not expose server tokens through `NEXT_PUBLIC_` variables or API responses.
- Add large dependencies only when they materially improve a core application.
- Preserve the mobile launcher/full-screen panel behavior rather than shrinking desktop windows.

## Commits

Use concise conventional commits such as:

```text
feat: add portfolio application
fix: preserve window bounds on resize
docs: explain github token setup
```

## Pull requests

Describe the user-facing change, architectural impact, localization work, accessibility checks, and commands used for verification. Include before/after screenshots for visual changes.
