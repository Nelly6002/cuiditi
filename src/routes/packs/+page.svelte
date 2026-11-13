<script>
	import { crossfade, fly, scale } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import { pageTitle } from '#lib/site.svelte.js';
	import { reveal } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import { AUDIENCES } from '#lib/data/content.js';
	import Btn from '#lib/components/Btn.svelte';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import SecHead from '#lib/components/SecHead.svelte';

	const KINDS = [
		['Investment picks', 'Curated, verified properties chosen for steady yield.'],
		['Sales bundles', 'Groups of listings packaged so you can buy in one move.'],
		['Property plans', 'Pay toward a plot or home in stages that match your income.']
	];
	let index = $state(0);
	const a = $derived(AUDIENCES[index]);
	const [send, receive] = crossfade({ duration: 450, easing: cubicOut });

	function pick(n) {
		index = n;
		document.getElementById(`aud-tab-${n}`)?.focus();
	}
	function onKey(e, k) {
		const n = AUDIENCES.length;
		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') (e.preventDefault(), pick((k + 1) % n));
		if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') (e.preventDefault(), pick((k - 1 + n) % n));
	}
</script>

<svelte:head><title>{pageTitle('Cuid Packs')}</title></svelte:head>

<PageHero
	photo={photos.island}
	eyebrow="Cuid Packs"
	title="Invest and buy your way."
	accent={['your']}
	lead="Not one size fits all. Packs are matched to how Nigerians actually earn, save and close deals."
/>

<section class="section">
	<div class="wrap">
		<SecHead title="Who are you buying as?" />
		<div class="aud-tabs">
			<div class="aud-list" role="tablist" aria-label="Audiences" aria-orientation="vertical">
				{#each AUDIENCES as x, k (x.name)}
					<button
						type="button"
						role="tab"
						id="aud-tab-{k}"
						aria-selected={index === k}
						aria-controls="aud-panel"
						tabindex={index === k ? 0 : -1}
						class="aud-tab"
						onclick={() => (index = k)}
						onkeydown={(e) => onKey(e, k)}
					>
						{#if index === k}<span class="aud-pill" in:receive={{ key: 'aud' }} out:send={{ key: 'aud' }}></span>{/if}
						<span class="aud-tab-in"><x.Icon weight={index === k ? 'fill' : 'duotone'} />{x.name}</span>
					</button>
				{/each}
			</div>
			<div class="aud-panel card" id="aud-panel" role="tabpanel" aria-labelledby="aud-tab-{index}">
				{#key a.name}
					<div class="aud-panel-in" in:fly={{ y: 24, duration: 450, easing: cubicOut }}>
						<span class="aud-big-ic" in:scale={{ start: 0.5, duration: 600, easing: backOut }}><a.Icon weight="duotone" /></span>
						<h3>{a.name}</h3>
						<p class="aud-panel-lead">{a.lead}</p>
						<p class="muted">{a.text}</p>
						<Btn to="/signup">Get started</Btn>
					</div>
				{/key}
			</div>
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="Three kinds of Pack." />
		<ol class="kinds">
			{#each KINDS as [t, d], k (t)}
				<li class="kind" use:reveal={{ delay: k }}>
					<span class="kind-t">{t}</span>
					<span class="kind-d">{d}</span>
				</li>
			{/each}
		</ol>
	</div>
</section>

<CtaBand photo={photos.lagoon} title="Pick the Pack that fits you." />
