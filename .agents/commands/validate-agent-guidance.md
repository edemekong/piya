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
node -e "const fs=require('fs'); const yaml=require('./web/node_modules/js-yaml'); const skillFiles=fs.readdirSync('.agents/skills').flatMap(d=>{const f='.agents/skills/'+d+'/SKILL.md'; return fs.existsSync(f)?[f]:[]}); for (const file of skillFiles) { const text=fs.readFileSync(file,'utf8'); const m=text.match(/^---\\n([\\s\\S]*?)\\n---\\n/); if(!m) throw new Error(file+' missing frontmatter'); const data=yaml.load(m[1]); const keys=Object.keys(data||{}); if(!data.name || !data.description) throw new Error(file+' missing name/description'); const extra=keys.filter(k=>!['name','description'].includes(k)); if(extra.length) throw new Error(file+' has extra frontmatter keys: '+extra.join(',')); if(!/^[a-z0-9-]+$/.test(data.name)) throw new Error(file+' invalid skill name '+data.name); console.log('valid skill', data.name); } const commands=fs.readdirSync('.agents/commands').filter(f=>f.endsWith('.md')&&!f.startsWith('_')); for (const f of commands) { const file='.agents/commands/'+f; const text=fs.readFileSync(file,'utf8'); const m=text.match(/^---\\n([\\s\\S]*?)\\n---\\n/); if(!m) throw new Error(file+' missing frontmatter'); const data=yaml.load(m[1]); if(!data.description) throw new Error(file+' missing description'); console.log('valid command', f); }"
```

## Verification

Each skill must have `name` and `description` frontmatter only. Each command should include YAML frontmatter with `description`.

## Summary

Report invalid files first, then list valid skills and commands.

## Next Steps

Fix metadata before relying on a skill or command in future work.
