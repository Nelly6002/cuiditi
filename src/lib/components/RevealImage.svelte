<!-- Photo that wipes open from a smaller crop as it enters, then drifts against the scroll. -->
<script>
	import { animate } from 'motion';
	import { EASE } from '#lib/site.svelte.js';
	import { mix, once, onScroll, prefersReduced } from '#lib/motion.js';

	let { photo, w = 1280, class: cls = '', eager = false, children } = $props();
	let frame, img;

	$effect(() => {
		if (prefersReduced()) {
			frame.style.clipPath = 'none';
			img.style.transform = 'none';
			return;
		}
		const stopView = once(
			frame,
			() => animate(frame, { clipPath: ['inset(14% 10% 14% 10% round 18px)', 'inset(0% 0% 0% 0% round 18px)'] }, { duration: 1.3, ease: EASE }),
			{ margin: '0px 0px -12% 0px' }
		);
		const stopScroll = onScroll((p) => (img.style.transform = `translate3d(0, ${mix(-8, 8, p)}%, 0) scale(1.18)`), frame, ['start end', 'end start']);
		return () => {
			stopView();
			stopScroll();
		};
	});
</script>

<div bind:this={frame} class="frame graded {cls}" style="clip-path: inset(14% 10% 14% 10% round 18px)">
	<img bind:this={img} src={photo.src(w)} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} style="transform: scale(1.18)" />
	{@render children?.()}
</div>
