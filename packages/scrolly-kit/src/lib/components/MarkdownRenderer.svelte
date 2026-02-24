<!--
@component
Markdown renderer with KaTeX math and syntax highlighting.

Supports GitHub Flavored Markdown, LaTeX math ($...$, $$...$$),
and code blocks with syntax highlighting.

## Props
- `text` - Markdown string to render

## Usage
```svelte
<MarkdownRenderer text="## Hello\n\nThis is **bold** and $E = mc^2$" />
```

## Supported Features
- GFM (tables, strikethrough, autolinks)
- KaTeX math (inline and block)
- Code highlighting (JS, CSS, R, HTML)
-->
<script lang="ts">
    import Markdown from 'svelte-exmarkdown';
    import { gfmPlugin } from 'svelte-exmarkdown/gfm';
    import 'katex/dist/katex.min.css';
    import rehypeKatex from 'rehype-katex';
    import remarkMath from 'remark-math';
    import rehypeRaw from 'rehype-raw';
    import rehypeHighlight from 'rehype-highlight';
    import rehypeHighlightCodeLines from 'rehype-highlight-code-lines';
    import 'highlight.js/styles/github.css';
    import { base } from '$app/paths';

    import css from 'highlight.js/lib/languages/css';
    import xml from 'highlight.js/lib/languages/xml';
    import R from 'highlight.js/lib/languages/r';
    import JS from 'highlight.js/lib/languages/javascript';
    import TS from 'highlight.js/lib/languages/typescript';
    import bash from 'highlight.js/lib/languages/bash';

    interface Props {
        text: string;
    }

    let { text }: Props = $props();

    // Using 'as any' due to complex plugin typing in svelte-exmarkdown
    const plugins = [
        gfmPlugin(),
        {
            remarkPlugin: [remarkMath],
            rehypePlugin: [rehypeKatex]
        },
        {
            rehypePlugin: [rehypeRaw]
        },
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
        {
            rehypePlugin: [
                rehypeHighlightCodeLines,
                {
                    showLineNumbers: true
                }
            ]
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any[];

    function processContent(content: string): string {
        if (!content) return "";

        // Remove footnote markers
        content = content.replace(/\[\^(\d+)\]/g, '');

        // Preserve code blocks (markdown fences and <pre> tags), remove leading whitespace from non-code
        const parts = content.split(/(```[\s\S]*?```|<pre[\s\S]*?<\/pre>)/);
        content = parts.map((part: string, i: number) =>
            i % 2 === 0 ? part.replace(/^[ \t]+/gm, '') : part
        ).join('');

        // Fix base path for links/images
        content = content.replace(/(src|href)="\/([^"]*?)"/g, `$1="${base}/$2"`);

        return content;
    }
</script>

<Markdown md={processContent(text)} {plugins} />
