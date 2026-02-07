
## Non-standard features

### [Route group](https://svelte.dev/tutorial/kit/route-groups)

This template static website is meant to host interactive stories which the styling is maximally controlled by the author. That is, the global styling should leak as little as possible into a story.

To do so, we are using [Route group](https://svelte.dev/tutorial/kit/route-groups) where we distinguish the "common" layout (Home, About, etc)  from the `(app)` layout. Hence, the users is in charge of all the styling of its story, to the exception of the Footer. We provide the Footer as default and users need to overwrite globally if they want to modify it, but it is crucial to scope it 

```js
// src/lib/stories/thematic-story-1.svelte
:global(body:has(.landing-page)) :global(.footer) {
    background-color: var(--story-bg);
    border-top-color: var(--story-border);
}
```

### ScrollyContent Component

The `ScrollyContent` component provides scrollytelling functionality with full styling control via CSS custom properties. This keeps the component self-contained while allowing per-story customization.

#### Basic Usage

```svelte
<script>
    import ScrollyContent from '$lib/components/helpers/ScrollyContent.svelte';
    let scrollyIndex = $state(undefined);
</script>

<ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
```

#### Customizing with CSS Variables

Set variables on a parent container to override defaults:

```svelte
<div class="stepContainer">
    <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
</div>

<style>
.stepContainer {
    --step-height: 60vh;
    --story-step-bg: transparent;
    --story-step-bg-inactive: transparent;
    --step-box-shadow: none;
}
</style>
```

#### Available CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--scrolly-max-width` | `800px` | Max width of scrolly container |
| `--scrolly-pointer-events` | `auto` | Pointer events on container (set to `none` for fullscreen layouts) |
| `--spacer-height` | `65vh` | Height of top/bottom spacers |
| `--step-height` | `90vh` | Min height of each step (controls scroll distance between steps) |
| `--step-max-width` | `600px` | Max width of step content boxes |
| `--step-padding` | `1rem` | Padding inside step boxes |
| `--step-border-radius` | `5px` | Border radius of step boxes |
| `--step-box-shadow` | `1px 1px 10px rgba(0,0,0,0.2)` | Box shadow on step boxes |
| `--story-step-bg` | (from app.css) | Active step background |
| `--story-step-fg` | (from app.css) | Active step text color |
| `--story-step-bg-inactive` | (from app.css) | Inactive step background |
| `--story-step-fg-inactive` | (from app.css) | Inactive step text color |

#### Layout Patterns

Two layout patterns are provided in `app.css`:

- **`.scrolly-with-chart`** — Side-by-side layout (text left, chart right)
- **`.scrolly-fullscreen`** — Full-viewport chart with text overlay

These patterns set appropriate CSS variables for their use case. For example, `.scrolly-fullscreen` sets `--scrolly-pointer-events: none` so mouse events pass through to the chart behind.

