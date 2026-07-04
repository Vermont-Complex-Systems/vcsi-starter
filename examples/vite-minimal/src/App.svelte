<script>
  // Everything below comes from the npm package — no SvelteKit anywhere.
  import '@the-vcsi/scrolly-kit/styles/all.css';
  import { ScrollyContent } from '@the-vcsi/scrolly-kit';
  // The classic split: d3 does the math (scales), Svelte does the DOM.
  import { scaleBand, scaleLinear, max } from 'd3';

  // 1. The scroll gives you ONE reactive number per scrolly section.
  //    (In vanilla JS this is IntersectionObserver bookkeeping you'd hand-roll.)
  //    The rule for multi-section stories: each section gets its OWN index.
  //    If two sections shared `step`, scrolling one would drive the other.
  let step = $state(0);
  let step2 = $state(0);

  // 2. Content is data, not markup. In the real templates this array lives in
  //    a copy.json file so non-coders can edit it. Markdown and math ($...$,
  //    rendered by KaTeX) work out of the box.
  const steps = [
    { type: 'markdown', value: 'Five values, five bars. The panel on the right is **pinned** while these steps scroll.' },
    { type: 'markdown', value: 'This step *sorted the bars*. No DOM surgery: the chart re-renders from a `$derived` array.' },
    { type: 'markdown', value: 'And this one highlights the peak. Each step maps to a **view config** — the pattern scales to real stories.' },
    { type: 'math', value: 'Math is content too: $\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$' }
  ];

  const data = [
    { name: 'A', value: 34 },
    { name: 'B', value: 71 },
    { name: 'C', value: 52 },
    { name: 'D', value: 89 },
    { name: 'E', value: 45 }
  ];

  // 3. The step index derives a complete "view config" (see the scrolly-kit
  //    docs: reactive index techniques). Adding a step = adding a case.
  //    Note: the config describes an ORDER, it doesn't reorder the markup.
  let view = $derived.by(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    switch (step ?? 0) {
      case 0:  return { order: data,   highlight: null };
      case 1:  return { order: sorted, highlight: null };
      default: return { order: sorted, highlight: 'D' };
    }
  });

  // 4. Responsive by binding, not by ResizeObserver: the container reports its
  //    real width, and the d3 scales derive from it — the chart reflows on
  //    resize for free. (Canonical pattern: bind clientWidth, viewBox scales.)
  let width = $state(300);
  const H = 260;

  let xScale = $derived(
    scaleBand()
      .domain(view.order.map((d) => d.name))
      .range([0, width])
      .padding(0.15)
  );
  
  let yScale = $derived(
    scaleLinear()
      .domain([0, max(data, (d) => d.value)])
      .range([H - 30, 20])
  );

  // Second section: its own steps, its own tiny visual, its own index.
  const steps2 = [
    { type: 'markdown', value: 'A **second scrolly section** — note the panel is on the *left* now (`.reversed`).' },
    { type: 'markdown', value: 'It has its own `$state` index: scrolling here never disturbs the bar chart above.' },
    { type: 'markdown', value: 'Text interludes between sections are just prose in the story column.' }
  ];
  const looks = [
    { r: 40, fill: '#154734' },
    { r: 80, fill: '#2c5aa0' },
    { r: 120, fill: '#e0843c' }
  ];
  let look = $derived(looks[step2 ?? 0] ?? looks[0]);
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
      <div class="chart-container" bind:clientWidth={width}>
        <svg viewBox="0 0 {width} {H}">
          <!-- 5. Data -> SVG, declaratively. The each-block iterates the STABLE
               data array, so no DOM node ever moves (a moved node has its CSS
               transition canceled — bars would snap). Sorting happens in the
               xScale domain instead: positions change, transitions run. -->
          {#each data as d (d.name)}
            <g class="bar" style:transform="translateX({xScale(d.name)}px)">
              <rect
                y={yScale(d.value)}
                width={xScale.bandwidth()}
                height={H - 30 - yScale(d.value)}
                rx="4"
                fill={view.highlight === d.name ? '#e0843c' : '#154734'}
              />
              <text x={xScale.bandwidth() / 2} y={H - 10} text-anchor="middle">{d.name}</text>
            </g>
          {/each}
        </svg>
      </div>
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
      <svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <circle class="dot" cx="150" cy="150" r={look.r} fill={look.fill} />
      </svg>
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

<style>
  /* The layout owns the panel's size; the chart fills it and binds its width. */
  .chart-container {
    width: 100%;
    height: auto;
  }

  .chart-container svg {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Positions come from the xScale; the transition makes re-sorts glide. */
  .bar {
    transition: transform 0.6s ease;
  }

  .bar rect {
    transition: all 0.6s ease;
  }

  .bar text {
    font-size: 13px;
    fill: currentColor;
  }

  .dot {
    transition: all 0.5s ease;
  }
</style>
