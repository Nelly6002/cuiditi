<script>
	import ChartPieSlice from 'phosphor-svelte/lib/ChartPieSlice';
	import LockSimple from 'phosphor-svelte/lib/LockSimple';
	import Prohibit from 'phosphor-svelte/lib/Prohibit';
	import { pageTitle } from '#lib/site.svelte.js';
	import { magnetic, reveal } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import Btn from '#lib/components/Btn.svelte';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import Odometer from '#lib/components/Odometer.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import RevealWords from '#lib/components/RevealWords.svelte';

	const RULES = [
		[LockSimple, 'The cap never moves', '150 million Cuids for 150 million km² of land, fixed from day one.'],
		[Prohibit, 'No hidden minting', 'There is no switch to make more. The supply is locked.'],
		[ChartPieSlice, 'No surprise dilution', 'More people join, the same 150 million Cuids. That is the scarcity.']
	];
</script>

<svelte:head><title>{pageTitle('Cuids')}</title></svelte:head>

<PageHero
	photo={photos.abuja}
	tall
	eyebrow="Cuids"
	title="Limited supply. Forever."
	accent={['Forever.']}
	lead="The earth has about 150 million square kilometres of land. Cuiditi mints one Cuid for each, then the supply locks."
>
	<span class="magnetic" use:magnetic><Btn to="/signup">Claim Cuids</Btn></span>
</PageHero>

<section class="cuids-band">
	<div class="wrap">
		<div class="cuids-num"><Odometer value="150,000,000" /></div>
		<div class="cuids-foot">
			<p class="lead" use:reveal>Cuids for 150 million km² of land. When demand rises, nobody can print more.</p>
		</div>
	</div>
</section>

<section class="section">
	<div class="wrap sticky-split">
		<div class="sticky-col"><RevealWords text="Scarce by design." /></div>
		<ul class="rows big-rows">
			{#each RULES as [I, t, d], i (t)}
				<li class="row" use:reveal={{ delay: i }}>
					<span class="ic"><I weight="duotone" /></span>
					<span><b>{t}</b><span>{d}</span></span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<CtaBand photo={photos.market} title="Start earning your own Cuids." text="More will never be minted." label="Claim Cuids" />
