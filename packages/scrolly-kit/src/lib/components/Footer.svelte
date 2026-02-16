<script lang="ts">
import { Youtube, Github, Linkedin, ExternalLink } from "@lucide/svelte";

interface SocialLink {
	href: string;
	label: string;
	icon: 'youtube' | 'github' | 'linkedin' | 'bluesky';
}

interface BottomLink {
	href: string;
	label: string;
}

interface Props {
	/** Forces light (UVM green) or dark theme */
	theme?: 'light' | 'dark';
	/** Logo image source */
	logoSrc?: string;
	/** Logo alt text */
	logoAlt?: string;
	/** Social media links */
	socialLinks?: SocialLink[];
	/** Bottom row links (accessibility, privacy, etc.) */
	bottomLinks?: BottomLink[];
	/** Copyright text */
	copyright?: string;
}

let {
	theme,
	logoSrc = '/UVM_Logo_Primary_Horiz_W_PunchOut.png',
	logoAlt = 'Logo',
	socialLinks = [
		{ href: 'https://www.youtube.com/@UVMcomplexity', label: 'YouTube', icon: 'youtube' },
		{ href: 'https://github.com/Vermont-complex-systems', label: 'GitHub', icon: 'github' },
		{ href: 'https://bsky.app/profile/vcsi.bsky.social', label: 'Bluesky', icon: 'bluesky' },
		{ href: 'https://linkedin.com/school/uvm-vcsc/', label: 'LinkedIn', icon: 'linkedin' }
	],
	bottomLinks = [
		{ href: 'https://www.uvm.edu/equal-opportunity/americans-disabilities-act-and-reasonable-accommodations', label: 'Accessibility' },
		{ href: 'https://www.uvm.edu/compliance/website-privacy-policy/terms-use', label: 'Privacy/Terms of Use' }
	],
	copyright = `© ${new Date().getFullYear()}, Vermont Complex Systems Institute`
}: Props = $props();
</script>

<footer
	class={[
		'footer',
		theme === 'light' && 'theme-light',
		theme === 'dark' && 'theme-dark'
	]}
>
	<div class="footer-inner">
		<div class="footer-logo">
			<img src={logoSrc} alt={logoAlt} class="logo-img" />
			<ul class="social-icons">
				{#each socialLinks as link}
					<li>
						<a href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
							{#if link.icon === 'youtube'}
								<Youtube class="icon" size={20} />
							{:else if link.icon === 'github'}
								<Github class="icon" size={20} />
							{:else if link.icon === 'linkedin'}
								<Linkedin class="icon" size={20} />
							{:else if link.icon === 'bluesky'}
								<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
								</svg>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="footer-bottom">
			{#each bottomLinks as link}
				<a class="cc-footer-copy" href={link.href} target="_blank" rel="noreferrer">
					<span class="link-text">{link.label} <ExternalLink class="icon" size={14} /></span>
				</a>
			{/each}
			<div class="cc-footer-copy">{copyright}</div>
		</div>
	</div>
</footer>

<style>
.footer {
	width: 100%;
	/* Inherits --footer-bg from parent, or falls back to accent color */
	background-color: var(--footer-bg, var(--vcsi-color-accent));
	border-top: 1px solid var(--footer-border, rgba(255, 255, 255, 0.2));
	padding: var(--vcsi-space-2xl) 0 var(--vcsi-space-xl);
}

/* theme="light" - forces UVM green (same as default, but explicit) */
.footer.theme-light {
	background-color: var(--vcsi-color-uvm-green);
	border-top-color: rgba(255, 255, 255, 0.2);
}

/* theme="dark" - forces dark theme */
.footer.theme-dark {
	background-color: rgb(45, 45, 45);
	border-top-color: rgba(255, 255, 255, 0.1);
}

/* Inner container aligns content with header/main page */
.footer-inner {
	width: 100%;
	max-width: var(--vcsi-page-max-width);
	margin-inline: auto;
	padding-inline: var(--vcsi-page-inline-padding);
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: var(--vcsi-space-xl);
	align-items: start;
}

.footer-logo {
	grid-column: 1;
	display: flex;
	flex-direction: column;
	gap: var(--vcsi-space-sm);
}

.logo-img {
	width: 200px;
	height: auto;
}

.footer-bottom {
	grid-column: 1 / -1;
	display: flex;
	flex-wrap: nowrap;
	gap: var(--vcsi-space-lg);
	align-items: center;
	padding-top: var(--vcsi-space-lg);
	margin-top: var(--vcsi-space-md);
	border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.social-icons {
	display: flex;
	gap: var(--vcsi-space-md);
	list-style: none;
	padding: 0;
	margin: 0;
}

.social-icons a {
	text-decoration: none;
	color: var(--vcsi-color-uvm-gold);
}

.cc-footer-copy {
	color: var(--vcsi-color-white);
	font-weight: 500;
	font-size: 1rem;
	text-decoration: none;
	white-space: nowrap;
}

.cc-footer-copy .link-text {
	display: inline-flex;
	align-items: center;
	gap: var(--vcsi-space-xs);
}

.cc-footer-copy:last-child {
	margin-left: auto;
}

@media (max-width: 768px) {
	.footer-inner {
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: auto auto auto;
		gap: var(--vcsi-space-lg) var(--vcsi-space-md);
	}

	.footer-logo {
		grid-column: 1 / 3;
		grid-row: 1;
		gap: 0.75rem;
	}

	.footer-bottom {
		grid-column: 1 / 3;
		grid-row: 2;
		flex-wrap: wrap;
		gap: var(--vcsi-space-md);
	}

	.cc-footer-copy {
		font-size: 0.85rem;
	}

	.cc-footer-copy:last-child {
		width: 100%;
		margin-left: 0;
	}
}
</style>
