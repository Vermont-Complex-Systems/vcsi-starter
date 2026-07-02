---
paths:
  - "packages/addons/**"
---

# Add-on authoring

Add-ons are Svelte CLI integrations installed via `npx sv add @the-vcsi/{name}`. Each lives in `packages/addons/{name}/`.

## Pattern

```javascript
import { defineAddon, defineAddonOptions } from 'sv';

const options = defineAddonOptions()
  .add('optionName', { question: 'Prompt?', type: 'string' })
  .build();

export default defineAddon({
  id: '@the-vcsi/addon-name',
  options,
  run: ({ sv, options: opts }) => {
    sv.file('path/to/file.js', () => TEMPLATE);
    sv.file('package.json', (content) => {
      const pkg = JSON.parse(content);
      pkg.scripts['my-script'] = 'node scripts/my-script.js';
      return JSON.stringify(pkg, null, 2);
    });
  }
});
```

## Existing add-ons

| Add-on | Install arg | Creates | npm script |
|--------|-------------|---------|------------|
| `@the-vcsi/msgraph` | `=siteId:...` | `scripts/fetch-msgraph.js`, `src/appSettings.js`, `.env.example` | `fetch:sharepoint` |
| `@the-vcsi/openalex` | `=email:...` | `scripts/populate-openalex-db.js`, appends tables to `src/lib/server/db/schema.ts`; depends on `drizzle` (auto-triggered) | `db:populate-openalex` |
| `@the-vcsi/scrolly-skills` | — | `.claude/skills/scrolly-kit/` (SKILL.md + `references/`), `.claude/agents/scrolly-story-editor.md`, `.mcp.json` (scrolly-kit + Svelte MCP) | — |

User-facing docs for msgraph/openalex live in `sites/docs/src/lib/docs/extensions/`.

## AI-layer split (avoid drift)

Content is split by how often it changes, so the skill no longer duplicates the exhaustive API docs:

- **Skill** (`SKILL.md` + `references/`) = durable *craft* — principles inline, deep-dives (`reactive-index.md`, `copy-json.md`, `layouts.md`) in `references/`. Rarely changes.
- **Docs site → MCP** (`sites/docs/src/lib/docs/` → `@the-vcsi/scrolly-mcp`) = exhaustive *API* — every component's props, the full `--vcsi-*` token catalog, CSS-var lists. Volatile; the skill points here (`list-sections` → `get-documentation`) rather than copying it.

So when you add/change a component or token, update the **docs site** (the MCP serves it live). Only touch the skill when a durable *principle or pattern* changes. Source-of-truth chain: docs site → MCP → (skill points to it).
