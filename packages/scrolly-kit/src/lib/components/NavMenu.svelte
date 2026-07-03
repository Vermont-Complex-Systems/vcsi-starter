<script lang="ts">
import { X } from "@lucide/svelte";

interface NavLink {
	href: string;
	label: string;
	external?: boolean;
}

interface Props {
	visible: boolean;
	close: (skipFocus?: boolean | string) => void;
	links?: NavLink[];
}

let { visible, close, links = [] }: Props = $props();

let mainEl: HTMLElement | null | undefined;
let closeBtnEl: HTMLButtonElement | undefined;

export const open = () => {
	closeBtnEl?.focus();
	// `inert` blocks focus AND assistive tech; aria-hidden alone still let
	// keyboard users Tab out of the open menu into the page underneath.
	if (mainEl) mainEl.inert = true;
};

const onClose = (e?: Event | string) => {
	if (e && typeof e !== "string" && e instanceof KeyboardEvent && e.type === "keyup" && e.key !== "Escape") return;
	if (mainEl) mainEl.inert = false;
	close(e === "skip");
};

$effect(() => {
	mainEl = document.querySelector("main");
});

// Close on navigation - using a simple approach without SvelteKit dependency
$effect(() => {
	if (typeof window !== 'undefined') {
		const handleNavigation = () => onClose("skip");
		window.addEventListener('popstate', handleNavigation);
		return () => window.removeEventListener('popstate', handleNavigation);
	}
});
</script>

<svelte:window on:keyup={onClose} />

<nav id="nav-menu" class:visible aria-hidden={!visible}>
	<div class="nav-content">
		<button
			class="btn-close"
			aria-label="close menu"
			bind:this={closeBtnEl}
			onclick={onClose}
		>
			<X class="icon" size={20} />
		</button>

		<div class="nav-links">
			<ul>
				{#each links as link}
					<li>
						<a
							href={link.href}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noopener noreferrer' : undefined}
							onclick={() => onClose("skip")}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>

<style>
/* Menu container - slides in from right */
nav {
	position: fixed;
	top: 0;
	right: 0;
	width: 100%;
	max-width: min(17.5rem, 85vw);
	height: 100svh;
	z-index: 1001;
	visibility: hidden;
	transform: translateX(100%);
	transition: transform var(--vcsi-transition-base);
	overflow-y: auto;
	/* Light mode: dark menu */
	background: var(--vcsi-gray-900);
	color: var(--vcsi-gray-100);
	border-left: 1px solid var(--vcsi-gray-700);
	box-shadow: -0.25rem 0 1.5rem rgba(0, 0, 0, 0.3);
}

/* Dark mode: light menu */
:global(.dark) nav {
	background: var(--vcsi-gray-200);
	color: var(--vcsi-gray-800);
	border-left: 1px solid var(--vcsi-gray-300);
	box-shadow: -0.25rem 0 1.5rem rgba(0, 0, 0, 0.2);
}

nav.visible {
	visibility: visible;
	transform: translateX(0);
}

.nav-content {
	padding: var(--vcsi-space-xl) var(--vcsi-space-lg);
	height: 100%;
	display: flex;
	flex-direction: column;
}

/* Close button */
.btn-close {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2.5rem;
	height: 2.5rem;
	border: 1px solid var(--vcsi-gray-700);
	border-radius: var(--vcsi-radius-md);
	background: transparent;
	color: var(--vcsi-gray-100);
	margin-bottom: var(--vcsi-space-xl);
	padding: 0;
	cursor: pointer;
	transition: all var(--vcsi-transition-base);
}

.btn-close:hover {
	background: var(--vcsi-gray-800);
	transform: rotate(var(--right-tilt, 0)) scale(1.05);
}

:global(.dark) .btn-close {
	border-color: var(--vcsi-gray-400);
	color: var(--vcsi-gray-800);
}

:global(.dark) .btn-close:hover {
	background: var(--vcsi-gray-300);
}

/* Menu sections */
.nav-links {
	margin-bottom: var(--vcsi-space-xl);
}

ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

li {
	margin-bottom: 0.75rem;
}

/* Links */
a {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: var(--vcsi-space-sm) 0;
	font-family: var(--vcsi-font-sans);
	font-size: var(--vcsi-font-size-md);
	font-weight: 500;
	color: var(--vcsi-gray-100);
	text-decoration: none;
	transition: all var(--vcsi-transition-base);
}

a:hover {
	color: var(--vcsi-color-white);
	transform: translateX(0.25rem);
}

:global(.dark) a {
	color: var(--vcsi-gray-800);
}

:global(.dark) a:hover {
	color: var(--vcsi-gray-900);
}
</style>
