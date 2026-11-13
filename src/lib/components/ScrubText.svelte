<!-- A statement that lights up word by word as it scrolls through the viewport. Photos become pills in the sentence. -->
<script>
	import { mix, onScroll, prefersReduced, range } from '#lib/motion.js';

	let { parts, class: cls = '' } = $props();
	const tokens = $derived(
		parts.flatMap((p) => (typeof p === 'string' ? p.split(' ').filter(Boolean).map((w) => ({ w })) : [{ photo: p }]))
	);
	const label = $derived(parts.filter((p) => typeof p === 'string').join(' '));
	let el;

	$effect(() => {
		const nodes = [...el.querySelectorAll('[data-t]')];
		if (prefersReduced()) {
			nodes.forEach((n) => {
				n.style.opacity = '1';
				n.style.transform = 'none';
			});
			return;
		}
		const n = nodes.length;
		return onScroll(
			(p) =>
				nodes.forEach((node, i) => {
					const t = range(p, i / n, (i + 1) / n);
					if (node.dataset.t === 'w') node.style.opacity = String(mix(0.14, 1, t));
					else {
						node.style.opacity = String(t);
						node.style.transform = `scale(${mix(0.3, 1, t)})`;
					}
				}),
			el,
			['start 85%', 'end 50%']
		);
	});
</script>

<p bind:this={el} class="scrub {cls}" aria-label={label}>
	{#each tokens as t}{#if t.w}<span data-t="w" aria-hidden="true" style="opacity: 0.14">{t.w}</span>{' '}{:else}<span data-t="p" class="pill-img" aria-hidden="true" style="opacity: 0; transform: scale(0.3)"><img src={t.photo.src(330)} alt="" loading="lazy" /></span>{' '}{/if}{/each}
</p>
