<script>
    let { scale } = $props();

    // Derive legend properties from the scale
    let domain = $derived(scale?.domain() ?? []);
    let isDiverging = $derived(domain.length === 3);

    // Detect discrete scales (scaleQuantize, scaleOrdinal, etc.) by checking for .range()
    let isDiscreteScale = $derived(scale && !scale.interpolator && typeof scale.range === 'function');

    // Generate CSS gradient from the scale
    let gradientCSS = $derived.by(() => {
        if (!scale) return null;

        // Discrete scales: build gradient from range colors
        if (isDiscreteScale) {
            const colors = scale.range();
            if (!colors?.length) return null;
            const stops = colors.map((c, i) => {
                const start = ((i / colors.length) * 100).toFixed(0);
                const end = (((i + 1) / colors.length) * 100).toFixed(0);
                return `${c} ${start}%, ${c} ${end}%`;
            });
            return `linear-gradient(to right, ${stops.join(', ')})`;
        }

        // Continuous scales: sample the interpolator
        if (!scale.interpolator) return null;
        const interpolator = scale.interpolator();
        const stops = Array.from({ length: 10 }, (_, i) => {
            const t = i / 9;
            return `${interpolator(t)} ${(t * 100).toFixed(0)}%`;
        });
        return `linear-gradient(to right, ${stops.join(', ')})`;
    });

    // Format a number as compact K label
    function fmtK(v) {
        if (v == null || !isFinite(v)) return '';
        if (Math.abs(v) >= 1000) return `${Math.round(v / 1000)}K`;
        return Math.round(v).toString();
    }

    // Internal bin boundaries (thresholds between color segments)
    let binEdges = $derived.by(() => {
        if (!scale || !isDiscreteScale) return [];
        // scaleQuantize: thresholds() gives internal cuts between bins
        if (typeof scale.thresholds === 'function') {
            return scale.thresholds();
        }
        // scaleQuantile: quantiles() gives internal cuts between bins
        if (typeof scale.quantiles === 'function') {
            return scale.quantiles();
        }
        return [];
    });

    let numBins = $derived(isDiscreteScale && scale ? scale.range().length : 0);

    // Format labels (for continuous/diverging scales)
    let minLabel = $derived.by(() => {
        if (!scale) return '';
        const d = domain;
        if (isDiverging) return `${d[0]?.toFixed(0)}%`;
        const min = d[0];
        return min?.toLocaleString(undefined, { maximumFractionDigits: 0 });
    });

    let maxLabel = $derived.by(() => {
        if (!scale) return '';
        const d = domain;
        if (isDiverging) return `+${d[2]?.toFixed(0)}%`;
        const max = d[d.length - 1];
        return max?.toLocaleString(undefined, { maximumFractionDigits: 0 });
    });
</script>

{#if scale}
<div class="legend">
    {#if isDiscreteScale && binEdges.length > 0}
        <div class="legend-bar-wrap">
            <div
                class="legend-bar"
                style:background={gradientCSS}
            ></div>
            <div class="bin-ticks">
                {#each binEdges as edge, i (i)}
                    <span
                        class="bin-tick"
                        style="left: {((i + 1) / numBins) * 100}%"
                    >{fmtK(edge)}</span>
                {/each}
            </div>
        </div>
    {:else}
        <span class="legend-label">{minLabel}</span>
        <div
            class="legend-bar"
            style:background={gradientCSS ?? (isDiverging
                ? 'linear-gradient(to right, #b2182b, #f7f7f7, #2166ac)'
                : 'linear-gradient(to right, #5e4fa2, #3288bd, #66c2a5, #abdda4, #e6f598, #fee08b, #fdae61, #f46d43, #d53e4f, #9e0142)'
            )}
        ></div>
        <span class="legend-label">{maxLabel}</span>
    {/if}
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
        padding: 0.5rem 1rem;
        border-radius: 4px;
    }

    .legend-bar {
        width: 240px;
        height: 12px;
        border-radius: 2px;
    }

    .legend-label {
        font-size: 0.75rem;
        color: #333;
    }

    .legend-bar-wrap {
        position: relative;
    }

    .bin-ticks {
        position: relative;
        height: 1.1rem;
        margin-top: 2px;
    }

    .bin-tick {
        position: absolute;
        transform: translateX(-50%);
        font-size: 0.6rem;
        color: #555;
        white-space: nowrap;
    }
</style>
