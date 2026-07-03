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
  - [ ] `prefers-reduced-motion`: gate transitions/tweens (step reveals, sidebar, theme fade)
  - [ ] Contrast audit: step boxes over visuals; inactive step text (`#ccc` on `#f5f5f5` likely fails WCAG)
  - [x] Keyboard + screen-reader check on the *hand-rolled* interactive components. Outcome: ThemeToggle announces state (dynamic label); NavMenu uses `inert` on `<main>` so Tab can't escape the open menu; Tooltip is a chart annotation box, not an interactive widget (its a11y note: hover-only chart data needs a text alternative — honest-limits page); the vanilla `.sidebar-toggle` gets `aria-expanded` in docs examples. (bits-ui builds — SimpleToggle/SimpleSelect/RangeSlider/ChartTooltip/Sidebar — inherit WAI-ARIA behavior.)
  - [ ] Write down honest limits (feeds the a11y page in Phase 2)
- [ ] `CHANGELOG.md`: record the 0.0.x → 0.1.0 changes (p unpinning, table defaults, body-layout split, new tokens) and adopt semver discipline from here on
- [x] Playwright smoke screenshots over the playground: 7 baselines (kitchen sink desktop light/dark + mobile, story desktop light/dark + mobile) plus a theme-isolation leak detector (story must render identically under global light and dark). `npm run test:visual` / `test:visual:update` in `packages/scrolly-kit`; baselines are Linux-specific.
- [ ] Release 0.1.0 (publish: Jonathan)

## Phase 2: Docs at 0.1.0 quality

- [ ] Sweep `components/*.md` against component source: props, defaults, CSS vars (drift check)
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

- [ ] `baked` / `simple` / `fresh`: bump to 0.1.0, verify every example story renders, READMEs current
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
