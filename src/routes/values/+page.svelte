<script>
	import Files from 'phosphor-svelte/lib/Files';
	import Ruler from 'phosphor-svelte/lib/Ruler';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import { pageTitle } from '#lib/site.svelte.js';
	import { reveal, spotlight } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import RevealImage from '#lib/components/RevealImage.svelte';
	import ScrubText from '#lib/components/ScrubText.svelte';
	import SecHead from '#lib/components/SecHead.svelte';

	const ROWS = [
		[Ruler, 'Survey grade parcels', 'Boundaries are locked to surveyed beacons.'],
		[SealCheck, 'Appraised by registered surveyors', 'Prices come from appraisals, not agent quotations.'],
		[Files, 'Verified records', 'Each value links back to the title and survey it rests on.']
	];
	const BODIES = [
		['SURCON', 'Surveyors Registration Council of Nigeria'],
		['NIS', 'Nigerian Institution of Surveyors']
	];
</script>

<svelte:head><title>{pageTitle('Appraised values')}</title></svelte:head>

<PageHero
	photo={photos.survey}
	eyebrow="Cuid Values"
	title="Appraised values, not inflated quotes."
	accent={['Appraised']}
	lead="Every price on Cuiditi is tied to a registered surveyor's appraisal, so you negotiate from evidence."
/>

<section class="section">
	<div class="wrap">
		<ScrubText parts={['Too many listings carry prices pumped up by agents.', photos.skyline, 'Quotes built to impress, not to be trusted.', photos.lekki, 'Buyers often learn the real number only after money has moved.']} />
	</div>
</section>

<section class="section section-tight">
	<div class="wrap split">
		<RevealImage photo={photos.lekki} class="split-media tall" />
		<div>
			<SecHead title="Negotiate from evidence." text="Cuid Values ties every price to verified records, so you start from the actual value and not a middleman's markup." />
			<ul class="rows">
				{#each ROWS as [I, t, d], i (t)}
					<li class="row" use:reveal={{ delay: i }}>
						<span class="ic"><I weight="duotone" /></span>
						<span><b>{t}</b><span>{d}</span></span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="Backed by the professional bodies." />
		<div class="bodies">
			{#each BODIES as [a, b], i (a)}
				<div class="card spot body-card" role="presentation" use:reveal={{ delay: i }} onpointermove={spotlight}>
					<span class="body-abbr">{a}</span>
					<span class="body-name">{b}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<CtaBand photo={photos.eko} title="Know the real number first." />
