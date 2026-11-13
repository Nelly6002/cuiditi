<!-- Vertical scroll drives a horizontal track while the section is pinned (desktop). Phones swipe instead. -->
<script>
	import { onScroll, prefersReduced } from '#lib/motion.js';

	let { head, children } = $props();
	let sec, track;
	let dist = $state(0);
	let wide = $state(true);
	let reduce = $state(false);
	const pan = $derived(wide && !reduce);

	$effect(() => {
		reduce = prefersReduced();
		const mq = matchMedia('(min-width: 900px)');
		const update = () => {
			wide = mq.matches;
			dist = Math.max(0, track.scrollWidth - innerWidth);
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(track);
		mq.addEventListener('change', update);
		addEventListener('resize', update);
		return () => {
			ro.disconnect();
			mq.removeEventListener('change', update);
			removeEventListener('resize', update);
		};
	});

	$effect(() => {
		if (!pan) {
			track.style.transform = '';
			return;
		}
		const d = dist;
		return onScroll((p) => (track.style.transform = `translate3d(${-p * d}px, 0, 0)`), sec, ['start start', 'end end']);
	});
</script>

<section bind:this={sec} class="hpan" class:is-pan={pan} style={pan ? `height: calc(100vh + ${dist}px)` : undefined}>
	<div class="hpan-sticky">
		<div class="wrap hpan-head">{@render head()}</div>
		<div bind:this={track} class="hpan-track">{@render children()}</div>
	</div>
</section>
