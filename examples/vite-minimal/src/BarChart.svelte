<script>
  // The classic split: d3 does the math (scales), Svelte does the DOM.
  import { scaleBand, scaleLinear, max } from 'd3';

  // The component receives the step index as a read-only prop and always
  // guards the undefined case — the contract for scrolly visuals.
  let { step } = $props();

  const data = [
    { name: 'A', value: 34 },
    { name: 'B', value: 71 },
    { name: 'C', value: 52 },
    { name: 'D', value: 89 },
    { name: 'E', value: 45 }
  ];

  // The step index derives a complete "view config" (see the scrolly-kit
  // docs: reactive index techniques). Adding a step = adding a case.
  // Note: the config describes an ORDER, it doesn't reorder the markup.
  let view = $derived.by(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    switch (step ?? 0) {
      case 0:  return { order: data,   highlight: null };
      case 1:  return { order: sorted, highlight: null };
      default: return { order: sorted, highlight: 'D' };
    }
  });

  // Responsive by binding, not by ResizeObserver: the container reports its
  // real width and the d3 scales derive from it — the chart reflows on
  // resize for free. (Canonical pattern: bind clientWidth, viewBox scales.)
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
</script>

<div class="chart-container" bind:clientWidth={width}>
  <svg viewBox="0 0 {width} {H}">
    <!-- Data -> SVG, declaratively. The each-block iterates the STABLE data
         array, so no DOM node ever moves (a moved node has its CSS transition
         canceled — bars would snap). Sorting happens in the xScale domain
         instead: positions change, transitions run. -->
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
</style>
