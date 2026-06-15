# Subagent

The `scrolly-skills` add-on installs a [Claude Code](https://claude.com/claude-code) subagent, **`scrolly-story-editor`**, into `.claude/agents/`. It is a specialized worker for building and editing scrollytelling stories with scrolly-kit, running in its own context window so the main agent stays focused.

## What it does

Delegate story work to it — creating or editing files under `src/lib/stories/{slug}/` (`Index.svelte`, `copy.json`, visualization components) or story routing. It follows a fixed workflow:

1. **Gather context** from the scrolly-kit MCP (`list-sections` → `get-documentation`) and the Svelte MCP.
2. **Scaffold** new stories with `npm run new-story <slug>`.
3. **Build** the story — `copy.json` content items, scrolly-kit components, and layout classes.
4. **Validate** — `svelte-autofixer` for Svelte 5 correctness, then `npm run check`.

## Install

```bash
npx sv add @the-vcsi/scrolly-skills
```

This writes `.claude/agents/scrolly-story-editor.md` alongside the scrolly-kit skill and the MCP config. Restart Claude Code (or approve the new MCP servers) afterward.

## A note on validation

Unlike the Svelte subagent, there is **no scrolly-kit-specific linter yet**. `svelte-autofixer` (from the Svelte MCP) checks the Svelte correctness of components, and `npm run check` catches type errors — but scrolly-kit-specific correctness (layout usage, `copy.json` shape) currently relies on the docs and a visual check with `npm run dev`.
