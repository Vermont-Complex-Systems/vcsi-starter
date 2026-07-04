<script>
  // Everything below comes from the npm package — no SvelteKit anywhere.
  import '@the-vcsi/scrolly-kit/styles/all.css';
  import { ScrollyContent } from '@the-vcsi/scrolly-kit';

  let step = $state(0);

  const steps = [
    { type: 'markdown', value: 'A **split layout**: sticky panel beside scrolling steps.' },
    { type: 'markdown', value: 'The circle derives from the step index.' },
    { type: 'markdown', value: 'Plain Vite + Svelte 5. That is the whole stack.' }
  ];

  const looks = [
    { r: 40, fill: '#154734' },
    { r: 80, fill: '#2c5aa0' },
    { r: 120, fill: '#e0843c' }
  ];
  let look = $derived(looks[step ?? 0] ?? looks[0]);
</script>

<article class="story">
  <h1>scrolly-kit without SvelteKit</h1>
  <p>
    This app is plain Vite + Svelte. The story container, the layout, the step
    boxes, and the scroll tracking all come from <code>@the-vcsi/scrolly-kit</code>.
  </p>

  <section class="split-layout">
    <div class="sticky-panel">
      <svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <circle cx="150" cy="150" r={look.r} fill={look.fill} style="transition: all 0.5s ease;" />
      </svg>
    </div>
    <div class="scrolly-content">
      <ScrollyContent {steps} bind:value={step} />
    </div>
  </section>

  <p>Prose resumes, centered, after the scrolly section.</p>
</article>
