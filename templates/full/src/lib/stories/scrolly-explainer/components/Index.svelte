<script>
    import { ScrollyContent, CodeExplainer, MarkdownRenderer as Md, renderCodeHtml } from '@vcsi/scrolly-kit';
    import ToggleLayout from './ToggleLayout.svelte';
    import SimpleChart from './simpleChart.svelte';

    import Footer from '$lib/components/Footer.svelte';
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    
    let { story, data } = $props();

    let scrollyIndex = $state(undefined);
    let layoutMode = $state('split');

    // Select which explainer data based on current layout mode
    let layoutExplainer = $derived(
        layoutMode === 'split' ? data.SplitLayoutExplainer : data.FullscreenLayoutExplainer
    );
    let codeExplainer = $derived(
        layoutMode === 'split' ? data.SplitCodeExplainer : data.FullscreenCodeExplainer
    );

    // Get highlight lines for current step in live demo
    let currentHighlight = $derived(
        scrollyIndex !== undefined ? data.LiveDemoExplainer.steps[scrollyIndex]?.highlightLines || '' : ''
    );
</script>

<BackToHome />

<article class="story">

    <h1 >Deep Scrolly Dive</h1>

    <section >
        <p>In this story, we take a fun deep dive into the mechanics behind data-driven scrolly stories. The goal is to provide a general understanding of the different components we need to build such interactive stories.</p> 
        <p>Along the way, we will introduce key features of <a href="https://svelte.dev/">Svelte</a>, our framework of choice for interactive data visualization. Although it might be intimidating at first, Svelte, in my view, is much easier than, say, doing CSS right. Or vanilla <a href="https://d3js.org/">d3js</a> for that matter, the programming language of choice in the web development world (we will still be using d3js in our dataviz, but we won’t need it here).</p> 
        <p>Let’s start with the fun part: charting.</p>
    </section>

    <h2 >Charting</h2>

    <section >
        <p>This section shows how to add a chart that responds to scroll position. The chart here is written directly as SVG, using the Svelte <a href="https://svelte.dev/tutorial/svelte/each-blocks">each</a> block to loop over the data. This is a technique I first encountered <a href="https://2019.wattenberger.com/blog/react-and-d3">here</a> in the world of <a href="https://react.dev/">React</a>, and later in this <a href="https://www.youtube.com/watch?v=5IcY0biPhoQ&t=57s">series of videos</a> by Connor Rotschild.</p>
    </section>

    <div class="scrolly-section">
        <ToggleLayout bind:layoutMode={layoutMode} />

        {#if layoutMode === 'split'}
            <!-- Split/Triple layout: text | code | chart -->
            <section class="triple-layout live-demo">
                <ScrollyContent steps={data.LiveDemoExplainer.steps} bind:value={scrollyIndex} />
                <div class="code-panel">
                    <div class="code-explainer-chart">
                        <Md text={renderCodeHtml(data.LiveDemoExplainer.code, data.LiveDemoExplainer.language, currentHighlight)} />
                    </div>
                </div>
                <div class="chart-panel">
                    <SimpleChart {scrollyIndex}/>
                </div>
            </section>
        {:else}
            <!-- Fullscreen layout: chart as background, text+code overlay -->
            <section class="fullscreen-layout live-demo">
                <div class="sticky-panel">
                    <SimpleChart {scrollyIndex}/>
                </div>
                <div class="scrolly-content split-overlay">
                    <ScrollyContent steps={data.LiveDemoExplainer.steps} bind:value={scrollyIndex} topSpacer={false} bottomSpacer={false} />
                    <div class="code-panel">
                        <div class="code-explainer-chart">
                            <Md text={renderCodeHtml(data.LiveDemoExplainer.code, data.LiveDemoExplainer.language, currentHighlight)} />
                        </div>
                    </div>
                </div>
            </section>
        {/if}
    </div>

    <section >
        <p>Now, how does that work? What does it mean for <code>scrollyIndex</code> to be reactive? Below, we go over the global styling first, showing how it defines the two layouts, and then we describe the <code>ScrollyContent</code> module where the above code snippet lives.</p>
    </section>

    <h2 >The CSS Layout</h2>

    <section >
        <p>We offer two main scrolly layouts at the moment. Toggle below to explore the CSS code underlying each of them:</p>
    </section>

    <div class="scrolly-section">
        <ToggleLayout bind:layoutMode={layoutMode} />

        <CodeExplainer data={layoutExplainer} />
    </div>

    <h2 >The Svelte Component</h2>

    <section >
        <p>Your story’s content lives in <code>data/copy.json</code>, a file-based approach taken from <a href="https://github.com/the-pudding/svelte-starter/blob/main/src/data/copy.json">The Pudding</a>. It has the benefit of clearly separating content from code, so that non-technical collaborators can contribute to the story. In our implementation, each step has at minimum a <code>type</code> and <code>value</code> (but can take more if needed):</p>
<pre><code class="language-json">&#123;
  "steps": [
    &#123; "type": "html", "value": "&lt;strong&gt;Step 1&lt;/strong&gt;" &#125;,
    &#123; "type": "markdown", "value": "Step with **bold** text" &#125;,
    &#123; "type": "math", "value": "$E = mc^2$" &#125;
  ]
&#125;</code></pre>
        <p>The following code snippet is the core of what the user is expected to write: (i) the code for the chart (in the <code>sticky-panel</code>) and (ii) the content in the form of a list of entries, typically from <code>copy.json</code>. Here we write the code in full, but it is recommended to modularize it using <a href="https://svelte.dev/tutorial/svelte/your-first-component">components</a> for readability.</p>
    </section>

    <div class="scrolly-section">
        
        <ToggleLayout bind:layoutMode={layoutMode}/>

        <CodeExplainer data={codeExplainer} />
    </div>

    <section >
        <p>This section was hardcore, but if you got through it, you now know most of what you need to build interactive data visualizations using <code>Svelte</code>. We covered the following concepts:</p>
            <ul>
                <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">Intersection Observer API</a>: A native web API that detects when elements enter or leave the viewport—essential for triggering scroll-based animations.</li>
                <li><a href="https://svelte.dev/tutorial/svelte/state">$state</a> rune: Makes the UI react when values change. When another variable depends on a state variable, you should use <a href="https://svelte.dev/tutorial/svelte/derived-state">derived</a> state.</li>
                <li><a href="https://svelte.dev/tutorial/svelte/each-blocks">&#123;#each&#125;</a>: Logic in HTML for looping over data (its cousin <a href="https://svelte.dev/tutorial/svelte/if-blocks">&#123;#if&#125;</a> handles conditionals).</li>
                <li><a href="https://svelte.dev/tutorial/svelte/declaring-props">$props</a>: Passes data from parent components to children.</li>
                <li><a href="https://svelte.dev/docs/svelte/bind">bind</a>: Enables two-way data flow, letting child components send data back to parents.</li>
                <li><a href="https://svelte.dev/docs/svelte/@render">@render</a> and <a href="https://svelte.dev/docs/svelte/snippet">snippet</a>: Useful for rendering different types of content, such as <code>code</code>, <code>markdown</code>, or <code>math</code>.</li>
            </ul>
        <p >It might feel like a lot, but it’s not too bad. If you want to go further, my recommendation is to spend some time with Svelte’s excellent <a href="https://svelte.dev/tutorial/svelte/welcome-to-svelte">tutorial</a>, together with Joy of Code’s <a href="https://www.youtube.com/watch?v=B2MhkPtBWs4&t=4891s">Introduction to Svelte</a>. For most people who already understand a programming language and have a bit of HTML/CSS knowledge, half a day with that material can go a long way toward confidently tweaking existing charts and codebases.</p>
    </section>

    
    <h2 >Conclusion</h2>

    <section >
        <p>Here’s how the CSS layers work together:</p>
<pre class="architecture-diagram"><code>┌─────────────────────────────────────────────────────────────┐
│  app.css (Global Layouts)                                   │
│  Defines: grid structures, --panel-height, --step-max-width │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ split-layout │  │ fullscreen-    │  │ triple-layout   │  │
│  │  2-col grid  │  │  layout        │  │   3-col grid    │  │
│  └──────┬───────┘  └───────┬────────┘  └────────┬────────┘  │
└─────────┼──────────────────┼───────────────────┼────────────┘
          └──────────────────┼───────────────────┘
                  constrains │ (provides container bounds)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  ScrollyContent.svelte                                      │
│  Reads CSS variables, fills available space                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ .scrolly-content                                       │ │
│  │   .step &#123; min-height: var(--step-height) &#125;             │ │
│  │     .step-box &#123; max-width: var(--step-max-width) &#125;     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────┘
                   overrides  │ (story-specific customization)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Index.svelte &lt;style&gt;                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ .live-demo &#123;                                           │ │
│  │   --step-height: 40vh;      /* override defaults */    │ │
│  │   --step-max-width: 350px;                             │ │
│  │ &#125;                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│  Composes layouts + overrides CSS variables per section     │
└─────────────────────────────┬───────────────────────────────┘
                     content  │ (data drives rendering)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  copy.json                                                  │
│  &#123; steps: [...], code: "...", highlightLines: "..." &#125;       │
└─────────────────────────────────────────────────────────────┘</code></pre>
        <p>The key insight: <strong>layouts define space, content fills it</strong>. Global CSS sets container dimensions via variables. Components use <code>100%</code> and <code>inherit</code> to respect those bounds. Stories override variables to customize without breaking the system.</p>

        <p>You should now have a better understanding of how the global scrolly layout in <code>app.css</code> works together with <code>data/copy.json</code> and the <code>ScrollyContent.svelte</code> helper module to easily compose scrolly stories. We provide what we believe are reasonable defaults, but CSS variables can be used to override many key visual elements. These can be styled within the story directory.</p>
    </section>
</article>

<Footer theme="light" />

<style>
    .architecture-diagram {
        font-size: 0.85rem;
        line-height: 1.3;
    }

    .live-demo {
        --step-height: 40vh;
        --step-max-width: 350px;
        --step-text-align: left;
    }

    .split-overlay {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding-inline: 2rem;
    }

    .split-overlay > :global(.scrolly-content) {
        pointer-events: none;
    }

    .split-overlay .code-panel {
        position: sticky;
        top: 10vh;
        height: 90vh;
        max-height: 800px;
        pointer-events: auto;
    }

    @media (max-width: 768px) {
        .live-demo {
            --step-max-width: 100%;
        }

        .split-overlay {
            grid-template-columns: 1fr;
        }

        .split-overlay .code-panel {
            display: none;
        }
    }

    .code-explainer-chart {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        overflow: hidden;
    }

    .code-explainer-chart :global(pre) {
        margin: 0;
        max-width: 100%;
        max-height: 100%;
        overflow: auto;
    }
</style>