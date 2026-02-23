<script>
    let { scale } = $props();

    // Derive legend properties from the scale's domain
    let domain = $derived(scale?.domain() ?? []);
    let isDiverging = $derived(domain.length === 3);

    // Format labels based on scale type
    // Sequential domains can be [min, max] or [max, min] depending on interpolator
    let minLabel = $derived(
        isDiverging ? `${domain[0]?.toFixed(0)}%` : '0'
    );
    let maxLabel = $derived(
        isDiverging ? `+${domain[2]?.toFixed(0)}%` : Math.max(...domain)?.toLocaleString()
    );
</script>

{#if scale}
<div class="legend">
    <span class="legend-label">{minLabel}</span>
    <div class={isDiverging ? 'legend-gradient-diverging' : 'legend-gradient'}></div>
    <span class="legend-label">{maxLabel}</span>
</div>
{/if}

<style>
    .legend {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.5rem;
        border-radius: 4px;
    }

    .legend-gradient {
        width: 200px;
        height: 12px;
        background: linear-gradient(to right,
            #5e4fa2, #3288bd, #66c2a5, #abdda4,
            #e6f598, #fee08b, #fdae61, #f46d43, #d53e4f, #9e0142
        );
        border-radius: 2px;
    }

    .legend-gradient-diverging {
        width: 200px;
        height: 12px;
        background: linear-gradient(to right, #b2182b, #f7f7f7, #2166ac);
        border-radius: 2px;
    }

    .legend-label {
        font-size: 0.75rem;
        color: #333;
    }
</style>
