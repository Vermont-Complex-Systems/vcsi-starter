# Manifesto

The scrolly-kit is born out of the need to standardize practices for building interactive dataviz at the University of Vermont's open source programming office (VERSO), without overdoing it. That is, we want to do Pudding-esque stories, while being mindful of academics often lacking the time and skills to bring them to the finish line. 

## Desiderata

While building the scrolly-kit, we ended up with the following desiderata:
1. `Ownership (humans)`: We build the stories, but teams should maintain ownership. Worst case scenario, this means that most code written by us at VERSO ought to be maintainable by most likely more novice programmers.
1. `Time-to-first-story (humans)`: Someone should be able to make their first story without knowing everything there is to know about the scrolly-kit.
1. `Extensibility (technology)`: We do the initial push, but stories ought to be easily expanded into new stories and integrated into broader projects over the long run. 
1. `Learnability (humans)`. Since we believe stories can stimulate new ideas and engender offspring, the design of scrolly-kit should be easy to learn so that teams can keep doing them. 
1. `Optional AI-layer (AI)`: To achieve ownership, TTFS, and learnability, we make use of agentic skills and AI-friendly resources so that AI agents can pick up on patterns from the scrolly-kit. We use AI agents as shadow clones of ourselves to help build stories with the scrolly-kit, removing ourselves as much as possible as bottlenecks.
1. `Auditability (humans)`: In the event we run out of tokens, we believe that code underpinning the scrolly-kit should be auditable by humans who have the ability to read code today. In this respect, we also believe the codebase should expose lower-level code, instead of relying on complex stacks and premature abstractions.
1. `Foster self-determination (humans)`: if someone wants to go offscript with their stories, our framework should not get in their way. 
1. `Rudimentary-ish (technology)`: The technology we used should embrace the elements of the web, yet we remain opinionated about emerging technologies with nicer API that we believe solve recurrent issues with the web.

## Design Principles

Our design principles are derived from the above desiderata. But first, here's our best attempt at defining what is the scrolly-kit.

![The scrolly-kit architecture, from the inside out: at the core, the CSS layout classes (.story, .split-layout, .fullscreen-layout, .triple-layout, .dashboard-layout). Around them, the @the-vcsi/scrolly-kit engine package: design tokens and reusable components. Everything inside that dashed boundary runs in a bare Vite app, no SvelteKit. The next layer is the templates, the publishing platform (routes, stories.csv, copy.json, prerender and deploy). The outermost layer is the extension ecosystem via npx sv add: openalex, msgraph, and scrolly-skills, the AI layer.](/diagrams/architecture-onion.svg "The layers of scrolly-kit: each paragraph below walks one ring outward")

The scrolly-kit is at its core a few CSS classes implementing layouts for making interactive dataviz. You can think of those CSS classes as our best effort of making building blocks in the style of the grammar of graphics (see [STYLING](reference)). 

The scrolly-kit uses a token system to (i) provide reasonable defaults but (ii) customize the layouts, very much like you pass arguments to your plotting functions. 

We provide a minimal example of the scrolly-kit using a simple vite app ([github](https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/examples/vite-minimal)).

The scrolly-kit follows the Pudding in separating story content from code, letting anybody contribute to the story (see [PROJECT STRUCTURE](project-structure)). 

We strive to provide reusable components to facilitate that; as well as the design of the web platform that hosts the stories (see [COMPONENTS](components-overview)). 

We provide the scaffolding as templates to help build and deploy web platforms which can host stories. We take advantage of the Svelte's [community add-ons](https://svelte.dev/docs/cli/community) ecosystem to extend the templates with various features, such as the ability to pull data from [openalex](https://www.npmjs.com/package/@the-vcsi/openalex) or using Microsoft's [SharePoint](https://www.npmjs.com/package/@the-vcsi/msgraph) as entry point to write content for stories.

## P.S. Who is this library for?

As of today (2026-02-18), LLMs like `Claude Sonnet 4.6` can write you professionally-looking static websites using only vanilla HTML/CSS/JS in no time. So why bother with this library?

`Scrolly-kit` has been designed to help you understand the choices you are making when building data-driven stories. These choices are reflected in the code and documentation, built and curated to be understood by people with as little technical knowledge of web design as we find possible with today's tools.

We favor [Svelte](https://svelte.dev/) over [React](https://react.dev/) because we believe Svelte's design is closer to the fundamental tools of the web (HTML/CSS). Svelte has been shown to be more approachable to newcomers, and does not require learning a whole ecosystem to get going.

The design choices that went into `scrolly-kit` and accompanying templates include making it possible for motivated users to learn why we style the website the way we do. Inspired by talks like Josh Comeau's [How to teach CSS](https://youtu.be/ZPTVr2pS0XE?si=A1vymxJE4Dsc336p), the goal is to nurture a growing mindset where styling is fun. We acknowledge that [Vibe Coding is somewhat boring](https://cassidoo.co/post/vibe-coding-yawn/), and that keeping the craft alive is vital.

So although you can use this library to just keep building cool data-driven stories, know that if you just want to show off a scrolly story, you can vibe code it with minimal effort. This library is meant to **learn and nurture a web platform that can host tailored data stories you own**; where you can learn and improve yourself to have a space to tell your stories.
