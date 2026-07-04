# Roadmap to 0.1.0 (public share, ~August 2026)

**Principle: freeze features.** This month buys trust, not surface: honest versioning,
accessibility, documentation, and an AI layer rebuilt on stable docs.

**Sequencing:** engine + docs first; the skill and templates inherit from them. The MCP
is a thin pipe over the docs, so it maintains itself as long as the docs are true. The
skill is a snapshot installed into user projects, so it must be re-verified *last*,
against frozen docs.

## Phase 1: Engine (scrolly-kit 0.1.0)

- [ ] Feature freeze: bugfixes and accessibility only
- [ ] Accessibility pass
  - [x] `prefers-reduced-motion`: transition tokens collapse to 0ms + global reset rule
  - [x] Contrast audit: all token pairs measured; inactive steps fixed (light 4.75:1, dark palette reworked), `--vcsi-muted` dark flip added
  - [x] Keyboard + screen-reader check on the *hand-rolled* interactive components. Outcome: ThemeToggle announces state (dynamic label); NavMenu uses `inert` on `<main>` so Tab can't escape the open menu; Tooltip is a chart annotation box, not an interactive widget (its a11y note: hover-only chart data needs a text alternative — honest-limits page); the vanilla `.sidebar-toggle` gets `aria-expanded` in docs examples. (bits-ui builds — SimpleToggle/SimpleSelect/RangeSlider/ChartTooltip/Sidebar — inherit WAI-ARIA behavior.)
  - [ ] Write down honest limits (feeds the a11y page in Phase 2)
- [x] `CHANGELOG.md`: 0.1.0 fully recorded; semver from here on
- [x] Playwright smoke screenshots over the playground: 7 baselines (kitchen sink desktop light/dark + mobile, story desktop light/dark + mobile) plus a theme-isolation leak detector (story must render identically under global light and dark). `npm run test:visual` / `test:visual:update` in `packages/scrolly-kit`; baselines are Linux-specific.
- [x] Release 0.1.0 (published 2026-07-03)

## Phase 2: Docs at 0.1.0 quality

- [x] Sweep `components/*.md` against source: 13 files had drift, 5 documented nonexistent APIs; all fixed (agent-audited, verified)
- [x] Project-structure page: live at /docs/project-structure with MCP section (template anatomy, story contract, data flow, standalone usage)
- [x] "Outside the templates": done the strong way in 0.2.0 — package is fully SvelteKit-free (Meta moved template-local over svelte-meta-tags, MarkdownRenderer takes a `base` prop, scrollReveal uses `typeof window`; verified with a plain Vite build). Documented in project-structure
- [x] Template examples: all three templates check + build (prerender) on 0.1.0/0.2.0; tanstack pinned to the alpha the dashboard story targets. (Visual spot-check of docs claims: ongoing as docs pages are touched)
- [ ] "Why SvelteKit" manifesto: honest positioning vs Quarto/Closeread, Observable, and React stacks; lead with ownership + the agent-era thesis (craft encoded so agents inherit it)
- [ ] Accessibility page: what is handled, what is not, what scrollytelling can't fix
- [ ] `use_cases.json` audit: keywords match the final section list
- [ ] Surface the changelog on the docs site

## Phase 3: AI layer, rebuilt on stable docs

- [ ] Re-verify the skill (SKILL.md + references/) line-by-line against 0.1.0 docs
- [ ] Review the `scrolly-story-editor` subagent prompt
- [ ] End-to-end MCP check: `npx @the-vcsi/scrolly-mcp list-sections` against the live site, all sections fetchable
- [ ] Eval: an agent builds a story from scratch using only the skill + MCP; grade the output; feed the gaps back into docs, not the skill

## Phase 4: Templates + add-ons alignment

- [ ] `baked` / `simple` / `fresh`: pin `@the-vcsi/scrolly-kit` to `^0.2.0` (currently `"*"`, which hands degit users every future breaking release automatically), READMEs current (example verification moved to Phase 2)
- [ ] Template `AGENTS.md` consistent with the final skill/MCP split
- [ ] Re-test `msgraph` / `openalex` / `scrolly-skills` add-ons on a fresh scaffold

## Phase 5: Share prep

- [ ] Examples site link public and current
- [ ] Repo README as the landing page: pitch, quick start, the thesis
- [ ] Issue labels/triage ready for outside contributors

## Deliberately deferred

- Svelte Playground "try online" links (needs a published 0.1.0 anyway)
- `--vcsi-*` prefix rename (breaking, not worth it)
- Any new components or layouts
- Rebuild NavMenu on bits-ui Dialog (focus trap for free; precedent: dashboard drawer). Post-0.1.0 — the `inert` patch covers the gap for now.
