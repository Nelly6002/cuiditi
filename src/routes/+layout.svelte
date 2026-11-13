<script>
	import '#lib/styles/site.css';
	import '#lib/styles/pages.css';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import Lenis from 'lenis';
	import { animate } from 'motion';
	import Drop from 'phosphor-svelte/lib/Drop';
	import { EASE_IN_OUT, site } from '#lib/site.svelte.js';
	import { onScroll, prefersReduced } from '#lib/motion.js';
	import Intro from '#lib/components/Intro.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';

	let { children } = $props();
	let showIntro = $state(true);
	let curtain, bar;

	onMount(() => {
		const reduce = prefersReduced();
		if (reduce) {
			showIntro = false;
			site.introDone = true;
		}
		let lenis;
		let frame;
		if (!reduce) {
			// Smooth scrolling
			lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
			site.lenis = lenis;
			const raf = (t) => {
				lenis.raf(t);
				frame = requestAnimationFrame(raf);
			};
			frame = requestAnimationFrame(raf);
		}
		// Thin bar along the top edge that fills as you read
		const stopBar = onScroll((p) => (bar.style.transform = `scaleX(${p})`));
		return () => {
			cancelAnimationFrame(frame);
			lenis?.destroy();
			site.lenis = null;
			stopBar();
		};
	});

	// Freeze scrolling while the intro or the phone menu covers the page
	$effect(() => {
		const locked = showIntro || site.menuOpen;
		document.documentElement.classList.toggle('is-locked', showIntro);
		document.documentElement.classList.toggle('menu-open', site.menuOpen);
		const l = site.lenis;
		if (l) locked ? l.stop() : l.start();
	});

	// Page curtain: a green sheet sweeps up over the old page, the route changes, then it sweeps away.
	onNavigate((navigation) => {
		if (prefersReduced() || !curtain || navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		return new Promise((resolve) => {
			(async () => {
				curtain.style.transformOrigin = '50% 100%';
				await animate(curtain, { scaleY: [0, 1] }, { duration: 0.6, ease: EASE_IN_OUT }).finished;
				resolve();
				await navigation.complete;
				site.lenis ? site.lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0);
				curtain.style.transformOrigin = '50% 0%';
				await animate(curtain, { scaleY: [1, 0] }, { duration: 0.85, ease: EASE_IN_OUT, delay: 0.08 }).finished;
			})();
		});
	});

	const introDone = () => (site.introDone = true);
	const introGone = () => {
		showIntro = false;
		site.introDone = true;
	};
</script>

<a class="skip-link" href="#main">Skip to content</a>
<div class="progress" bind:this={bar} style="transform: scaleX(0)" aria-hidden="true"></div>
<SiteHeader hidden={showIntro} />
<main id="main">
	{@render children()}
</main>
<SiteFooter />
<div class="curtain" bind:this={curtain} style="transform: scaleY(0)" aria-hidden="true">
	<span class="curtain-mark"><Drop weight="fill" /></span>
</div>
{#if showIntro}<Intro onreveal={introDone} ondone={introGone} />{/if}
<div class="grain" aria-hidden="true"></div>
