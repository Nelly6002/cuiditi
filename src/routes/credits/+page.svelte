<script>
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import { pageTitle } from '#lib/site.svelte.js';
	import { reveal } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import PageHero from '#lib/components/PageHero.svelte';
</script>

<svelte:head><title>{pageTitle('Photo credits')}</title></svelte:head>

<PageHero photo={photos.lagoon} title="Photo credits." lead="The photos on this site come from Wikimedia Commons. Thank you to the photographers below." />

<section class="section">
	<div class="wrap">
		<ul class="credits">
			{#each Object.entries(photos) as [k, p], i (k)}
				<li class="credit" use:reveal={{ delay: i % 4 }}>
					<span class="credit-img graded"><img src={p.src(330)} alt="" loading="lazy" /></span>
					<span class="credit-txt"><b>{p.title}</b><span class="muted">{p.credit}, {p.license}</span></span>
					<a class="tlink" href={p.page} target="_blank" rel="noreferrer">Source <ArrowUpRight weight="bold" aria-hidden="true" /></a>
				</li>
			{/each}
		</ul>
	</div>
</section>
