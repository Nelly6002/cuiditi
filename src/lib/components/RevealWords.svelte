<!-- Words rise out of masks one after another, on scroll, or on cue with `show`. -->
<script>
	import { animate, stagger } from 'motion';
	import { EASE } from '#lib/site.svelte.js';
	import { once, prefersReduced } from '#lib/motion.js';

	let { text, as = 'h2', class: cls = '', accent = [], delay = 0, show = undefined } = $props();
	const bare = (w) => w.replace(/[.,'’?]/g, '').toLowerCase();
	const words = $derived(text.split(' '));
	const accented = $derived(new Set(accent.map(bare)));
	let el;
	let played = false;

	function play() {
		if (played || !el) return;
		played = true;
		const spans = el.querySelectorAll('.word-mask > span');
		if (prefersReduced()) return spans.forEach((s) => (s.style.transform = 'none'));
		animate(spans, { y: ['115%', '0%'], rotate: [5, 0] }, { duration: 1, ease: EASE, delay: stagger(0.055, { startDelay: delay * 0.08 }) });
	}

	$effect(() => {
		if (show === undefined) return once(el, play);
		if (show) play();
	});
</script>

<svelte:element this={as} bind:this={el} class="reveal-words {cls}" aria-label={text}>
	{#each words as w, i}<span class="word-mask" aria-hidden="true"><span class={accented.has(bare(w)) ? 'accent' : undefined} style="transform: translateY(115%) rotate(5deg)">{w}</span></span>{i < words.length - 1 ? ' ' : ''}{/each}
</svelte:element>
