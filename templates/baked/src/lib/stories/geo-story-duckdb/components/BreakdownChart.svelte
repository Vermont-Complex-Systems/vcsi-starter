<script>
    import { DA_METRICS } from './color-utils.js';

    let { features, metric } = $props();

    let breakdown = $derived(DA_METRICS[metric]?.breakdown);

    // Gather all values across features and categories to compute shared y-scale
    let dotData = $derived.by(() => {
        if (!breakdown || !features?.length) return { categories: [], dots: [], maxVal: 0 };

        const categories = [...new Set(breakdown.bars.map(b => b.label))];
        const dots = [];
        let maxVal = 0;

        for (let i = 0; i < features.length; i++) {
            const f = features[i];
            for (const b of breakdown.bars) {
                const v = f.properties[b.prop];
                if (v != null) {
                    dots.push({ featureIdx: i, category: b.label, value: v, uid: f.properties.geo_uid, prop: b.prop, color: b.color ?? '#333' });
                    if (v > maxVal) maxVal = v;
                }
            }
        }

        return { categories, dots, maxVal };
    });

    // Chart dimensions
    const W = 220;
    const H = 100;
    const pad = { top: 14, right: 8, bottom: 20, left: 40 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    let xPositions = $derived.by(() => {
        const cats = dotData.categories;
        if (cats.length === 0) return new Map();
        const step = plotW / cats.length;
        return new Map(cats.map((c, i) => [c, pad.left + step * i + step / 2]));
    });

    let yScale = $derived.by(() => {
        const max = dotData.maxVal || 1;
        return v => pad.top + plotH - (v / max) * plotH;
    });

    let yTicks = $derived.by(() => {
        const max = dotData.maxVal;
        if (!max) return [];
        const nice = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
        const step = nice.find(n => max / n <= 4) ?? Math.ceil(max / 3);
        const ticks = [];
        for (let v = 0; v <= max; v += step) ticks.push(v);
        return ticks;
    });

    function fmtTick(v) {
        if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
        return v.toString();
    }
</script>

{#if breakdown && dotData.dots.length > 0}
    <div class="breakdown">
        <div class="breakdown-title">{breakdown.label}</div>
        {#if breakdown.bars.some(b => b.color)}
            <div class="legend">
                <span class="legend-item"><span class="legend-dot" style="background:#333"></span> median</span>
                <span class="legend-item"><span class="legend-dot" style="background:#c22"></span> average</span>
            </div>
        {/if}
        <svg viewBox="0 0 {W} {H}" class="dot-chart">
            <!-- Y gridlines + labels -->
            {#each yTicks as tick (tick)}
                <line
                    x1={pad.left} x2={W - pad.right}
                    y1={yScale(tick)} y2={yScale(tick)}
                    stroke="#e0e0e0" stroke-width="0.5"
                />
                <text
                    x={pad.left - 4} y={yScale(tick)}
                    text-anchor="end" dominant-baseline="middle"
                    font-size="7" fill="#999"
                >{fmtTick(tick)}</text>
            {/each}

            <!-- Category labels -->
            {#each dotData.categories as cat (cat)}
                <text
                    x={xPositions.get(cat)} y={H - 4}
                    text-anchor="middle" font-size="7.5" fill="#555"
                >{cat}</text>
            {/each}

            <!-- Dots -->
            {#each dotData.dots as dot (`${dot.uid}-${dot.prop}`)}
                <circle
                    cx={xPositions.get(dot.category) + (dot.color === '#333' ? -5 : 5)}
                    cy={yScale(dot.value)}
                    r="3.5"
                    fill={dot.color}
                    opacity="0.4"
                >
                    <title>DA {dot.uid}: {breakdown.fmt(dot.value)}</title>
                </circle>
            {/each}
        </svg>
    </div>
{/if}

<style>
    .breakdown {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .breakdown-title {
        font-size: 0.65rem;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .legend {
        display: flex;
        gap: 0.5rem;
        font-size: 0.6rem;
        color: #777;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.2rem;
    }

    .legend-dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        opacity: 0.6;
    }

    .dot-chart {
        width: 100%;
        height: auto;
    }
</style>
