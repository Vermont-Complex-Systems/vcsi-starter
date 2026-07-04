<script>
  // Everything below comes from the npm package — no SvelteKit anywhere.
  import '@the-vcsi/scrolly-kit/styles/all.css';
  import { ScrollyContent } from '@the-vcsi/scrolly-kit';

  // Visualization components live in their own files and receive the step
  // index as a prop — the same shape as the templates' stories, where this
  // file would be components/Index.svelte.
  import BarChart from './BarChart.svelte';
  import PulseDot from './PulseDot.svelte';

  // 1. The scroll gives you ONE reactive number per scrolly section.
  //    (In vanilla JS this is IntersectionObserver bookkeeping you'd hand-roll.)
  //    The rule for multi-section stories: each section gets its OWN index.
  //    If two sections shared `step`, scrolling one would drive the other.
  let step = $state(0);
  let step2 = $state(0);

  // 2. Content is data, not markup. In the real templates these arrays live in
  //    a copy.json file so non-coders can edit them. Markdown and math ($...$,
  //    rendered by KaTeX) work out of the box.
  const steps = [
    { type: 'markdown', value: 'Five values, five bars. The panel on the right is **pinned** while these steps scroll.' },
    { type: 'markdown', value: 'This step *sorted the bars*. No DOM surgery: the chart re-renders from a `$derived` array.' },
    { type: 'markdown', value: 'And this one highlights the peak. Each step maps to a **view config** — the pattern scales to real stories.' },
    { type: 'math', value: 'Math is content too: $\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$' }
  ];

  const steps2 = [
    { type: 'markdown', value: 'A **second scrolly section** — note the panel is on the *left* now (`.reversed`).' },
    { type: 'markdown', value: 'It has its own `$state` index: scrolling here never disturbs the bar chart above.' },
    { type: 'markdown', value: 'Text interludes between sections are just prose in the story column.' }
  ];
</script>

<article class="story">
  <h1>scrolly-kit without SvelteKit</h1>
  <p>
    This page is plain Vite + Svelte 5. The story container, the split layout, the
    step boxes, and the scroll tracking all come from
    <code>@the-vcsi/scrolly-kit</code>. Scroll on.
  </p>

  <section class="split-layout">
    <div class="sticky-panel">
      <BarChart {step} />
    </div>
    <div class="scrolly-content">
      <ScrollyContent {steps} bind:value={step} />
    </div>
  </section>

  <p>
    Prose returns to its centered column between sections — this is how
    multi-section stories interleave text and scrolly parts. Below: a second
    section with the panel on the other side.
  </p>

  <section class="split-layout reversed">
    <div class="sticky-panel">
      <PulseDot step={step2} />
    </div>
    <div class="scrolly-content">
      <ScrollyContent steps={steps2} bind:value={step2} />
    </div>
  </section>

  <p>
    One more thing the package did silently: <strong>resize this window below
    768px</strong> — each chart becomes a full-screen background and its steps
    float over it. That mobile collapse is the hardest part of hand-rolled
    scrollytelling, and here it is CSS you didn't write.
  </p>
  <p>
    What the real templates add on top: prerendered routes, a story registry,
    SEO tags, and the AI layer. See the
    <a href="https://vermont-complex-systems.github.io/vcsi-starter/docs/getting-started">docs</a>.
  </p>
</article>
