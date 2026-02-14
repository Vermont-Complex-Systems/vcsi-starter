<script>
    let { scrollyIndex } = $props();
</script>

<div class="chart-container">
    <svg viewBox="0 0 300 200" class="chart-svg">
        <rect width="300" height="200" fill="#f4efea" rx="8"/>
        {#each [20, 35, 25, 45] as value, i}
            <rect
                x={30 + i * 65}
                y={180 - value * 3}
                width="50"
                height={value * 3}
                fill={scrollyIndex === i ? '#ff6b6b' : '#4ecdc4'}
                rx="4"
                class="chart-bar"
            />
        {/each}
        <text x="150" y="30" text-anchor="middle" class="chart-label">
            Step: {scrollyIndex ?? '–'}
        </text>
    </svg>
</div>

<style>
    .chart-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    svg {
        width: 100%;
        height: 100%;
    }
</style>