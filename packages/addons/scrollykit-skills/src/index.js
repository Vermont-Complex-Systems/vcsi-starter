import { defineAddon, defineAddonOptions } from 'sv';

const SCROLLY_KIT_SKILL = `---
name: scrolly-kit
description: Use when building scrollytelling stories, working with split/fullscreen/triple/dashboard layouts, ScrollyContent steps, copy.json content, VCSI CSS variables, or story theming in a SvelteKit project using @the-vcsi/scrolly-kit
---

## Quick start

See [SKILL.md](node_modules/@the-vcsi/scrolly-kit/skills/scrolly-kit-core/SKILL.md) for the full guide.

## Reference

- **Component API**: See [COMPONENTS.md](node_modules/@the-vcsi/scrolly-kit/skills/scrolly-kit-core/COMPONENTS.md)
- **Layout system**: See [LAYOUTS.md](node_modules/@the-vcsi/scrolly-kit/skills/scrolly-kit-core/LAYOUTS.md)
- **Story patterns**: See [PATTERNS.md](node_modules/@the-vcsi/scrolly-kit/skills/scrolly-kit-core/PATTERNS.md)
`;

const SVELTE_CODE_WRITER_SKILL = `---
name: svelte-code-writer
description: CLI tools for Svelte 5 documentation lookup and code analysis. MUST be used whenever creating, editing or analyzing any Svelte component (.svelte) or Svelte module (.svelte.ts/.svelte.js). If possible, this skill should be executed within the svelte-file-editor agent for optimal results.
---

See [SKILL.md](node_modules/@the-vcsi/scrolly-kit/skills/svelte-code-writer/SKILL.md) for the full guide.
`;

const SVELTE_BESTPRACTICES_SKILL = `---
name: svelte-core-bestpractices
description: Guidance on writing fast, robust, modern Svelte code. Load this skill whenever in a Svelte project and asked to write/edit or analyze a Svelte component or module. Covers reactivity, event handling, styling, integration with libraries and more.
---

See [SKILL.md](node_modules/@the-vcsi/scrolly-kit/skills/svelte-core-bestpractices/SKILL.md) for the full guide.

Reference files: See [references/](node_modules/@the-vcsi/scrolly-kit/skills/svelte-core-bestpractices/references/) for detailed docs on \`$state\`, \`$inspect\`, \`@attach\`, \`@render\`, \`bind\`, \`each\`, snippets, and more.
`;

const options = defineAddonOptions().build();

export default defineAddon({
  id: '@the-vcsi/scrollykit-skills',
  shortDescription: 'Claude Code skills for scrolly-kit and Svelte 5',
  options,

  run: ({ sv }) => {
    sv.file('.claude/skills/scrolly-kit/SKILL.md', (content) => {
      if (content) return content;
      return SCROLLY_KIT_SKILL;
    });

    sv.file('.claude/skills/svelte-code-writer/SKILL.md', (content) => {
      if (content) return content;
      return SVELTE_CODE_WRITER_SKILL;
    });

    sv.file('.claude/skills/svelte-core-bestpractices/SKILL.md', (content) => {
      if (content) return content;
      return SVELTE_BESTPRACTICES_SKILL;
    });

  },

  nextSteps: () => [
    'Skills are now available to Claude Code',
    'Claude will auto-detect when to use them based on your requests',
    'No manual setup needed — just ask Claude to build a story'
  ]
});
