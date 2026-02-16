# Scrollytelling Template (Full)

A complete scrollytelling template with example stories.

## Getting Started

```bash
npm install
npm run dev
```

## Structure

```
src/
├── lib/
│   ├── stories/          # Your stories live here
│   │   └── my-story/
│   │       ├── components/
│   │       │   └── Index.svelte
│   │       └── data/
│   │           └── copy.json
│   └── components/       # Shared components
├── routes/               # SvelteKit routes
├── data/
│   ├── stories.csv       # Story metadata for routing
│   └── members.csv       # Team member data
└── styles/
    └── app.css           # Your customizations
```

## Adding a Story

1. Create folder: `src/lib/stories/my-new-story/`
2. Add `components/Index.svelte` and `data/copy.json`
3. Add entry to `src/data/stories.csv`
4. Run `npm run dev`

## Customization

Edit `src/styles/app.css` to override CSS variables.

## Build

```bash
npm run build    # Generate static site in build/
npm run preview  # Preview production build
```
