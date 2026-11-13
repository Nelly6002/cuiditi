<script>
	import { animate } from 'motion';
	import ArrowsLeftRight from 'phosphor-svelte/lib/ArrowsLeftRight';
	import Binoculars from 'phosphor-svelte/lib/Binoculars';
	import Coins from 'phosphor-svelte/lib/Coins';
	import Handshake from 'phosphor-svelte/lib/Handshake';
	import TrendUp from 'phosphor-svelte/lib/TrendUp';
	import { EASE, pageTitle } from '#lib/site.svelte.js';
	import { magnetic, once, prefersReduced, reveal } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import { CORRIDORS } from '#lib/data/content.js';
	import Btn from '#lib/components/Btn.svelte';
	import Counter from '#lib/components/Counter.svelte';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import ExpandRows from '#lib/components/ExpandRows.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import SecHead from '#lib/components/SecHead.svelte';
	import StickyStack from '#lib/components/StickyStack.svelte';

	const WAYS = [
		{ Icon: ArrowsLeftRight, t: 'Flip', d: 'Buy low and sell high on listings, sometimes in the same week.', photo: photos.market },
		{ Icon: Coins, t: 'Rent yield', d: 'Collect rent while your positions are funded.', photo: photos.island },
		{ Icon: Binoculars, t: 'Scout', d: 'Spot hot LGAs before the crowd and position early.', photo: photos.lekki },
		{ Icon: Handshake, t: 'Broker', d: 'Close clients with live, verified inventory.', photo: photos.skyline }
	];

	// Example week for the chart. Clearly labelled as an example in the UI.
	const WEEK = [0.8, 3.4, 2.6, 7.9, 12.4];
	const DAYS = ['M', 'T', 'W', 'T', 'F'];
	const W = 460;
	const H = 200;
	const pts = WEEK.map((v, i) => [20 + (i * (W - 40)) / (WEEK.length - 1), H - 16 - (v / 14) * (H - 40)]);
	const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
	const area = `${line} L${pts.at(-1)[0]},${H} L${pts[0][0]},${H} Z`;

	// The line draws itself, the area fades in, the dots pop.
	let chart, path, fillEl;
	let dots = [];
	$effect(() => {
		if (prefersReduced()) {
			path.style.strokeDashoffset = '0';
			fillEl.style.opacity = '1';
			dots.forEach((d) => (d.style.transform = 'none'));
			return;
		}
		return once(
			chart,
			() => {
				animate(path, { strokeDashoffset: [1, 0] }, { duration: 1.8, ease: EASE, delay: 0.2 });
				animate(fillEl, { opacity: [0, 1] }, { duration: 1, delay: 1.2 });
				dots.forEach((d, i) => animate(d, { scale: [0, 1] }, { type: 'spring', stiffness: 400, damping: 14, delay: 0.3 + i * 0.32 }));
			},
			{ margin: '0px 0px -15% 0px' }
		);
	});
</script>

<svelte:head><title>{pageTitle('Trade property')}</title></svelte:head>

<PageHero
	photo={photos.market}
	eyebrow="Cuid Trade"
	title="Day trade property like water."
	accent={['water.']}
	lead="Buy dips on live markets, sell into strength the same week, and earn from yield, trades and agent commissions in one account."
>
	<span class="magnetic" use:magnetic><Btn to="/signup">Get started</Btn></span>
</PageHero>

<section class="section">
	<div class="wrap split">
		<div>
			<SecHead title="Property that moves every day." text="A new income stream for traders, brokers and side hustlers who read the market. Every parcel is verified before it is listed." />
		</div>
		<div class="card chart" bind:this={chart} use:reveal={{ delay: 1 }}>
			<div class="chart-head">
				<span class="chip chip-ok"><TrendUp weight="bold" /> Example week</span>
				<span class="muted">Sample data</span>
			</div>
			<div class="chart-total"><Counter to={12.4} prefix="+₦" suffix="k" decimals={1} /></div>
			<svg viewBox="0 0 {W} {H}" class="chart-svg" role="img" aria-label="Example gains rising from Monday to Friday">
				<defs>
					<linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stop-color="currentColor" stop-opacity="0.28" />
						<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
					</linearGradient>
				</defs>
				<path bind:this={fillEl} d={area} fill="url(#area)" style="opacity: 0" />
				<path bind:this={path} d={line} fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" />
				{#each pts as [x, y], i (i)}
					<circle bind:this={dots[i]} cx={x} cy={y} r="4.5" class="chart-dot" style="transform: scale(0)" />
				{/each}
				<circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r="10" class="chart-pulse" />
			</svg>
			<div class="chart-days" aria-hidden="true">{#each DAYS as d, i (i)}<span>{d}</span>{/each}</div>
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="Four ways to work the market." />
		<StickyStack items={WAYS}>
			{#snippet card(w)}
				<div class="step-card">
					<div class="step-txt">
						<span class="ic"><w.Icon weight="duotone" /></span>
						<h3>{w.t}</h3>
						<p>{w.d}</p>
					</div>
					<div class="step-img graded"><img src={w.photo.src(1280)} alt={w.photo.alt} loading="lazy" /></div>
				</div>
			{/snippet}
		</StickyStack>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="Spot hot areas before the crowd." />
		<ExpandRows rows={CORRIDORS} />
	</div>
</section>

<CtaBand photo={photos.skyline} title="Read the market, then trade it." />
