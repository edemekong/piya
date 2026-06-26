---
name: piya-verification-gate
description: Use before finalizing Piya code changes to choose and run the correct verification command, report skipped checks honestly, summarize touched areas, and avoid claiming tests or builds passed without evidence.
---

# Piya Verification Gate

Choose verification from the changed area and report it plainly.

## Choose Checks

- Web app, shared package, UI package, model/type/service/store changes:

```bash
cd web
pnpm -r typecheck
```

- Backend Firebase Functions changes:

```bash
cd server/functions
npm run build
```

- Agent guidance-only changes under `.agents` or `AGENTS.md`: validate metadata; app typecheck/build is optional unless code changed.

## Metadata Check

Use a local YAML parser if the official validator is missing dependencies. Check that:

- each `.agents/skills/*/SKILL.md` has frontmatter;
- skill frontmatter has only `name` and `description`;
- skill names are lowercase hyphen-case;
- each command has frontmatter with `description`.

## Final Report

- List verification commands that passed.
- Say exactly which checks were not run and why.
- Do not describe a check as passing if it was skipped, blocked, or failed.
