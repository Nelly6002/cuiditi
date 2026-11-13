<script>
	import { animate } from 'motion';
	import Bank from 'phosphor-svelte/lib/Bank';
	import Check from 'phosphor-svelte/lib/Check';
	import Fingerprint from 'phosphor-svelte/lib/Fingerprint';
	import Megaphone from 'phosphor-svelte/lib/Megaphone';
	import PuzzlePiece from 'phosphor-svelte/lib/PuzzlePiece';
	import X from 'phosphor-svelte/lib/X';
	import { EASE, pageTitle } from '#lib/site.svelte.js';
	import { once, onScroll, prefersReduced, reveal } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import RevealImage from '#lib/components/RevealImage.svelte';
	import RevealWords from '#lib/components/RevealWords.svelte';
	import SecHead from '#lib/components/SecHead.svelte';

	// One photo cut into a grid. As you scroll the tiles drift apart and a few light up as "yours".
	const COLS = 10;
	const ROWS = 6;
	const MINE = new Set([13, 14, 24, 37, 46]);
	const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({ i, c: i % COLS, r: Math.floor(i / COLS) }));
	const split = photos.island;
	const url = split.src(1600);
	let frag;
	$effect(() => {
		if (prefersReduced()) return void frag.style.setProperty('--p', '1');
		return onScroll((p) => frag.style.setProperty('--p', String(p)), frag, ['start 85%', 'center 45%']);
	});

	// Today vs on Cuiditi: the old ways get struck through, the new ones get a tick.
	const TODAY = ['Deals take 90 to 180 days.', 'Buyers need the full plot price up front.', 'Sellers wait in private chats with no open bid.'];
	const OURS = ['Buy a fraction from ₦1,000.', 'Resell to another buyer on the platform.', 'The price is set openly by the market.'];
	let todayCard, oursCard;
	$effect(() => {
		const strikes = todayCard.querySelectorAll('.strike');
		const items = oursCard.querySelectorAll('li');
		if (prefersReduced()) {
			strikes.forEach((s) => (s.style.backgroundSize = '100% 1.5px'));
			items.forEach((li) => (li.style.opacity = '1'));
			return;
		}
		const a = once(todayCard, () => strikes.forEach((s, i) => animate(s, { backgroundSize: ['0% 1.5px', '100% 1.5px'] }, { duration: 0.7, ease: EASE, delay: 0.6 + i * 0.25 })), { margin: '0px 0px -15% 0px' });
		const b = once(
			oursCard,
			() =>
				items.forEach((li, i) => {
					animate(li, { opacity: [0, 1], x: [20, 0] }, { duration: 0.6, ease: EASE, delay: 1.2 + i * 0.2 });
					animate(li.querySelector('.tick'), { scale: [0, 1] }, { type: 'spring', stiffness: 500, damping: 15, delay: 1.3 + i * 0.2 });
				}),
			{ margin: '0px 0px -15% 0px' }
		);
		return () => (a(), b());
	});

	const POINTS = [
		[PuzzlePiece, 'Own in bits', 'Buy Cuids the way you buy data. Stack small, grow big.'],
		[Fingerprint, 'Prove ownership', 'Your stake lives on ledger records you can show anyone.'],
		[Megaphone, 'Trade in the open', 'Sell to another buyer on the platform instead of hiding in private chats.'],
		[Bank, 'Local payment rails', 'Paystack in, regulated escrow, verification on the map.']
	];
</script>

<svelte:head><title>{pageTitle('Cuid Shares')}</title></svelte:head>

<PageHero
	photo={photos.lekki}
	eyebrow="Cuid Shares"
	title="Own property in small pieces."
	accent={['pieces.']}
	lead="Tokenization splits one listing into Cuids, so hundreds of people can buy in, trade out and set the price on a live market."
/>

<section class="section">
	<div class="wrap">
		<SecHead title="One property. Many Cuids." text="Scroll to split this plot into the pieces people actually buy. The highlighted ones could be yours." />
		<div bind:this={frag} class="frag" style="--p: 0; --cols: {COLS}" role="img" aria-label="{split.alt}, split into a grid of small shares">
			{#each tiles as t (t.i)}
				<span
					class="frag-tile"
					class:is-mine={MINE.has(t.i)}
					style="--c: {t.c - (COLS - 1) / 2}; --r: {t.r - (ROWS - 1) / 2}; --k: {((t.i * 37) % 11) / 10}; background-image: url({url}); background-size: {COLS * 100}% {ROWS * 100}%; background-position: {(t.c / (COLS - 1)) * 100}% {(t.r / (ROWS - 1)) * 100}%"
				></span>
			{/each}
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap compare">
		<div class="card compare-card" bind:this={todayCard} use:reveal>
			<span class="chip chip-bad">Today</span>
			<h3>Most Nigerian property stays frozen.</h3>
			<ul>
				{#each TODAY as t (t)}
					<li><X weight="bold" class="x" /><span><span class="strike">{t}</span></span></li>
				{/each}
			</ul>
		</div>
		<div class="card compare-card compare-good" bind:this={oursCard} use:reveal={{ delay: 1 }}>
			<span class="chip chip-ok">On Cuiditi</span>
			<h3>One property, many Cuids.</h3>
			<ul>
				{#each OURS as t (t)}
					<li style="opacity: 0"><span class="tick" style="transform: scale(0)"><Check weight="bold" /></span>{t}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap sticky-split">
		<div class="sticky-col"><RevealWords text="Built for how Nigerians pay and own." /></div>
		<ul class="rows big-rows">
			{#each POINTS as [I, t, d], i (t)}
				<li class="row" use:reveal={{ delay: i }}>
					<span class="ic"><I weight="duotone" /></span>
					<span><b>{t}</b><span>{d}</span></span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap split">
		<RevealImage photo={photos.skyline} class="split-media" />
		<div>
			<SecHead
				title="Proven in other markets."
				text="Dubai and Singapore already do this on regulated rails. Building fractions sell in 48 hours and ownership settles in under 3 minutes. Cuiditi brings that liquidity home."
			/>
		</div>
	</div>
</section>

<CtaBand photo={photos.abuja} title="Start with ₦1,000." text="Pick a verified parcel and buy your first Cuids." />
