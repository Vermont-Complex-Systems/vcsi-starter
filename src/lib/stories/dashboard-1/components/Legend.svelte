<script lang="ts">
    import type { ScaleOrdinal } from 'd3';

    let { colleges, colorScale, selectedColleges = $bindable() }: {
        colleges: string[];
        colorScale: ScaleOrdinal<string, string>;
        selectedColleges: Set<string>;
    } = $props();

    function toggleCollege(college: string) {
        selectedColleges = selectedColleges.has(college)
            ? new Set([...selectedColleges].filter(c => c !== college))
            : new Set([...selectedColleges, college]);
    }
</script>

<div class="legend">
    {#each colleges.filter(c => c !== 'Unknown') as college (college)}
        <button
            class="legend-item"
            class:dimmed={selectedColleges.size > 0 && !selectedColleges.has(college)}
            onclick={() => toggleCollege(college)}
        >
            <span
                class="legend-dot"
                style:background-color={colorScale(college)}
            ></span>
            <span class="legend-label">{college}</span>
        </button>
    {/each}
</div>

<style>
    .legend {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 150ms ease;
        text-align: left;
    }

    .legend-item:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .legend-item.dimmed {
        opacity: 0.4;
    }

    .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .legend-label {
        font-size: 0.85rem;
        color: var(--color-text);
        line-height: 1.2;
    }
</style>
