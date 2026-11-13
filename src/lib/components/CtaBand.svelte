<!-- Closing band: a full photo that zooms out as it scrolls in, with a frosted card on top. -->
<script>
	import { magnetic, mix, onScroll, prefersReduced, range, reveal } from '#lib/motion.js';
	import RevealWords from './RevealWords.svelte';
	import Btn from './Btn.svelte';

	let { photo, title = 'Ready to make property move?', text = 'Create an account in a few minutes.', to = '/signup', label = 'Get started' } = $props();
	let band, img;

	$effect(() => {
		if (prefersReduced()) return;
		return onScroll(
			(p) => (img.style.transform = `translate3d(0, ${mix(-10, 10, p)}%, 0) scale(${mix(1.25, 1.08, range(p, 0, 0.5))})`),
			band,
			['start end', 'end start']
		);
	});
</script>

<section class="section ctaband-wrap">
	<div class="wrap">
		<div bind:this={band} class="ctaband graded">
			<img bind:this={img} src={photo.src(1920)} alt={photo.alt} loading="lazy" style="transform: scale(1.25)" />
			<span class="ctaband-shade" aria-hidden="true"></span>
			<div class="ctaband-in">
				<RevealWords as="h2" text={title} class="ctaband-title" />
				<div class="glass ctaband-card" use:reveal={{ delay: 4 }}>
					<p>{text}</p>
					<span class="magnetic" use:magnetic><Btn {to}>{label}</Btn></span>
				</div>
			</div>
		</div>
	</div>
</section>
