<script>
	import Broadcast from 'phosphor-svelte/lib/Broadcast';
	import Camera from 'phosphor-svelte/lib/Camera';
	import ClipboardText from 'phosphor-svelte/lib/ClipboardText';
	import UsersThree from 'phosphor-svelte/lib/UsersThree';
	import { pageTitle } from '#lib/site.svelte.js';
	import { magnetic, mix, onScroll, prefersReduced, range, reveal, spotlight } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import Btn from '#lib/components/Btn.svelte';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import SecHead from '#lib/components/SecHead.svelte';

	const TASKS = [
		{ Icon: UsersThree, t: 'Buyer showings', d: 'Bring capital onto the plot and walk buyers through it.', cls: 'b-photo', photo: photos.island },
		{ Icon: ClipboardText, t: 'Listing readiness', d: 'Prepare property for the market.', cls: 'b-2' },
		{ Icon: Camera, t: 'Site documentation', d: 'Photos and records that prove a listing is real.', cls: 'b-2' },
		{ Icon: Broadcast, t: 'Market activation', d: 'Keep demand moving across the listings you cover.', cls: 'b-4 b-tint' }
	];
	const STAGES = [
		['Lock in', 'Pick a task and commit to it.'],
		['Deliver', 'Do the work and submit your proof.'],
		['Get paid', 'Cash lands as soon as the work is accepted.']
	];

	// A tank that fills from "illiquid" to "liquid" as you scroll, lighting each stage on the way.
	let meter, level;
	let stages = [];
	$effect(() => {
		const apply = (p) => {
			level.style.transform = `scaleX(${p})`;
			stages.forEach((el, i) => {
				const at = (i + 1) / (STAGES.length + 0.4);
				const t = range(p, at - 0.15, at);
				el.style.opacity = String(mix(0.35, 1, t));
				el.style.transform = `translate3d(0, ${mix(12, 0, t)}px, 0)`;
			});
		};
		if (prefersReduced()) return apply(1);
		return onScroll(apply, meter, ['start 75%', 'end 60%']);
	});
</script>

<svelte:head><title>{pageTitle('Earn with property work')}</title></svelte:head>

<PageHero
	photo={photos.eko}
	eyebrow="Cuid Pro Cuo"
	title="Get paid for work that moves property."
	accent={['paid']}
	lead="Take on live opportunities across the real estate market. Cleaner listings, faster showings and deals that actually settle."
>
	<span class="magnetic" use:magnetic><Btn to="/signup">Join opportunities</Btn></span>
</PageHero>

<section class="section">
	<div class="wrap">
		<SecHead title="Hundreds of paid tasks, every day." />
		<div class="bento">
			{#each TASKS as task, i (task.t)}
				<div class="bento-cell {task.cls}" use:reveal={{ delay: i % 3 }}>
					<div class="card spot bento-link" class:graded={task.photo} role="presentation" onpointermove={spotlight}>
						{#if task.photo}<img class="bento-bg" src={task.photo.src(1280)} alt={task.photo.alt} loading="lazy" />{/if}
						<span class="ic bento-ic"><task.Icon weight="duotone" /></span>
						<span class="bento-txt"><h3>{task.t}</h3><p>{task.d}</p></span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="From illiquid to paid." />
		<div bind:this={meter} class="liquid">
			<div class="liquid-tank" aria-hidden="true">
				<span class="liquid-fill" bind:this={level} style="transform: scaleX(0)"></span>
				<span class="liquid-end liquid-start">Illiquid</span>
				<span class="liquid-end liquid-stop">Liquid</span>
			</div>
			<div class="liquid-stages">
				{#each STAGES as [t, d], i (t)}
					<div class="liquid-stage" bind:this={stages[i]} style="opacity: 0.35">
						<h3>{t}</h3>
						<p>{d}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<CtaBand photo={photos.lekki} title="Work that unlocks liquidity." label="Join opportunities" />
