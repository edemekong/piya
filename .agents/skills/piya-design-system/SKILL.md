---
name: piya-design-system
description: Use when building or changing Piya web UI, admin or portal screens, reusable UI components, cards, buttons, icons, sheets, form controls, app text, theme tokens, typography, spacing, colors, Tailwind classes, or visual consistency.
---

# Piya Design System

Use the existing UI package and app tokens before adding custom styling.

## Source Files

- Theme source: `web/packages/ui/src/theme/{colors,typography,spacing,theme}.ts`.
- Tailwind token mapping: `web/apps/admin/tailwind.config.ts` and `web/apps/portal/tailwind.config.ts`.
- Shared styles: `web/packages/ui/src/styles.css`, `web/apps/admin/app/styles.css`, `web/apps/portal/app/styles.css`.
- Reusable components: `web/packages/ui/src/components`.
- Icons: use `lucide-react` where an icon exists.

## UI Rules

- Prefer components exported from `@piya/ui`: `Button`, `AppIconButton`, `AppText`, `AppSheet`, cards, badges, form fields, tabs, empty states, and section headers.
- Use semantic Tailwind tokens such as `bg-background`, `bg-white`, `text-[#2F4B4F]` only where current components still use that color directly, `border-border`, `bg-fill`, `text-callout`, `text-title-1`, `gap-element`, `p-card`, and `rounded-md`.
- Use `AppText` or tokenized text classes for typography. Do not introduce viewport-scaled font sizes or negative letter spacing.
- Use `Button` with the `icon` prop for primary commands and `AppIconButton` for icon-only commands with an accessible label.
- Keep cards simple: `rounded-md`, `border border-border`, `bg-white`, `p-4`/`p-6`, and no nested card shells.
- Use sheets for create/edit/detail flows through `AppSheet`; keep sheet open/selected state local to the page.
- Keep layouts dense and operational for admin workflows. Avoid marketing hero layouts for app screens.

## Before Editing

Inspect a nearby page and any reusable component you plan to use. Match its spacing, text hierarchy, icon sizing, and responsive behavior.

## Verification

After UI changes under `web/apps` or `web/packages/ui`, run:

```bash
cd web
pnpm -r typecheck
```
