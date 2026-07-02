// Shared highlight.js singleton for the docs' markdown code blocks.
// Only the languages the docs actually use are registered, to keep the bundle small.
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

// Svelte markup → the XML grammar. It colours tags/attributes and delegates
// embedded <script>/<style> to the JS/CSS sublanguages, which covers the bulk
// of a Svelte snippet (runes and {#if} blocks stay uncoloured, which is fine).
hljs.registerLanguage('svelte', xml);

export default hljs;
