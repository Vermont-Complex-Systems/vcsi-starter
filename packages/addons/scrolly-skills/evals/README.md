# Skill evals

Test prompts for the scrolly-kit skill, following the skill-creator pattern. Each eval
captures either a real field failure (so it can never silently regress) or a guard
against over-correction. Run them whenever SKILL.md, the references, or the subagent
prompt change.

## How to run one

1. Scaffold a fresh throwaway project (the `simple` template) outside the monorepo's
   workspaces, e.g. `.eval/my-project/` (gitignored), and install the CURRENT skill
   source into `.claude/` (copy from `../src/skills/` and `../src/agents/`, the way
   the add-on would).
2. Give an agent the eval's `prompt`, restricted to the installed skill + the
   scrolly-kit MCP for library knowledge (no reading the monorepo).
3. Grade the transcript and outputs against the eval's `assertions`. The behavioral
   ones (asked before fetching, stayed small) are judged from the transcript; the
   mechanical ones (check passes, story prerenders, steps activate) are scripted:
   `npm run build` in the project plus a headless scroll probe.

Gaps found feed the docs first (the MCP serves them live), the skill only when a
durable principle is missing — see `.claude/rules/addon-authoring.md`.

## Updating installed skills in real projects

The skill files in a user project are a snapshot; npm never touches `.claude/`.
The refresh path is re-running `npx sv add @the-vcsi/scrolly-skills` (it prompts
before overwriting).
