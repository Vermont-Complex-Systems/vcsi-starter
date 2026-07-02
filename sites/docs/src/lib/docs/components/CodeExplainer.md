# CodeExplainer

A split-layout code walkthrough: a sticky, syntax-highlighted code block whose lines highlight as the reader scrolls through explanation steps.

**Category:** Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | `CodeExplainerData` | — | The code, language, optional filename, and the explanation steps |
| reversed | `boolean` | `false` | Put the code on the left, steps on the right |
| value | `number` | `undefined` | Active step index (bindable) |

## CodeExplainerData

```ts
{
  code: string;
  language?: string;   // e.g. "svelte", "js", "python"
  filename?: string;   // shown as a tab above the code
  steps: Array<{
    type: 'markdown' | 'html' | 'math' | 'code';
    value: string;
    highlightLines?: string;  // lines to highlight for this step, e.g. "2,3" or "13-24"
  }>;
}
```

Each step is a content item (`{ type, value }`) plus an optional `highlightLines`. As the reader reaches a step, that step's lines highlight in the code block.

## Usage

Keep the data in `copy.json` and pass it in:

```json
// copy.json
"walkthrough": {
  "code": "<script>\n  let count = $state(0);\n</script>\n\n<button onclick={() => count++}>{count}</button>",
  "language": "svelte",
  "filename": "Counter.svelte",
  "steps": [
    { "type": "markdown", "value": "Declare reactive state with `$state`.", "highlightLines": "2" },
    { "type": "markdown", "value": "The template re-renders when it changes.", "highlightLines": "5" }
  ]
}
```

```svelte
<script>
  import { CodeExplainer } from '@the-vcsi/scrolly-kit';
  let { data } = $props();
</script>

<CodeExplainer data={data.walkthrough} />
```

Add `reversed` to put the code on the left; `bind:value` if you need the active step index outside the component.

*(Used in the `baked` template's `scrolly-explainer` story.)*
