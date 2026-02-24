<script>
    import { zoom, zoomIdentity, select } from 'd3';

    let {
        data,
        backgroundData = [],
        xScale,
        yScale,
        colorScale,
        width,
        height,
        hoveredId = $bindable(),
        hoveredElement = $bindable(null),
        zoomTransform = $bindable(zoomIdentity),
        isMobile = false,
        ondotclick = () => {}
    } = $props();

    let canvas;
    let anchorDiv;
    const RADIUS = 4;
    const HIT_RADIUS = 8;
    const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // Use the bindable prop as our zoom state
    let currentTransform = $derived(zoomTransform);

    // Resize canvas only when dimensions change
    let prevW = 0;
    let prevH = 0;

    $effect(() => {
        if (!canvas) return;
        const w = width * DPR;
        const h = height * DPR;
        if (prevW !== w || prevH !== h) {
            canvas.width = w;
            canvas.height = h;
            prevW = w;
            prevH = h;
        }
    });

    // Set up d3-zoom on the canvas
    $effect(() => {
        if (!canvas) return;
        const zoomBehavior = zoom()
            .scaleExtent([1, 8])
            .translateExtent([[-100, -100], [width + 100, height + 100]])
            .filter((event) => {
                // Prevent scroll hijacking: require Ctrl/Cmd for wheel zoom
                event.preventDefault();
                return (!event.ctrlKey || event.type === 'wheel') && !event.button;
            })
            .on('zoom', ({ transform }) => {
                zoomTransform = transform;
            });

        select(canvas).call(zoomBehavior);

        return () => {
            select(canvas).on('.zoom', null);
        };
    });

    // Draw dots — runs when data, scales, hover, or zoom transform changes
    $effect(() => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const t = currentTransform;
        const r = RADIUS / t.k; // Keep dot size constant on screen

        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.clearRect(0, 0, width, height);

        // Apply zoom transform
        ctx.translate(t.x, t.y);
        ctx.scale(t.k, t.k);

        // Background dots (unfiltered) — pale gray, no interaction
        if (backgroundData.length > 0) {
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#999';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 0.3 / t.k;
            for (const d of backgroundData) {
                const cx = xScale(d.umap_1);
                const cy = yScale(d.umap_2);
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }

        // Foreground dots (filtered) — full color
        for (const d of data) {
            const cx = xScale(d.umap_1);
            const cy = yScale(d.umap_2);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.globalAlpha = d.id === hoveredId ? 1 : 0.6;
            ctx.fillStyle = colorScale(d.college);
            ctx.fill();
            if (d.id === hoveredId) {
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2 / t.k;
            } else {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 0.5 / t.k;
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    });

    function findNearest(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        // Invert zoom transform to get original coordinate space
        const t = currentTransform;
        const invX = (mx - t.x) / t.k;
        const invY = (my - t.y) / t.k;
        // Scale hit radius inversely with zoom so it stays consistent on screen
        const scaledHitRadius = HIT_RADIUS / t.k;
        const hitDist = scaledHitRadius * scaledHitRadius;

        let closest = null;
        let minDist = hitDist;

        for (const d of data) {
            const cx = xScale(d.umap_1);
            const cy = yScale(d.umap_2);
            const dx = invX - cx;
            const dy = invY - cy;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
                minDist = dist;
                closest = d;
            }
        }
        return closest;
    }

    // Get screen position of a data point (with zoom applied)
    function screenPos(d) {
        const cx = xScale(d.umap_1);
        const cy = yScale(d.umap_2);
        const t = currentTransform;
        return [t.x + cx * t.k, t.y + cy * t.k];
    }

    function onMouseMove(e) {
        if (isMobile) return;
        const hit = findNearest(e);
        if (hit) {
            hoveredId = hit.id;
            const [sx, sy] = screenPos(hit);
            anchorDiv.style.left = `${sx}px`;
            anchorDiv.style.top = `${sy}px`;
            hoveredElement = anchorDiv;
        } else {
            hoveredId = null;
            hoveredElement = null;
        }
    }

    function onMouseLeave() {
        if (!isMobile) {
            hoveredId = null;
            hoveredElement = null;
        }
    }

    function onClick(e) {
        const hit = findNearest(e);
        if (hit) {
            hoveredId = hit.id;
            const [sx, sy] = screenPos(hit);
            anchorDiv.style.left = `${sx}px`;
            anchorDiv.style.top = `${sy}px`;
            hoveredElement = anchorDiv;
            ondotclick(hit.id);
        }
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<canvas
    bind:this={canvas}
    style="width: {width}px; height: {height}px; cursor: grab; touch-action: none;"
    onmousemove={onMouseMove}
    onmouseleave={onMouseLeave}
    onclick={onClick}
></canvas>
<!-- Invisible anchor for tooltip positioning -->
<div bind:this={anchorDiv} class="tooltip-anchor"></div>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
    .tooltip-anchor {
        position: absolute;
        width: 1px;
        height: 1px;
        pointer-events: none;
    }
</style>
