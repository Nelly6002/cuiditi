<!-- Endless strip that speeds up with scroll velocity and reverses when you scroll back up. -->
<script>
	import { onScroll, prefersReduced } from '#lib/motion.js';

	let { base = -2.4, children } = $props();
	let track;

	$effect(() => {
		if (prefersReduced()) return;
		let x = 0;
		let dir = 1;
		let velocity = 0;
		let smooth = 0;
		let last = performance.now();
		let frame;
		const stopScroll = onScroll((_, info) => (velocity = info.y.velocity));
		const wrap = (v) => ((((v + 25) % 25) + 25) % 25) - 25;
		const tick = (now) => {
			const dt = Math.min(64, now - last) / 1000;
			last = now;
			smooth += (velocity - smooth) * 0.12;
			velocity *= 0.9;
			const factor = (smooth / 1000) * 4;
			if (factor < 0) dir = -1;
			else if (factor > 0) dir = 1;
			let move = dir * base * dt;
			move += dir * move * factor;
			x = wrap(x + move);
			track.style.transform = `translate3d(${x}%, 0, 0)`;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(frame);
			stopScroll();
		};
	});
</script>

<div class="marquee" aria-hidden="true">
	<div class="marquee-track" bind:this={track}>
		{#each [0, 1, 2, 3] as k (k)}<div class="marquee-set">{@render children()}</div>{/each}
	</div>
</div>
