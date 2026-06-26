---
description: Validate local Piya .agents skills and command files for required metadata and expected structure.
---

# Validate Agent Guidance

## Preflight

- Confirm `.agents/skills` and `.agents/commands` exist.
- Treat files prefixed with `_` as non-invocable guidance if any are added later.

## Plan

Check skill frontmatter, command descriptions, and required command sections.

## Commands

```bash
find .agents/skills -name SKILL.md -print
find .agents/commands -name '*.md' -print
python3 /Users/pauljeremiah/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/shared-data-flow
python3 /Users/pauljeremiah/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/piya-design-system
python3 /Users/pauljeremiah/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/piya-state-management
python3 /Users/pauljeremiah/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/piya-api-service-writer
```

## Verification

Each skill must pass `quick_validate.py`. Each command should include YAML frontmatter with `description`.

## Summary

Report invalid files first, then list valid skills and commands.

## Next Steps

Fix metadata before relying on a skill or command in future work.
