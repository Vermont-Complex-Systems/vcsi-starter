<script lang="ts">
    import { scrollReveal, Footer } from '@the-vcsi/scrolly-kit';
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import skylineImage from './assets/skyline.jpg?enhanced';

    // Enhanced image sources for preloading
    const sources = skylineImage.sources;
</script>

<svelte:head>
    <link rel="preload" as="image" type="image/avif" imagesrcset={sources.avif} imagesizes="100vw" fetchpriority="high" />
    <link rel="preload" as="image" type="image/webp" imagesrcset={sources.webp} imagesizes="100vw" fetchpriority="high" />
</svelte:head>


<BackToHome />

<div class="landing-page">
    <!-- Hero -->
    <section class="hero">
        <enhanced:img
            src={skylineImage}
            alt=""
            class="hero-bg"
            sizes="100vw"
            fetchpriority="high"
        />
        <div class="hero-overlay">
            <div class="hero-content">
                <h1>Not all stories are scrolly</h1>
                <p class="subtitle">Some of the best stories are about creative themes</p>
                <p class="caption">(story taken from <a href="https://vermontcomplexsystems.org/events/cnww/">CNWW</a>. The story shows how we can build custom layout given a theme.)</p>
            </div>
        </div>
    </section>

    <!-- Intro -->
    <section class="intro" use:scrollReveal>
        <p>The Complex Networks Winter Workshop (CNWW) is an international school that offers an extraordinary opportunity for participants to engage in rigorous transdisciplinary complexity science research alongside some of the top researchers in the field of networks.</p>
    </section>

    <!-- Content Section 1 -->
    <section class="content-row" use:scrollReveal>
        <div class="image-col">
            <img src="/common/assets/events/cnww_social.jpg" alt="CNWW Social" />
        </div>
        <div class="text-col">
            <p>The CNWW will focus on the themes detailed below and promote a lively, versatile and dynamic approach that includes lectures and a strong hands-on component framed by experts from a variety of disciplines. Including:</p>
            <ul>
                <li>Introduction to Network Theory</li>
                <li>Random Networks</li>
                <li>Social, Ecological, Technological Networks</li>
                <li>Epidemiological Networks</li>
                <li>Big Data and Complex Networks</li>
                <li>Complex Networks applications in Northern Research</li>
            </ul>
            <p>The training will also allow the development of interpersonal skills such as networking and international scientific collaboration, creativity and communication in a transdisciplinary research context.</p>
        </div>
    </section>

    <!-- Content Section 2 -->
    <section class="content-row reverse" use:scrollReveal>
        <div class="image-col">
            <img src="/common/assets/events/cnww_sliding.jpg" alt="CNWW Sliding" loading="lazy" />
        </div>
        <div class="text-col">
            <p>Up to 40 international graduate students, postdoctoral fellows and professionals from different disciplines will be accepted.</p>
            <p>Proficiency in English and some background in science or mathematics are required. Participants are expected to attend the entire session. Applicants are welcome from all geographic regions. Underrepresented minorities and women are encouraged to apply.</p>
            <p><strong>Application Deadline:</strong> May 15th, 2025</p>
            <p><strong>Notice of acceptance:</strong> June 1st, 2025</p>
            <p><strong>Registration Deadline:</strong> July 1st, 2025</p>
            <h3>Application Requirements</h3>
            <ul>
                <li>Completed application form</li>
                <li>Up-to-date curriculum vitae</li>
            </ul>
            <a href="https://drive.google.com/open?id=1iEB_EwK2rvqHYBRPQsdc4rKODSO1WwyLpirm-edV10E" class="cta-button" target="_blank" rel="noopener noreferrer">Apply now!</a>
        </div>
    </section>

    <!-- Content Section 3 -->
    <section class="content-row" use:scrollReveal>
        <div class="image-col">
            <img src="/common/assets/events/cnww_monastery.jpg" alt="CNWW Monastery" loading="lazy" />
        </div>
        <div class="text-col">
            <p>The Winter Workshop will be held at the historic Monastère des Augustines in Quebec City, a serene haven of wellness and heritage, originally founded in 1639.</p>
            <h3>Accommodation</h3>
            <p>All participants will stay in one of the Monastery's rooms for the entire duration of the workshop.</p>
            <p><strong>Your participation fees include:</strong></p>
            <ul>
                <li>lodging at the monastery</li>
                <li>breakfast</li>
                <li>lunch breaks</li>
                <li>coffee breaks</li>
                <li>access to the monastery</li>
                <li>guided tour of the monastery</li>
                <li>cocktail reception</li>
            </ul>
            <h3>Room Types and Registration Fees</h3>
            <p><strong>Chambre Authentique:</strong> 1451.43 CAD</p>
            <p><strong>Chambre Authentique Double:</strong> 1080.81 CAD per person</p>
            <p><strong>Contemporaine Simple:</strong> 1784.70 CAD</p>
            <p><strong>Contemporaine Double:</strong> 1164.15 CAD per person</p>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials" use:scrollReveal>
        <h2>Testimonials</h2>
        <div class="testimonials-layout">
            <div class="testimonials-list">
                <blockquote>
                    <p>"The CNWW allowed me to establish bonds with my peers in network science from around the globe. Since the workshop, I have been connecting with them and I think these could become lasting friendships that will foster collaboration and a broader, more diverse understanding of network science through casual discussion."</p>
                    <footer>Sam Rosenblatt<br/>University of Vermont</footer>
                </blockquote>
                <blockquote>
                    <p>"CNWW was the perfect scholarly vacation. I learned so much, made new friends, experienced a beautiful city, and had a safe and supportive environment to take intellectual risks beyond what my typical responsibilities allow. I truly learned something from every single person I met at CNWW, and each welcomed me as someone from whom they could learn as well."</p>
                    <footer>Sarah Shugars<br/>Network Science Institute, Northeastern University</footer>
                </blockquote>
                <blockquote>
                    <p>"The multiple disciplines represented by all the participants, the knowledgeable and highly approachable lecturers and mentors, the multicultural atmosphere and the historical location, the scientific content of the lectures, the imaginative research ideas, and the intense collaborative work that emerges during this event make CNWW one of most satisfying workshops that I have ever attended."</p>
                    <footer>José R. Nicolás-Carlock<br/>National Autonomous University of Mexico</footer>
                </blockquote>
                <blockquote>
                    <p>"The most engaging workshop I have ever attended! The organizers put great effort in encouraging a collaborative, multi-disciplinary environment where ideas about complex networks could be explored."</p>
                    <footer>Niall Keleher<br/>U.C. Berkeley</footer>
                </blockquote>
            </div>
            <div class="testimonials-images">
                <img src="/common/assets/events/cnww_snowball.jpg" alt="CNWW Activity" loading="lazy" />
                <img src="/common/assets/events/cnww_singing.jpg" alt="CNWW Social" loading="lazy" />
            </div>
        </div>
    </section>

    <!-- Gallery -->
    <section class="gallery" use:scrollReveal>
        <div class="gallery-grid">
            <img src="/common/assets/events/cnww_cats.jpg" alt="CNWW" loading="lazy" />
            <img src="/common/assets/events/cnww_hot.jpg" alt="CNWW" loading="lazy" />
            <img src="/common/assets/events/cnww_restaurant.jpg" alt="CNWW" loading="lazy" />
            <img src="/common/assets/events/cnww_fireplace.jpg" alt="CNWW" loading="lazy" />
        </div>
    </section>

    <!-- Logos -->
    <section class="logos" use:scrollReveal>
        <div class="logos-row">
            <img src="/Roboctopus_2024.png" alt="Roboctopus" />
            <img src="/UVM_Logo_Primary_Horiz_W_PunchOut.png" alt="UVM" />
            <img src="/common/assets/logos/netsi.png" alt="NetSI" />
            <img src="/common/assets/logos/rgb_logo_Sentinelle_Nord_ang.png" alt="Sentinelle Nord" />
        </div>
    </section>

    <Footer />
</div>

<style>
    /* Story theme tokens - single source of truth */
    .landing-page {
        --story-bg: #162F4B;
        --story-fg: white;
        --story-border: rgba(255, 255, 255, 0.2);
        --footer-bg: #162F4B;
        --footer-border: rgba(255, 255, 255, 0.2);

        background: var(--story-bg);
        color: var(--story-fg);
        min-height: 100vh;
        max-width: none !important;
        padding: 0 !important;
    }

    /* Hero */
    .hero {
        position: relative;
        height: 100vh;
        overflow: hidden;
    }

    .hero :global(.hero-bg) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hero-content {
        text-align: center;
        color: var(--story-fg);
        position: relative;
        z-index: 1;
    }

    .hero h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        margin-bottom: 1rem;
    }

    .hero a {
        color: white
    }

    .hero .subtitle {
        font-size: clamp(1.2rem, 3vw, 2rem);
        font-family: var(--vcsi-font-serif);
    }

    .hero .caption {
        font-size: clamp(0.8rem, 1.5vw, 1.2rem);
        opacity: 0.8;
    }

    /* Intro */
    .intro {
        max-width: 900px;
        margin: 0 auto;
        padding: 4rem var(--vcsi-page-inline-padding);
        text-align: center;
    }

    .intro p {
        font-size: 1.25rem;
        line-height: 1.6;
        font-family: var(--vcsi-font-serif);
        color: var(--story-fg);
    }

    /* Content Rows */
    .content-row {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: 3rem;
        padding: 4rem var(--vcsi-page-inline-padding);
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }

    .content-row.reverse {
        grid-template-columns: 1.2fr 0.8fr;
    }

    .content-row.reverse .image-col {
        order: 1;
    }

    .image-col img {
        width: 100%;
        border-radius: var(--vcsi-radius-md);
    }

    .text-col {
        color: var(--story-fg);
    }

    .text-col h3 {
        font-size: 1.3rem;
        margin: 2rem 0 1rem;
    }

    .text-col p {
        font-family: var(--vcsi-font-serif);
        line-height: 1.6;
        margin-bottom: 1rem;
    }

    .text-col ul {
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
        font-family: var(--vcsi-font-serif);
    }

    .text-col li {
        margin-bottom: 0.5rem;
    }

    .cta-button {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.75rem 2rem;
        background: var(--story-fg);
        color: var(--story-bg);
        font-weight: 600;
        border-radius: var(--vcsi-radius-md);
        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    /* Testimonials */
    .testimonials {
        padding: 4rem var(--vcsi-page-inline-padding);
        max-width: 1400px;
        margin: 0 auto;
    }

    .testimonials h2 {
        text-align: center;
        color: var(--story-fg);
        font-size: 2.5rem;
        margin-bottom: 3rem;
    }

    .testimonials-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 4rem;
        align-items: start;
    }

    .testimonials-list {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    blockquote {
        margin: 0;
    }

    blockquote p {
        font-family: var(--vcsi-font-serif);
        font-style: italic;
        font-size: 1.1rem;
        line-height: 1.7;
        color: var(--story-fg);
        margin-bottom: 1rem;
    }

    blockquote footer {
        text-align: right;
        color: var(--story-fg);
        font-weight: 600;
        line-height: 1.4;
    }

    .testimonials-images {
        position: sticky;
        top: 6rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .testimonials-images img {
        width: 100%;
        border-radius: var(--vcsi-radius-md);
    }

    /* Gallery */
    .gallery {
        padding: 4rem var(--vcsi-page-inline-padding);
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .gallery-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: var(--vcsi-radius-md);
    }

    /* Logos */
    .logos {
        padding: 4rem var(--vcsi-page-inline-padding);
        border-top: 1px solid var(--story-border);
    }

    .logos-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 3rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .logos-row img {
        height: 80px;
        width: auto;
        filter: brightness(0) invert(1);
    }

    /* Scroll Reveal Animations */
    @media (prefers-reduced-motion: no-preference) {
        :global(section[data-animate="true"]) {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        :global(section[data-animate="true"][data-revealed="true"]) {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(section[data-animate="true"]) {
            opacity: 1;
            transform: none;
        }
    }

    /* Mobile */
    @media (max-width: 768px) {
        .content-row,
        .content-row.reverse {
            grid-template-columns: 1fr;
            padding: 2rem var(--vcsi-page-inline-padding);
        }

        .content-row .image-col,
        .content-row.reverse .image-col {
            order: -1;
        }

        .testimonials-layout {
            grid-template-columns: 1fr;
        }

        .testimonials-images {
            position: static;
            flex-direction: row;
        }

        .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .logos-row img {
            height: 50px;
        }
    }
</style>
