<script>
  // Same contract as BarChart: the step index arrives as a read-only prop.
  let { step } = $props();

  // Array lookup: the simplest reactive-index technique — each step maps to
  // a named look.
  const looks = [
    { r: 40, fill: '#154734' },
    { r: 80, fill: '#2c5aa0' },
    { r: 120, fill: '#e0843c' }
  ];
  let look = $derived(looks[step ?? 0] ?? looks[0]);
</script>

<svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <circle class="dot" cx="150" cy="150" r={look.r} fill={look.fill} />
</svg>

<style>
  .dot {
    transition: all 0.5s ease;
  }
</style>
