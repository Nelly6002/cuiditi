<!-- Counts up to `to` once in view. Updates the DOM directly. -->
<script>
	import { animate } from 'motion';
	import { EASE } from '#lib/site.svelte.js';
	import { once, prefersReduced } from '#lib/motion.js';

	let { to, prefix = '', suffix = '', duration = 2, decimals = 0 } = $props();
	const fmt = (v) =>
		prefix + v.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
	let el;

	$effect(() =>
		once(el, () => {
			if (prefersReduced()) el.textContent = fmt(to);
			else animate(0, to, { duration, ease: EASE, onUpdate: (v) => (el.textContent = fmt(v)) });
		})
	);
</script>

<span bind:this={el} class="tnum" aria-hidden="true">{fmt(0)}</span><span class="sr-only">{fmt(to)}</span>
