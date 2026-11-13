<!-- Cards that pin one after another and stack, the ones underneath easing back as new ones land. -->
<script>
	import { mix, onScroll, prefersReduced, range } from '#lib/motion.js';

	/** `card` is a snippet rendered for each item. */
	let { items, card } = $props();
	let wrap;
	let cards = [];
	let dims = [];

	$effect(() => {
		if (prefersReduced()) return;
		const n = items.length;
		return onScroll(
			(p) => {
				for (let i = 0; i < n; i++) {
					const t = range(p, i / n, 1);
					cards[i].style.transform = `scale(${mix(1, 1 - (n - i) * 0.035, t)})`;
					dims[i].style.opacity = String(i === n - 1 ? 0 : mix(0, 0.35, t));
				}
			},
			wrap,
			['start start', 'end end']
		);
	});
</script>

<div bind:this={wrap} class="stack">
	{#each items as item, i}
		<div class="stack-slot" style="top: calc(var(--header-h) + 28px + {i * 26}px)">
			<div class="stack-card" bind:this={cards[i]}>
				{@render card(item, i)}
				<span class="stack-dim" bind:this={dims[i]} style="opacity: 0" aria-hidden="true"></span>
			</div>
		</div>
	{/each}
</div>
