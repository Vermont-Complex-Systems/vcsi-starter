<script lang="ts">
  import hljs from '$lib/hljs';

  interface Props {
    lang?: string;
    text?: string;
  }

  let { lang = '', text = '' }: Props = $props();

  // Map common fence aliases to a registered highlight.js language.
  const aliases: Record<string, string> = {
    sv: 'svelte',
    html: 'xml',
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    sh: 'bash',
    shell: 'bash',
    console: 'bash',
    jsonc: 'json'
  };

  let language = $derived((aliases[lang.toLowerCase()] ?? lang.toLowerCase()) || '');

  // Highlight during render (works in SSR/prerender too — no flash on the client).
  let highlighted = $derived(
    language && hljs.getLanguage(language)
      ? hljs.highlight(text, { language, ignoreIllegals: true }).value
      : escapeHtml(text)
  );

  const displayLang: Record<string, string> = { xml: 'html', javascript: 'js', typescript: 'ts' };
  let label = $derived(displayLang[language] ?? (lang || 'code'));

  let copied = $state(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => (copied = false), 1500);
    } catch {
      // clipboard unavailable — leave the button as-is
    }
  }

  function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
</script>

<div class="code-block">
  <div class="code-block-header">
    <span class="code-lang">{label}</span>
    <button class="code-copy" type="button" onclick={copy} aria-label="Copy code to clipboard">
      {copied ? 'Copied!' : 'Copy'}
    </button>
  </div>
  <pre><code class="hljs">{@html highlighted}</code></pre>
</div>
