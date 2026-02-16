<script lang="ts">
    import type { ScaleOrdinal } from 'd3';

    let { regions, colorScale, selectedRegions = $bindable(), innerWidth, isMobile = false }: {
        regions: string[];
        colorScale: ScaleOrdinal<string, string>;
        selectedRegions: Set<string>;
        innerWidth: number;
        isMobile?: boolean;
    } = $props();

    // Legend layout - more compact on mobile
    let legendItemWidth = $derived(isMobile ? 85 : 110);
    let legendItemHeight = $derived(isMobile ? 18 : 20);
    let legendItemsPerRow = $derived(Math.max(2, Math.floor((innerWidth - 40) / legendItemWidth)));

    function getLegendPosition(index: number) {
        const row = Math.floor(index / legendItemsPerRow);
        const col = index % legendItemsPerRow;
        return { x: col * legendItemWidth, y: row * legendItemHeight };
    }

    function toggleRegion(region: string) {
        selectedRegions = selectedRegions.has(region)
            ? new Set([...selectedRegions].filter(r => r !== region))
            : new Set([...selectedRegions, region]);
    }

</script>

{#each regions.filter(r => r !== 'Unknown') as region, i (region)}
    {@const pos = getLegendPosition(i)}
    <g
        transform={`translate(${pos.x}, ${pos.y})`}
        class="legend-item"
        onclick={() => toggleRegion(region)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Enter' && toggleRegion(region)}
    >
        <circle
            cx={0}
            cy={0}
            r={isMobile ? 5 : 6}
            fill={colorScale(region)}
            opacity={selectedRegions.size === 0 || selectedRegions.has(region) ? 0.7 : 0.2}
        />
        <text
            x={isMobile ? 10 : 12}
            y={4}
            font-size={isMobile ? "9" : "10"}
            fill="white"
        >
            {region}
        </text>
    </g>
{/each}

<style>
    .legend-item {
        cursor: pointer;
    }

    .legend-item:hover circle {
        transform: scale(1.2);
    }

    .legend-item:hover text {
        font-weight: bold;
    }
</style>
