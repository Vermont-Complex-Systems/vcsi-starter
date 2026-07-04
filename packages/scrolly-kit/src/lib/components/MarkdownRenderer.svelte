<!--
@component
Markdown renderer with KaTeX math and syntax highlighting.

Supports GitHub Flavored Markdown, LaTeX math ($...$, $$...$$),
raw HTML in markdown, and code blocks with syntax highlighting.

## Props
- `text` - Markdown string to render

## Usage
```svelte
<MarkdownRenderer text="## Hello\n\nThis is **bold** and $E = mc^2$" />
```

## Supported features
- GFM (tables, strikethrough, autolinks)
- KaTeX math (inline and block)
- Code highlighting (js, ts, css, html/xml, svelte, r, bash)
- Raw HTML inside markdown (via rehype-raw)
-->
<script module lang="ts">
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import rehypeKatex from 'rehype-katex';
    import remarkMath from 'remark-math';
    import rehypeRaw from 'rehype-raw';
    import rehypeHighlight from 'rehype-highlight';
    import rehypeHighlightCodeLines from 'rehype-highlight-code-lines';

    import css from 'highlight.js/lib/languages/css';
    import xml from 'highlight.js/lib/languages/xml';
    import R from 'highlight.js/lib/languages/r';
    import JS from 'highlight.js/lib/languages/javascript';
    import TS from 'highlight.js/lib/languages/typescript';
    import bash from 'highlight.js/lib/languages/bash';

    // Built once per module load and shared by every MarkdownRenderer instance.
    // `any[]` because svelte-exmarkdown's plugin type is a complex intersection.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plugins: any[] = [
        gfmPlugin(),
        { remarkPlugin: [remarkMath], rehypePlugin: [rehypeKatex] },
        { rehypePlugin: [rehypeRaw] },
        {
            rehypePlugin: [
                rehypeHighlight,
                {
                    ignoreMissing: true,
                    languages: {
                        css,
                        html: xml,
                        xml,
                        r: R,
                        svelte: xml,
                        js: JS,
                        typescript: TS,
                        ts: TS,
                        bash,
                        shell: bash
                    }
                }
            ]
        },
        { rehypePlugin: [rehypeHighlightCodeLines, { showLineNumbers: true }] }
    ];
</script>

<script lang="ts">
    import Markdown from 'svelte-exmarkdown';
    import 'katex/dist/katex.min.css';
    import 'highlight.js/styles/github.css';

    interface Props {
        text: string;
        /** Base path prepended to absolute /links and /images in the markdown.
         *  Only needed on subpath deploys (e.g. GitHub Pages under /repo):
         *  pass SvelteKit's `base` from `$app/paths`. */
        base?: string;
    }

    let { text, base = '' }: Props = $props();

    function processContent(content: string): string {
        if (!content) return '';

        // Strip footnote markers like [^1]
        content = content.replace(/\[\^(\d+)\]/g, '');

        // Trim leading whitespace on non-code lines, leave code blocks alone.
        const parts = content.split(/(```[\s\S]*?```|<pre[\s\S]*?<\/pre>)/);
        content = parts
            .map((part, i) => (i % 2 === 0 ? part.replace(/^[ \t]+/gm, '') : part))
            .join('');

        // Rewrite absolute /foo links and images to respect SvelteKit's base path.
        content = content.replace(/(src|href)="\/([^"]*?)"/g, `$1="${base}/$2"`);

        return content;
    }
</script>

<Markdown md={processContent(text)} {plugins} />
