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
- [ ] "Why SvelteKit" manifesto: DRAFT live at /docs/why-sveltekit (positioning vs Quarto/Closeread/Observable/React, ownership + agent-era thesis, honest when-not-to-use). Remaining: Jonathan's voice pass
- [ ] Accessibility page: what is handled, what is not, what scrollytelling can't fix
- [x] `use_cases.json` audit: bidirectional coverage verified clean; kept current with every section change
- [x] Changelog surfaced: /docs/changelog imports the package CHANGELOG (single source), MCP section + llms.txt, nav version badge links to it

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

- Svelte Playground "try online" links. Tried on 0.2.1: bundling works (and found the undeclared-lucide bug), but runtime dies in the sandboxed iframe because mode-watcher reads localStorage unguarded at module init via the barrel. Unblock post-share: subpath exports (import Scrolly without the barrel) or an upstream mode-watcher PR guarding localStorage. `examples/vite-minimal` is the canonical no-SvelteKit proof meanwhile.
- `--vcsi-*` prefix rename (breaking, not worth it)
- Any new components or layouts
- 0.3.0 "engine vs chrome" audit: decide Nav/NavMenu/Footer/ThemeToggle as a family (engine or template-local, precedent: Meta). Their VCSI-specific defaults and the barrel pulling mode-watcher all point the same way; do it as one coherent decision, not piecemeal. (Includes: rebuild NavMenu on bits-ui Dialog; subpath exports so demos can import without the barrel.)
- Upstream mode-watcher PR: guard its localStorage reads (throws in any sandboxed iframe, e.g. the Svelte Playground preview). This is the actual playground blocker.
- Replace lucide brand icons in Footer (Youtube/Github/…) with inline SVGs: lucide 1.x removed them, which pins our `@lucide/svelte` range below 1.0.
- Evaluate `vercel-labs/skills` (`npx skills add/update`) as a skill *update* channel. Its `skills update` solves exactly the stale-snapshot pain (npm never touches `.claude/`; today's answer is re-running `npx sv add`), and it would open the skill to Cursor/Copilot users. It can't replace `sv add` as the installer: it ships only the skill folder, not `.mcp.json` or the subagent, and the skill leans on the MCP. First experiment: does its discovery find `packages/addons/scrolly-skills/src/skills/scrolly-kit/` in this repo, or does it need a path argument / top-level `skills/` alias? Note installs from git track `main`, decoupled from npm releases (consistent with the MCP serving docs live from `main`).
