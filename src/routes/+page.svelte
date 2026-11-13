<script>
	import { animate } from 'motion';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import ArrowsLeftRight from 'phosphor-svelte/lib/ArrowsLeftRight';
	import Coins from 'phosphor-svelte/lib/Coins';
	import Drop from 'phosphor-svelte/lib/Drop';
	import Fingerprint from 'phosphor-svelte/lib/Fingerprint';
	import Handshake from 'phosphor-svelte/lib/Handshake';
	import LockKey from 'phosphor-svelte/lib/LockKey';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import MapPinArea from 'phosphor-svelte/lib/MapPinArea';
	import Ruler from 'phosphor-svelte/lib/Ruler';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import TrendUp from 'phosphor-svelte/lib/TrendUp';
	import UserPlus from 'phosphor-svelte/lib/UserPlus';
	import Wallet from 'phosphor-svelte/lib/Wallet';
	import { EASE, pageTitle, site } from '#lib/site.svelte.js';
	import { magnetic, mix, onScroll, prefersReduced, range, reveal, spotlight } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import { AUDIENCES, CORRIDORS } from '#lib/data/content.js';
	import Btn from '#lib/components/Btn.svelte';
	import CheckSequence from '#lib/components/CheckSequence.svelte';
	import Counter from '#lib/components/Counter.svelte';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import ExpandRows from '#lib/components/ExpandRows.svelte';
	import HorizontalPan from '#lib/components/HorizontalPan.svelte';
	import Odometer from '#lib/components/Odometer.svelte';
	import RevealImage from '#lib/components/RevealImage.svelte';
	import RevealWords from '#lib/components/RevealWords.svelte';
	import ScrubText from '#lib/components/ScrubText.svelte';
	import SecHead from '#lib/components/SecHead.svelte';
	import StickyStack from '#lib/components/StickyStack.svelte';
	import TextLink from '#lib/components/TextLink.svelte';
	import VelocityMarquee from '#lib/components/VelocityMarquee.svelte';

	// Hero: the photo sits in a rounded frame that pulls in as you scroll, with glass cards floating on top.
	let hero, frame, move, img, cardsLayer, content, cardA, cardB, ring;
	let arrived = false;

	$effect(() => {
		if (prefersReduced()) return;
		return onScroll(
			(p) => {
				const c = range(p, 0, 0.8);
				frame.style.clipPath = `inset(${mix(10, 90, c)}px ${mix(10, 72, c)}px ${mix(0, 140, c)}px ${mix(10, 72, c)}px round ${mix(28, 44, c)}px)`;
				move.style.transform = `translate3d(0, ${mix(0, 20, p)}%, 0) scale(${mix(1, 1.16, p)})`;
				content.style.transform = `translate3d(0, ${mix(0, 55, p)}%, 0)`;
				content.style.opacity = String(1 - range(p, 0, 0.5));
				cardsLayer.style.transform = `translate3d(0, ${mix(0, -60, p)}%, 0)`;
			},
			hero,
			['start start', 'end start']
		);
	});

	$effect(() => {
		if (!site.introDone || arrived) return;
		arrived = true;
		const fades = content.querySelectorAll('[data-fade]');
		if (prefersReduced()) {
			img.style.transform = 'none';
			[cardA, cardB, ...fades].forEach((el) => (el.style.opacity = '1'));
			ring.style.strokeDashoffset = '0';
			return;
		}
		animate(img, { scale: [1.25, 1] }, { duration: 2.6, ease: EASE });
		fades.forEach((el) => animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 0.9, ease: EASE, delay: Number(el.dataset.fade) }));
		[
			[cardA, 0.9, -8, 6],
			[cardB, 1.1, 10, 7]
		].forEach(([card, delay, drift, period]) => {
			animate(card, { opacity: [0, 1], y: [60, 0], scale: [0.92, 1] }, { type: 'spring', stiffness: 70, damping: 16, delay });
			animate(card.firstElementChild, { y: [0, drift, 0] }, { duration: period, repeat: Infinity, ease: 'easeInOut', delay: delay + 1 });
		});
		animate(ring, { strokeDashoffset: [1, 0] }, { duration: 1.6, delay: 1.3, ease: EASE });
	});

	const BENTO = [
		{ to: '/shares', Icon: Coins, t: 'Buy fractions from ₦1,000', d: 'Own a share of a verified plot instead of paying for all of it up front.', cls: 'b-photo', photo: photos.market },
		{ to: '/trade', Icon: TrendUp, t: 'Earn yield while you wait', d: 'Collect your share of rent on the properties you hold.', cls: 'b-2' },
		{ to: '/trade', Icon: ArrowsLeftRight, t: 'Trade on live markets', d: 'Flip stakes and follow demand in fast corridors.', cls: 'b-2' },
		{ to: '/verify', Icon: Fingerprint, t: 'Verify titles and ownership', d: 'Run the checks a lawyer would, in minutes.', cls: 'b-2 b-tint' },
		{ to: '/earn', Icon: Handshake, t: 'Get paid for property work', d: 'Take paid tasks that prepare and move listings.', cls: 'b-2' },
		{ to: '/values', Icon: Ruler, t: 'Prices backed by registered surveyors', d: 'Negotiate from appraised values instead of agent quotes.', cls: 'b-wide' }
	];

	const STEPS = [
		{ Icon: UserPlus, t: 'Create your account', d: 'Sign up with your email in a couple of minutes.', photo: photos.skyline },
		{ Icon: Wallet, t: 'Fund your wallet', d: 'Add money by bank transfer or card.', photo: photos.island },
		{ Icon: ArrowsLeftRight, t: 'Invest, trade or list', d: 'Pick a verified property, trade a position or list your own.', photo: photos.market },
		{ Icon: Coins, t: 'Get paid', d: 'Withdraw yield and profit straight to your bank.', photo: photos.lagoon }
	];

	const VERIFY_ROWS = [
		[MagnifyingGlass, 'Look up any title', 'Enter a Certificate of Occupancy or file number.'],
		[MapPinArea, 'See the parcel on a live map', 'Check boundaries and ownership before you commit.'],
		[LockKey, 'Pay through escrow', 'Funds are released only when your conditions are met.']
	];
</script>

<svelte:head><title>{pageTitle(null)}</title></svelte:head>

<section bind:this={hero} class="hhero">
	<div class="hhero-frame" bind:this={frame} style="clip-path: inset(10px 10px 0px 10px round 28px)">
		<div class="phero-move" bind:this={move}>
			<img bind:this={img} class="phero-img" src={photos.lagoon.src(1920)} alt={photos.lagoon.alt} fetchpriority="high" style="transform: scale(1.25)" />
		</div>
		<span class="phero-shade" aria-hidden="true"></span>
	</div>

	<div class="hhero-cards" bind:this={cardsLayer} aria-hidden="true">
		<div class="glass hcard hcard-a" bind:this={cardA} style="opacity: 0">
			<div class="hcard-float">
				<span class="hcard-ring">
					<svg viewBox="0 0 44 44">
						<circle cx="22" cy="22" r="20" class="ring-bg" />
						<circle bind:this={ring} cx="22" cy="22" r="20" class="ring-fg" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" />
					</svg>
					<SealCheck weight="fill" />
				</span>
				<span><b>Title check complete</b><small>C of O matched to the parcel</small></span>
			</div>
		</div>
		<div class="glass hcard hcard-b" bind:this={cardB} style="opacity: 0">
			<div class="hcard-float">
				<span class="hcard-ic"><Coins weight="fill" /></span>
				<span><b>From ₦1,000</b><small>Own a share of a verified plot</small></span>
			</div>
		</div>
	</div>

	<div class="wrap hhero-content" bind:this={content}>
		<RevealWords as="h1" text="Buy, verify and trade Nigerian property." accent={['property.']} show={site.introDone} delay={2} class="hhero-title" />
		<p class="phero-lead" data-fade="0.6" style="opacity: 0">Start from ₦1,000. Check any title before you pay and sell when you choose.</p>
		<div class="phero-actions" data-fade="0.78" style="opacity: 0">
			<span class="magnetic" use:magnetic><Btn to="/signup">Get started</Btn></span>
			<Btn to="/verify" variant="ghost">Try a title check</Btn>
		</div>
	</div>
</section>

<VelocityMarquee>
	{#each ['Verify', 'Secure', 'Shares', 'Trade', 'Earn', 'Values'] as w (w)}
		<span class="marquee-item">{w}<Drop weight="fill" /></span>
	{/each}
</VelocityMarquee>

<section class="section">
	<div class="wrap">
		<ScrubText parts={['Your cash should not freeze in land.', photos.lekki, 'Check the title,', photos.survey, 'lock the payment', photos.bridge, 'and sell the day you need out.']} />
		<div class="stats">
			<div class="stat" use:reveal>
				<span class="stat-num"><Counter to={100} prefix="₦" suffix="B+" /></span>
				<p>lost to property fraud in Nigeria every year, according to the EFCC.</p>
			</div>
			<div class="stat" use:reveal={{ delay: 1 }}>
				<span class="stat-num"><Counter to={90} /><span class="stat-dash">-</span><Counter to={180} /></span>
				<p>days a typical property deal takes to close. Your money waits the whole time.</p>
			</div>
			<div class="stat" use:reveal={{ delay: 2 }}>
				<span class="stat-num"><Counter to={1000} prefix="₦" /></span>
				<p>is all it takes to own a share of a verified plot on Cuiditi.</p>
			</div>
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap split">
		<RevealImage photo={photos.lekki} class="split-media tall">
			<CheckSequence class="split-overlay" />
		</RevealImage>
		<div>
			<SecHead title="See the land before you pay." accent={['land']} />
			<ul class="rows">
				{#each VERIFY_ROWS as [Icon, t, d], i (t)}
					<li class="row" use:reveal={{ delay: i }}>
						<span class="ic"><Icon weight="duotone" /></span>
						<span><b>{t}</b><span>{d}</span></span>
					</li>
				{/each}
			</ul>
			<div class="mt-32" use:reveal={{ delay: 3 }}><TextLink to="/verify">Open Verify</TextLink></div>
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="One wallet for every property move." text="Buy, earn, trade and sell without leaving the app." />
		<div class="bento">
			{#each BENTO as b, i (b.t)}
				<div class="bento-cell {b.cls}" use:reveal={{ delay: i % 3 }}>
					<a href={b.to} class="card spot bento-link" class:graded={b.photo} onpointermove={spotlight}>
						{#if b.photo}<img class="bento-bg" src={b.photo.src(1280)} alt={b.photo.alt} loading="lazy" />{/if}
						<span class="ic bento-ic"><b.Icon weight="duotone" /></span>
						<span class="bento-txt"><h3>{b.t}</h3><p>{b.d}</p></span>
						<span class="bento-go" aria-hidden="true"><ArrowUpRight weight="bold" /></span>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="Markets we watch." text="Spot the corridors where demand is rising before listings go live." />
		<ExpandRows rows={CORRIDORS} />
	</div>
</section>

<section class="cuids-band">
	<div class="wrap">
		<p class="eyebrow">Cuids</p>
		<div class="cuids-num"><Odometer value="150,000,000" /></div>
		<div class="cuids-foot">
			<p class="lead" use:reveal>One Cuid for each of the roughly 150 million square kilometres of land on earth. Then the supply locks for good.</p>
			<div use:reveal={{ delay: 2 }}><TextLink to="/cuids">How Cuids work</TextLink></div>
		</div>
	</div>
</section>

<HorizontalPan>
	{#snippet head()}
		<div class="hpan-headrow">
			<RevealWords text="Invest and buy your way." />
			<div use:reveal={{ delay: 3 }}><TextLink to="/packs">See all Packs</TextLink></div>
		</div>
	{/snippet}
	{#each AUDIENCES as a, i (a.name)}
		<article class="aud-card" class:aud-photo={a.photo} class:graded={a.photo} class:aud-tint={!a.photo && i % 2} onpointermove={spotlight}>
			{#if a.photo}<img src={a.photo.src(960)} alt={a.photo.alt} loading="lazy" />{/if}
			<span class="aud-ic"><a.Icon weight="duotone" /></span>
			<div class="aud-txt">
				<h3>{a.name}</h3>
				<p class="aud-lead">{a.lead}</p>
				<p>{a.text}</p>
			</div>
		</article>
	{/each}
</HorizontalPan>

<section class="section">
	<div class="wrap">
		<SecHead title="Four steps from sign up to payout." text="No months of paperwork. Create an account, fund it and start putting capital to work." />
		<StickyStack items={STEPS}>
			{#snippet card(s)}
				<div class="step-card">
					<div class="step-txt">
						<span class="ic"><s.Icon weight="duotone" /></span>
						<h3>{s.t}</h3>
						<p>{s.d}</p>
					</div>
					<div class="step-img graded"><img src={s.photo.src(1280)} alt={s.photo.alt} loading="lazy" /></div>
				</div>
			{/snippet}
		</StickyStack>
	</div>
</section>

<CtaBand photo={photos.bridge} />
