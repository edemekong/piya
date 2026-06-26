---
description: Inspect Piya web design-system tokens, reusable UI components, and app-level Tailwind mappings before UI work.
---

# Inspect Design System

## Preflight

- Confirm the repo root contains `web/packages/ui` and `web/apps/admin`.
- Check nearby feature files before changing UI.

## Plan

Read the relevant token, component, and page files, then summarize the existing visual pattern to follow.

## Commands

```bash
sed -n '1,260p' web/packages/ui/src/theme/colors.ts
sed -n '1,260p' web/packages/ui/src/theme/typography.ts
sed -n '1,220p' web/packages/ui/src/theme/spacing.ts
sed -n '1,320p' web/apps/admin/tailwind.config.ts
rg --files web/packages/ui/src/components
```

## Verification

For any implemented UI change, run:

```bash
cd web
pnpm -r typecheck
```

## Summary

Report the tokens/components to use and any mismatches found.

## Next Steps

Apply the smallest UI change using `@piya/ui` components and tokenized Tailwind classes.
