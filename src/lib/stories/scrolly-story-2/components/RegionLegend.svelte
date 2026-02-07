<script lang="ts">
    import type { ScaleOrdinal } from 'd3';

    let { regions, colorScale, innerWidth }: {
        regions: string[];
        colorScale: ScaleOrdinal<string, string>;
        innerWidth: number;
    } = $props();

    // Legend layout - wrap on smaller screens
    const legendItemWidth = 110;
    const legendItemHeight = 20;
    let legendItemsPerRow = $derived(Math.max(2, Math.floor((innerWidth - 40) / legendItemWidth)));

    function getLegendPosition(index: number) {
        const row = Math.floor(index / legendItemsPerRow);
        const col = index % legendItemsPerRow;
        return { x: col * legendItemWidth, y: row * legendItemHeight };
    }

</script>

{#each regions.filter(r => r !== 'Unknown') as region, i (region)}
    {@const pos = getLegendPosition(i)}
    <g
        transform={`translate(${pos.x}, ${pos.y})`}
        class="legend-item"
    >
        <circle
            cx={0}
            cy={0}
            r={6}
            fill={colorScale(region)}
            opacity={0.7}
        />
        <text
            x={12}
            y={4}
            font-size="10"
            fill="white"
        >
            {region}
        </text>
    </g>
{/each}

<style>
    
    .legend-item:hover circle {
        transform: scale(1.2);
    }

    .legend-item:hover text {
        font-weight: bold;
    }
</style>
