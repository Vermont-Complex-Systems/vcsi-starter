You have access to the scrolly-kit MCP server (`@the-vcsi/scrolly-mcp`) for documentation about `@the-vcsi/scrolly-kit` -- a CSS framework and component library for scrollytelling stories in SvelteKit.

## Available MCP Tools

### 1. list-sections

Use this FIRST to discover available documentation sections. Returns titles, use_cases, and paths.
When asked about scrolly-kit topics, ALWAYS call this tool first to find relevant sections.

### 2. get-documentation

Retrieves full documentation for specific sections. Accepts section slugs or titles.
After calling list-sections, analyze the use_cases and fetch ALL sections relevant to the user's task.

## When to use which MCP

- **scrolly-kit MCP** -- scrolly-kit components, CSS layouts, story patterns, extensions
- **Svelte MCP** (`@sveltejs/mcp`) -- Svelte 5 runes, reactivity, SvelteKit routing, general Svelte questions
