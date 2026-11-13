<!--
	Full-bleed photo hero. The photo zooms in on arrival, then as you scroll it drifts down,
	the frame pulls in from the edges with rounded corners, and the copy lifts away.
-->
<script>
	import { animate } from 'motion';
	import { EASE, site } from '#lib/site.svelte.js';
	import { mix, onScroll, prefersReduced, range } from '#lib/motion.js';
	import RevealWords from './RevealWords.svelte';

	let { photo, eyebrow, title, lead, accent = [], tall = false, class: cls = '', children } = $props();
	let sec, frame, move, img, content;
	let arrived = false;

	$effect(() => {
		if (prefersReduced()) return;
		return onScroll(
			(p) => {
				const c = range(p, 0, 0.85);
				move.style.transform = `translate3d(0, ${mix(0, 24, p)}%, 0) scale(${mix(1, 1.14, p)})`;
				frame.style.clipPath = `inset(0px ${mix(0, 28, c)}px ${mix(0, 64, c)}px ${mix(0, 28, c)}px round ${mix(0, 28, c)}px)`;
				content.style.transform = `translate3d(0, ${mix(0, 45, p)}%, 0)`;
				content.style.opacity = String(1 - range(p, 0, 0.6));
			},
			sec,
			['start start', 'end start']
		);
	});

	$effect(() => {
		if (!site.introDone || arrived) return;
		arrived = true;
		const fades = content.querySelectorAll('[data-fade]');
		if (prefersReduced()) {
			img.style.transform = 'none';
			fades.forEach((el) => (el.style.opacity = '1'));
			return;
		}
		animate(img, { scale: [1.22, 1] }, { duration: 2.4, ease: EASE });
		fades.forEach((el) => animate(el, { opacity: [0, 1], y: [18, 0] }, { duration: 0.9, ease: EASE, delay: Number(el.dataset.fade) }));
	});
</script>

<section bind:this={sec} class="phero {tall ? 'phero-tall' : ''} {cls}">
	<div class="phero-frame" bind:this={frame}>
		<div class="phero-move" bind:this={move}>
			<img bind:this={img} class="phero-img" src={photo.src(1920)} alt={photo.alt} fetchpriority="high" style="transform: scale(1.22)" />
		</div>
		<span class="phero-shade" aria-hidden="true"></span>
	</div>
	<div class="wrap phero-content" bind:this={content}>
		{#if eyebrow}<p class="eyebrow eyebrow-light" data-fade="0.15" style="opacity: 0">{eyebrow}</p>{/if}
		<RevealWords as="h1" text={title} show={site.introDone} delay={2} {accent} class="phero-title" />
		{#if lead}<p class="phero-lead" data-fade="0.55" style="opacity: 0">{lead}</p>{/if}
		{#if children}<div class="phero-actions" data-fade="0.75" style="opacity: 0">{@render children()}</div>{/if}
	</div>
</section>
