# Fresh Template "Dynamic Simple" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape `templates/fresh` to mirror `templates/simple`'s lean shell and generic `example-story-1`, keeping only the dynamic backend (adapter-node + `query()`), so fresh is a clean "dynamic version of simple."

**Architecture:** Mostly subtractive. Adopt simple's shell files verbatim where they differ, copy simple's example story, delete fresh-only bloat (live-API dashboard, hero animation, extra route), and prune the now-unused dependencies. The dynamic config files (`package.json` adapter, `svelte.config.js`, `story.remote.ts`) stay as fresh's.

**Tech Stack:** SvelteKit 2, Svelte 5, `@sveltejs/adapter-node`, `@the-vcsi/scrolly-kit`, d3, valibot.

**Verification model:** Template files have no unit tests. "Tests" here are: `grep` for dangling references, `npm run check` (svelte-check, 0 errors), and `npm run build` (adapter-node succeeds). The `@the-vcsi/scrolly-kit` package must be built once before `npm run check` resolves its types.

**Reference spec:** `docs/superpowers/specs/2026-06-13-fresh-template-dynamic-simple-design.md`

**Working directory for all paths below:** `templates/fresh/` unless stated otherwise. All commands are run from `templates/fresh/` unless they cd elsewhere.

**Decisions locked from spec review:**
- Keep fresh's enhanced `StoryGrid.svelte` (level grouping). Do NOT downgrade to simple's flat grid.
- Final fresh dependency set equals simple's exactly (drop `@tanstack/svelte-query`, `@tanstack/svelte-table`, `svelteplot`).

---

## File Structure (end state)

After this plan, `templates/fresh/src` equals `templates/simple/src` **except**:

- `package.json` / `svelte.config.js` — adapter-node, no prerender entries (unchanged from current fresh).
- `src/lib/story.remote.ts` — uses `query()` not `prerender()` (unchanged from current fresh).
- `src/lib/components/StoryGrid.svelte` — fresh's enhanced level-grouping version (unchanged from current fresh).

Files **deleted** from fresh:
- `src/lib/stories/dashboard-1/` (entire directory)
- `src/lib/components/DotsToImage.svelte`
- `src/lib/components/Home.RemoteFnsExplainer.svelte`
- `src/lib/data/vlog.csv`
- `src/routes/(app)/getting-started/` (entire directory)

Files **adopted from simple** (overwritten):
- `src/lib/components/Home.svelte` (then dead CSS rule removed)
- `src/lib/styles/app.css`
- `src/routes/+layout.svelte`
- `src/routes/(app)/+layout.svelte`
- `src/lib/data/stories.csv`
- `src/lib/stories/example-story-1/` (entire directory, copied in)

---

## Task 1: Adopt simple's shell (Home, app.css, both layouts)

This removes every *code* reference to `DotsToImage`, `Home.RemoteFnsExplainer`,
`@tanstack/svelte-query`, and the `/getting-started` nav link in one coherent commit.

**Files:**
- Overwrite: `src/lib/components/Home.svelte` (from simple, then edit)
- Overwrite: `src/lib/styles/app.css` (from simple)
- Overwrite: `src/routes/+layout.svelte` (from simple)
- Overwrite: `src/routes/(app)/+layout.svelte` (from simple)

- [ ] **Step 1: Copy simple's shell files over fresh's**

Run (from repo root `/users/j/s/jstonge1/vcsi-starter`):

```bash
cp templates/simple/src/lib/components/Home.svelte templates/fresh/src/lib/components/Home.svelte
cp templates/simple/src/lib/styles/app.css        templates/fresh/src/lib/styles/app.css
cp templates/simple/src/routes/+layout.svelte      templates/fresh/src/routes/+layout.svelte
cp "templates/simple/src/routes/(app)/+layout.svelte" "templates/fresh/src/routes/(app)/+layout.svelte"
```

- [ ] **Step 2: Remove the dead `DotsToImage` CSS rule from the copied Home.svelte**

Edit `templates/fresh/src/lib/components/Home.svelte`. Delete this block (simple ships it,
but `DotsToImage` is a component name, not a selector, so the rule matches nothing):

```css
/* Make DotsToImage grow to fill space */
.hero-inner > :global(DotsToImage) {
  flex: 1;
  height: 50%;
}
```

- [ ] **Step 3: Verify no code references to the about-to-be-deleted items remain**

Run (from `templates/fresh/`):

```bash
grep -rn "DotsToImage\|RemoteFnsExplainer\|svelte-query" src
```

Expected: **no output** (exit 1). If any line prints, fix that file before continuing.
(Do not grep for `getting-started` here: the route's own files still exist on disk and
may contain that string in their content; the inbound nav link was removed by adopting
simple's `(app)/+layout.svelte`. The route directory itself is deleted in Task 3, and the
global `getting-started` sweep runs in Task 5. `src/lib/data/vlog.csv` likewise still
exists but is now unreferenced; it is deleted in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add templates/fresh/src/lib/components/Home.svelte \
        templates/fresh/src/lib/styles/app.css \
        templates/fresh/src/routes/+layout.svelte \
        "templates/fresh/src/routes/(app)/+layout.svelte"
git commit -m "refactor(fresh): adopt simple's lean shell (Home, app.css, layouts)"
```

---

## Task 2: Replace the example story (drop dashboard-1, add example-story-1)

**Files:**
- Delete: `src/lib/stories/dashboard-1/` (entire directory)
- Create: `src/lib/stories/example-story-1/` (copied from simple)
- Overwrite: `src/lib/data/stories.csv` (from simple)

- [ ] **Step 1: Delete the dashboard story and copy in simple's example story**

Run (from repo root `/users/j/s/jstonge1/vcsi-starter`):

```bash
git rm -r templates/fresh/src/lib/stories/dashboard-1
cp -r templates/simple/src/lib/stories/example-story-1 templates/fresh/src/lib/stories/example-story-1
cp templates/simple/src/lib/data/stories.csv templates/fresh/src/lib/data/stories.csv
```

- [ ] **Step 2: Verify the new story's imports resolve to things fresh has**

Run (from `templates/fresh/`):

```bash
grep -rnE "^\s*import" src/lib/stories/example-story-1/components/
```

Expected imports (all available in fresh): `@the-vcsi/scrolly-kit`,
`$lib/components/helpers/BackToHome.svelte`, `./ScrollyPlot.svelte`, `d3`,
`../data/data.csv`. No reference to `svelteplot`, `@tanstack/*`, or `dashboard-1`.

- [ ] **Step 3: Verify no dangling dashboard references**

Run (from `templates/fresh/`):

```bash
grep -rn "dashboard-1\|academic.remote\|svelte-table" src
```

Expected: **no output** (exit 1).

- [ ] **Step 4: Commit**

```bash
git add templates/fresh/src/lib/stories/example-story-1 templates/fresh/src/lib/data/stories.csv
git commit -m "refactor(fresh): replace live-API dashboard with simple's example-story-1"
```

---

## Task 3: Delete orphaned components, data, and route

Everything here is now unreferenced (verified in Tasks 1–2).

**Files:**
- Delete: `src/lib/components/DotsToImage.svelte`
- Delete: `src/lib/components/Home.RemoteFnsExplainer.svelte`
- Delete: `src/lib/data/vlog.csv`
- Delete: `src/routes/(app)/getting-started/` (entire directory)

- [ ] **Step 1: Remove the orphaned files**

Run (from repo root `/users/j/s/jstonge1/vcsi-starter`):

```bash
git rm templates/fresh/src/lib/components/DotsToImage.svelte \
       templates/fresh/src/lib/components/Home.RemoteFnsExplainer.svelte \
       templates/fresh/src/lib/data/vlog.csv
git rm -r "templates/fresh/src/routes/(app)/getting-started"
```

- [ ] **Step 2: Verify fresh's tree now matches simple's (minus intended differences)**

Run (from `templates/`):

```bash
diff <(cd fresh && find src -type f | sort) <(cd simple && find src -type f | sort)
```

Expected: **no output** — the two `src` file trees are now identical. (They differ only
in file *contents* for the dynamic files: `story.remote.ts`, and `StoryGrid.svelte`; the
set of files is the same.) If `DotsToImage`, `Home.RemoteFnsExplainer`, `vlog.csv`,
`dashboard-1/`, or `getting-started/` still appears under fresh, investigate.

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor(fresh): delete orphaned hero/explainer components, vlog, getting-started route"
```

---

## Task 4: Prune dependencies and vite config

Align fresh's dependency set to simple's exactly, and drop the now-unused `optimizeDeps`
block (only `@tanstack/svelte-table` lived there).

**Files:**
- Modify: `package.json` (dependencies block)
- Overwrite: `vite.config.ts` (from simple)

- [ ] **Step 1: Edit `package.json` dependencies**

In `templates/fresh/package.json`, replace the `"dependencies"` block so it reads exactly:

```json
  "dependencies": {
    "@lucide/svelte": "^0.562.0",
    "@rollup/plugin-dsv": "^3.0.5",
    "@the-vcsi/scrolly-kit": "*",
    "d3": "^7.9.0",
    "mode-watcher": "^1.1.0",
    "valibot": "^1.2.0"
  }
```

(This removes `@tanstack/svelte-query`, `@tanstack/svelte-table`, and `svelteplot`.
Leave `"name": "scrolly-template-fresh"`, the `scripts` block with `"preview": "node build"`,
and the `devDependencies` with `@sveltejs/adapter-node` untouched.)

- [ ] **Step 2: Replace `vite.config.ts` with simple's (drops the optimizeDeps block)**

Run (from repo root `/users/j/s/jstonge1/vcsi-starter`):

```bash
cp templates/simple/vite.config.ts templates/fresh/vite.config.ts
```

Resulting `templates/fresh/vite.config.ts` should be exactly:

```ts
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dsv from "@rollup/plugin-dsv";

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		dsv({
			processRow: (row) => {
				Object.keys(row).forEach((key) => {
					const value = row[key];
					// @ts-ignore - intentionally converting numeric strings to numbers
					row[key] = isNaN(+value) ? value : +value;
				});
			}
		})
	]
});
```

- [ ] **Step 3: Reinstall to update the lockfile, then verify deps match simple**

Run (from repo root `/users/j/s/jstonge1/vcsi-starter`):

```bash
npm install
diff <(sed -n '/"dependencies"/,/}/p' templates/fresh/package.json) \
     <(sed -n '/"dependencies"/,/}/p' templates/simple/package.json)
```

Expected dependency diff: **no output** (fresh deps now equal simple deps).

- [ ] **Step 4: Commit**

```bash
git add templates/fresh/package.json templates/fresh/vite.config.ts package-lock.json
git commit -m "chore(fresh): prune unused deps (svelte-query, svelte-table, svelteplot)"
```

---

## Task 5: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Build the scrolly-kit package (so fresh's type imports resolve)**

Run (from repo root):

```bash
cd packages/scrolly-kit && npm run package
```

Expected: ends with `src/lib -> dist` and no errors.

- [ ] **Step 2: Typecheck fresh**

Run (from repo root):

```bash
cd templates/fresh && npm run check
```

Expected: `svelte-check` reports `0 errors` (warnings, if any, are acceptable —
note them but they do not block).

- [ ] **Step 3: Production build with adapter-node**

Run (from `templates/fresh/`):

```bash
npm run build
```

Expected: build succeeds and prints `Using @sveltejs/adapter-node` / `Wrote site to "build"`.
(If it fails with `Cannot find module @rollup/rollup-linux-x64-gnu` or a `sharp` module
error, that is the known npm optional-deps bug, not a plan defect: run
`npm install --no-save @rollup/rollup-linux-x64-gnu @img/sharp-linux-x64` from repo root,
then retry — and do NOT commit the resulting lockfile churn.)

- [ ] **Step 4: Final dangling-reference sweep**

Run (from `templates/fresh/`):

```bash
grep -rn "DotsToImage\|RemoteFnsExplainer\|svelte-query\|svelte-table\|svelteplot\|dashboard-1\|getting-started\|vlog" src package.json vite.config.ts
```

Expected: **no output** (exit 1).

- [ ] **Step 5: Smoke-test new-story still works, then clean up**

Run (from `templates/fresh/`):

```bash
npm run new-story plan-smoke-test
ls src/lib/stories/plan-smoke-test/components src/lib/stories/plan-smoke-test/data
rm -rf src/lib/stories/plan-smoke-test
git checkout -- src/lib/data/stories.csv
```

Expected: the story scaffold is created (Index.svelte, ScrollyPlot.svelte, copy.json,
data.csv) and then removed, leaving `git status` clean for `templates/fresh`.

- [ ] **Step 6: Final commit (if any verification fixups were made)**

```bash
git add -A templates/fresh
git commit -m "test(fresh): verify dynamic-simple reshape builds and typechecks" || echo "nothing to commit"
```
