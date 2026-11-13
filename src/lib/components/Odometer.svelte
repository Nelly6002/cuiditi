<!-- Every digit spins through a full turn before landing on its value. -->
<script>
	import { animate } from 'motion';
	import { once, prefersReduced } from '#lib/motion.js';

	let { value, class: cls = '' } = $props();
	const chars = $derived(value.split(''));
	const strip = Array.from({ length: 20 }, (_, k) => k % 10);
	let el;

	$effect(() =>
		once(
			el,
			() => {
				const reduce = prefersReduced();
				el.querySelectorAll('.odo-strip').forEach((s, order) => {
					const d = Number(s.dataset.d);
					const y = `${-(reduce ? d : 10 + d) * 1.1}em`;
					if (reduce) s.style.transform = `translateY(${y})`;
					else animate(s, { y: ['0em', y] }, { duration: 2.4, ease: [0.2, 0.9, 0.1, 1], delay: order * 0.08 });
				});
			},
			{ margin: '0px 0px -15% 0px' }
		)
	);
</script>

<span bind:this={el} class="odo {cls}"><span class="sr-only">{value}</span>{#each chars as c}{#if /\d/.test(c)}<span class="odo-col" aria-hidden="true"><span class="odo-strip" data-d={c}>{#each strip as k}<span>{k}</span>{/each}</span></span>{:else}<span class="odo-sep" aria-hidden="true">{c}</span>{/if}{/each}</span>
