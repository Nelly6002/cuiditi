<!-- Deep green closing band. The giant wordmark rises letter by letter as the footer scrolls in. -->
<script>
	import { mix, onScroll, prefersReduced, range } from '#lib/motion.js';
	import { MAIN, MORE } from '#lib/data/content.js';
	import Logo from './Logo.svelte';

	let footer;
	let letters = [];
	const WORD = 'Cuiditi'.split('');

	$effect(() => {
		if (prefersReduced()) return;
		return onScroll(
			(p) =>
				letters.forEach((el, i) => {
					const start = 0.25 + i * 0.06;
					el.style.transform = `translate3d(0, ${mix(70, 0, range(p, start, Math.min(start + 0.4, 1)))}%, 0)`;
				}),
			footer,
			['start end', 'end end']
		);
	});
</script>

<footer bind:this={footer} class="ftr">
	<div class="wrap ftr-top">
		<div class="ftr-brand">
			<Logo light />
			<p>A jurisdiction first real estate platform for moving property in Nigeria.</p>
		</div>
		<div class="ftr-cols">
			<div>
				<h2 class="ftr-h">Product</h2>
				<ul>{#each MAIN as [to, l] (to)}<li><a href={to}>{l}</a></li>{/each}</ul>
			</div>
			<div>
				<h2 class="ftr-h">Learn</h2>
				<ul>
					{#each MORE as [to, l] (to)}<li><a href={to}>{l}</a></li>{/each}
					<li><a href="/credits">Photo credits</a></li>
				</ul>
			</div>
			<div>
				<h2 class="ftr-h">Contact</h2>
				<ul>
					<li><a href="mailto:support@cuiditi.com">support@cuiditi.com</a></li>
					<li><a href="https://wa.me/2347070927044">WhatsApp +234 707 092 7044</a></li>
					<li><a href="/signin">Sign in</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="ftr-word" aria-hidden="true">
		{#each WORD as c, i}<span bind:this={letters[i]} style="transform: translate3d(0, 70%, 0)">{c}</span>{/each}
	</div>
	<div class="wrap ftr-legal">
		<span>© {new Date().getFullYear()} Cuiditi. All rights reserved.</span>
		<span>Built in Nigeria, for Nigeria and beyond.</span>
	</div>
</footer>
