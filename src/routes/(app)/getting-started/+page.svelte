<script>
    import Meta from "$lib/components/Meta.svelte";
    import vlogData from '$data/vlog.csv';
    import MarkdownRenderer from "$lib/components/helpers/MarkdownRenderer.svelte";

    // Process CSV data into video objects
    const videos = vlogData
        .filter(row => row && row.id && row.title) // Filter out empty or incomplete rows
        .map(row => {
            // Extract title and abstract portions
            let description = row.description || '';
            
            // Try to extract title first
            const titleMatch = description.match(/^Title:\s*([^\n]*)/i);
            const extractedTitle = titleMatch ? titleMatch[1].trim() : '';
            
            // Extract abstract
            const abstractMatch = description.match(/Abstract:\s*([\s\S]*?)(?:\n\n|Bio:|$)/i);
            const extractedAbstract = abstractMatch ? abstractMatch[1].trim() : '';
            
            // Combine title and abstract
            let cleanDescription = '';
            if (extractedTitle) {
                cleanDescription += `Title: ${extractedTitle}\n\n`;
            }
            if (extractedAbstract) {
                cleanDescription += `Abstract: ${extractedAbstract}`;
            }
            
            // Fallback to original if no matches
            if (!cleanDescription) {
                cleanDescription = description;
            }
            
            return {
                id: row.id,
                title: row.title,
                url: `https://www.youtube.com/watch?v=${row.id}`,
                thumbnail: row.thumbnail,
                description: cleanDescription
            };
        });
</script>

<Meta 
  title="Videos and Tutorials"
  description="Video talks explaining the template."
/>

<div class="page">
    <div class="page-header no-logo">
        <div class="page-header-text">
            <h1>Videos and Tutorials</h1>
        </div>
    </div>

<div class="videos-grid">
    {#each videos as video}
        <div class="video-card">
            <a href="{video.url}" target="_blank" rel="noopener noreferrer" class="video-link">
                <div class="video-thumbnail">
                    <img
                        src="{video.thumbnail}"
                        alt="{video.title}"
                    />
                    <div class="play-overlay">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">{video.title}</h3>
                    
                    <div class="description">
                        <MarkdownRenderer text={video.description} />
                    </div>
                </div>
            </a>
        </div>
    {/each}
</div>
</div>

<style>
    .page-header-text h1 {
        font-size: 3rem;
        font-weight: 400;
        margin-bottom: 3rem;
    }

    .page-header {
        display: flex;
        align-items: flex-start;
        gap: 3rem;
        margin-top: 4rem;
    }

    .page-header-text {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 50%;
    }

     @media (max-width: 960px) {
        
        .page-header-text,
        .page-header.no-logo .page-header-text {
            max-width: 100%;
        }
    }

    .videos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .video-card {
        position: relative;
        transition: transform 200ms ease, box-shadow 200ms ease;
        border-radius: var(--border-radius);
        overflow: visible;
        background: var(--color-white);
        border: 1px solid var(--color-border);
        z-index: 1;
    }
    
    .video-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 10;
    }
    
    .video-link {
        display: block;
        text-decoration: none;
        color: inherit;
    }
    
    .video-thumbnail {
        position: relative;
        width: 100%;
        aspect-ratio: 16/9;
        overflow: hidden;
        background: var(--color-gray-100);
    }
    
    .video-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 200ms ease;
    }
    
    .video-card:hover .video-thumbnail img {
        transform: scale(1.05);
    }
    
    .play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 200ms ease;
    }
    
    .video-card:hover .play-overlay {
        background: rgba(0, 0, 0, 0.8);
        transform: translate(-50%, -50%) scale(1.1);
    }
    
    .video-info {
        padding: 1.5rem;
    }

    .video-title {
        font-size: 1.2rem;
        font-weight: 600;
        font-family: var(--serif);
        margin: 0;
        color: var(--color-fg);
        line-height: 1.3;
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .videos-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        
    }
    
</style>